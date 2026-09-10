import { useState, useRef, useEffect, useMemo } from 'react';
import type { SpeechChange, SpeechPrepResult, ExamplePreset } from '../types';

const API_URL = 'https://sayright-backend.vercel.app/api/prepare';
const SPEAK_URL = 'https://sayright-backend.vercel.app/api/speak';

const PRESETS: ExamplePreset[] = [
  { id: 'oauth', label: 'OAuth 2.0', text: 'Authenticate client using OAuth 2.0 and JWT bearer tokens over HTTPS.', description: 'Protocol name & semantic versioning', category: 'Auth' },
  { id: 'postgres', label: 'PostgreSQL', text: 'Configure PostgreSQL connection pooling with SSL encryption enabled.', description: 'Database pronunciation & acronyms', category: 'Database' },
  { id: 'k8s', label: 'Kubernetes', text: 'Scale the microservice on a Kubernetes cluster using k8s ingress v1.28.0.', description: 'DevOps terminology & version numbers', category: 'DevOps' },
  { id: 'sha256', label: 'SHA-256', text: 'Verify the file integrity using SHA-256 and MD5-128 cryptographic checksums.', description: 'Cryptographic algorithms & bit lengths', category: 'Crypto' },
  { id: 'websocket', label: 'WebSocket', text: 'Establish full-duplex WebSocket connection at wss://api.example.com/v2/stream for real-time IPC.', description: 'Protocols & URI structures', category: 'Network' },
  { id: 'xgboost', label: 'XGBoost', text: 'Train the XGBoost classifier model with CUDA acceleration and evaluate via ROC-AUC.', description: 'Machine learning libraries & metrics', category: 'ML/AI' },
];

const STRESS_TEST: ExamplePreset = {
  id: 'stress-test',
  label: 'Stress Test',
  text: 'Deploy the OAuth 2.0 API v1.14.2 on a Kubernetes cluster with CI/CD, PostgreSQL replication, and SHA-256 signed JWT tokens over HTTPS.',
  description: 'A sentence combining seven technical speech patterns',
  category: 'Stress Test',
};

const VOICE_CONFIG = { speaker: 'astra', modelId: 'coda', lang: 'en' };

type Variant = 'raw' | 'prepared';
interface AudioState { loading: boolean; error: string | null; url: string | null; playing: boolean; currentTime: number; duration: number; }
const EMPTY_AUDIO: AudioState = { loading: false, error: null, url: null, playing: false, currentTime: 0, duration: 0 };
const WAVE = [42, 70, 36, 82, 56, 28, 65, 91, 47, 73, 39, 84, 52, 32, 69, 88, 44, 76, 35, 64, 49, 80, 57, 30];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
}

function Spinner() {
  return <span className="ssp-spinner" aria-hidden="true"></span>;
}

function pcmToWavUrl(pcmBuffer: ArrayBuffer): string {
  const pcmData = new Uint8Array(pcmBuffer);
  const sampleRate = 22050;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataLength = pcmData.length;
  const wavBuffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(wavBuffer);
  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);
  new Uint8Array(wavBuffer).set(pcmData, 44);
  return URL.createObjectURL(new Blob([wavBuffer], { type: 'audio/wav' }));
}

function Wordmark() {
  return (
    <div className="ssp-wordmark">
      <span className="ssp-wordmark-icon" aria-hidden="true">🔊</span>
      <span>SayRight</span>
    </div>
  );
}

function SectionMarker({ children, tone }: { children: React.ReactNode; tone?: 'primary' | 'prepared' }) {
  return <p className={tone === 'prepared' ? 'ssp-marker ssp-marker-prepared' : 'ssp-marker'}>{children}</p>;
}

function TextWorkspace({
  value, loading, onChange, onPrepare, onClear, onPreset,
}: {
  value: string; loading: boolean; onChange: (v: string) => void; onPrepare: () => void; onClear: () => void; onPreset: (p: ExamplePreset) => void;
}) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const activePreset = [...PRESETS, STRESS_TEST].find((p) => p.text === value)?.id;

  return (
    <section aria-labelledby="workspace-title" className="ssp-section">
      <div className="ssp-editor-shell">
        <div className="ssp-editor-bar">
          <div className="ssp-editor-dots">
            <i className="ssp-dot ssp-dot-raw" aria-hidden="true"></i>
            <i className="ssp-dot ssp-dot-warn" aria-hidden="true"></i>
            <i className="ssp-dot ssp-dot-prep" aria-hidden="true"></i>
          </div>
          <div className="ssp-editor-sep" aria-hidden="true"></div>
          <h2 id="workspace-title" className="ssp-editor-filename">buffer.txt</h2>
          {value && <span className="ssp-unsaved" aria-label="Unsaved text"></span>}
          <span className="ssp-utf8">UTF-8</span>
        </div>
        <div className="ssp-editor-body">
          <div className="ssp-line-numbers" aria-hidden="true">
            <div>01</div><div>02</div><div>03</div>
          </div>
          <textarea
            aria-label="Technical text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste or type technical text here…"
            className="ssp-editor-textarea"
          />
        </div>
        <div className="ssp-editor-footer">
          <div className="ssp-editor-stats">
            <span>{words} words</span>
            <span className="ssp-sep">·</span>
            <span>{value.length} chars</span>
            {value && <button onClick={onClear} disabled={loading} className="ssp-link">Clear</button>}
          </div>
          <button onClick={onPrepare} disabled={!value.trim() || loading} className="ssp-btn-primary">
            {loading ? <><Spinner />Preparing speech</> : <>Prepare Speech<ArrowRightIcon /> </>}
          </button>
        </div>
      </div>
      <div className="ssp-presets">
        <span className="ssp-presets-label">Presets:</span>
        <div className="ssp-presets-row">
          {[...PRESETS, STRESS_TEST].map((preset) => (
            <button
              key={preset.id}
              title={preset.description}
              onClick={() => onPreset(preset)}
              className={activePreset === preset.id ? 'ssp-chip ssp-chip-active' : 'ssp-chip'}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function TextComparison({ result }: { result: SpeechPrepResult }) {
  return (
    <section aria-labelledby="text-comparison-title" className="ssp-section ssp-section-alt">
      <SectionMarker tone="prepared">Prepared output</SectionMarker>
      <h2 id="text-comparison-title" className="ssp-heading">See exactly what changed.</h2>
      <p className="ssp-desc">The meaning stays intact. Only the spoken form is prepared.</p>
      <div className="ssp-comparison-grid">
        <article className="ssp-comp-card">
          <div className="ssp-comp-card-bar"><span className="ssp-dot ssp-dot-raw" aria-hidden="true"></span>Original text</div>
          <p className="ssp-comp-text">{result.originalText}</p>
        </article>
        <article className="ssp-comp-card ssp-comp-card-prepared">
          <div className="ssp-comp-card-bar"><span className="ssp-dot ssp-dot-prep" aria-hidden="true"></span>SayRight prepared text</div>
          <p className="ssp-comp-text ssp-comp-text-prepared">{result.preparedText}</p>
        </article>
      </div>
    </section>
  );
}

function Waveform({ tone, active }: { tone: Variant; active: boolean }) {
  return (
    <div className="ssp-waveform" aria-hidden="true">
      {WAVE.map((height, index) => (
        <span
          key={index}
          className={`ssp-wave-bar ssp-wave-${tone} ${active ? 'ssp-wave-active' : ''}`}
          style={{ height: `${height}%`, animationDelay: `${index * 45}ms` }}
        />
      ))}
    </div>
  );
}

function AudioPanel({
  variant, state, canGenerate, onGenerate, onToggle, onSeek,
}: {
  variant: Variant; state: AudioState; canGenerate: boolean; onGenerate: () => void; onToggle: () => void; onSeek: (v: number) => void;
}) {
  const prepared = variant === 'prepared';
  const progress = state.duration ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <article className={`ssp-audio-card ${prepared ? 'ssp-audio-prepared' : 'ssp-audio-raw'}`}>
      <div className="ssp-audio-head">
        <div>
          <div className={prepared ? 'ssp-audio-label ssp-audio-label-prepared' : 'ssp-audio-label'}>
            <span className={`ssp-dot ${prepared ? 'ssp-dot-prep ssp-dot-glow' : 'ssp-dot-raw'}`} aria-hidden="true"></span>
            {prepared ? 'SayRight prepared' : 'Raw Rime'}
          </div>
          <p className="ssp-audio-desc">{prepared ? 'Prepared text sent to Rime.' : 'Unmodified text sent to Rime.'}</p>
        </div>
        <span className="ssp-audio-badge">{prepared ? 'Prepared' : 'Original'}</span>
      </div>
      <Waveform tone={variant} active={state.playing || state.loading} />
      <div className="ssp-audio-body">
        {state.url ? (
          <div className="ssp-audio-player">
            <button
              aria-label={state.playing ? `Pause ${variant} audio` : `Play ${variant} audio`}
              onClick={onToggle}
              className={`ssp-btn-play ${prepared ? 'ssp-btn-play-prepared' : 'ssp-btn-play-raw'}`}
            >
              {state.playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <div className="ssp-progress-wrap">
              <input
                aria-label={`${variant} audio progress`}
                type="range"
                min={0}
                max={state.duration || 0}
                step="0.01"
                value={state.currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className={`ssp-range ${prepared ? 'ssp-range-prepared' : 'ssp-range-raw'}`}
                style={{ '--progress': `${progress}%` } as React.CSSProperties}
              />
              <div className="ssp-time"><span>{formatTime(state.currentTime)}</span><span>{formatTime(state.duration)}</span></div>
            </div>
          </div>
        ) : (
          <button onClick={onGenerate} disabled={!canGenerate || state.loading} className={`ssp-btn-generate ${prepared ? 'ssp-btn-generate-prepared' : 'ssp-btn-generate-raw'}`}>
            {state.loading ? <><Spinner />Speaking…</> : <><PlayIcon />{prepared ? 'Speak Prepared' : 'Speak Raw'}</>}
          </button>
        )}
        {state.error && <p role="alert" className="ssp-error"><AlertIcon />{state.error}</p>}
      </div>
    </article>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function AudioComparison({
  inputText, result, audio, onGenerate, onToggle, onSeek,
}: {
  inputText: string; result: SpeechPrepResult | null; audio: Record<Variant, AudioState>; onGenerate: (v: Variant) => void; onToggle: (v: Variant) => void; onSeek: (v: Variant, value: number) => void;
}) {
  return (
    <section aria-labelledby="audio-title" className="ssp-section ssp-section-alt">
      <div className="ssp-audio-header-grid">
        <div>
          <SectionMarker>Controlled comparison</SectionMarker>
          <h2 id="audio-title" className="ssp-heading">Same voice. <em>Clearer input.</em></h2>
          <p className="ssp-desc">Both samples use the same Rime voice and configuration. Only the text is prepared by SayRight.</p>
        </div>
        <dl className="ssp-voice-params">
          <div><dt>Speaker</dt><dd>astra</dd></div>
          <div><dt>Model</dt><dd>coda</dd></div>
          <div><dt>Language</dt><dd>en</dd></div>
        </dl>
      </div>
      <div className="ssp-audio-grid">
        <AudioPanel variant="raw" state={audio.raw} canGenerate={Boolean(inputText.trim())} onGenerate={() => onGenerate('raw')} onToggle={() => onToggle('raw')} onSeek={(v) => onSeek('raw', v)} />
        <div className="ssp-vs-dot" aria-hidden="true">VS</div>
        <div className="ssp-vs-mobile"><span className="ssp-sep-line" /><span className="ssp-vs-mobile-label">VS · SAME CONFIGURATION</span><span className="ssp-sep-line" /></div>
        <AudioPanel variant="prepared" state={audio.prepared} canGenerate={Boolean(result?.preparedText.trim())} onGenerate={() => onGenerate('prepared')} onToggle={() => onToggle('prepared')} onSeek={(v) => onSeek('prepared', v)} />
      </div>
    </section>
  );
}

function Audit({ changes }: { changes: SpeechChange[] }) {
  return (
    <section aria-labelledby="audit-title" className="ssp-section">
      <SectionMarker>Transformation audit · {changes.length.toString().padStart(2, '0')}</SectionMarker>
      <h2 id="audit-title" className="ssp-heading">What SayRight changed</h2>
      <p className="ssp-desc">Deterministic expansions returned by the speech-preparation service.</p>
      <div className="ssp-audit-table">
        <div className="ssp-audit-head">
          <span>Before</span><span />
          <span>After</span><span>Why</span>
        </div>
        {changes.map((change, index) => (
          <div key={`${change.original}-${index}`} className="ssp-audit-row">
            <div><span className="ssp-audit-label-mobile">Before</span><code className="ssp-code ssp-code-raw">{change.original}</code></div>
            <ArrowRightSmall />
            <div><span className="ssp-audit-label-mobile">After</span><code className="ssp-code ssp-code-prepared">{change.prepared}</code></div>
            <div><span className="ssp-audit-label-mobile">Why</span><p className="ssp-reason">{change.reason}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArrowRightSmall() {
  return (
    <svg className="ssp-audit-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function SayRightStudio() {
  const [inputText, setInputText] = useState(STRESS_TEST.text);
  const [result, setResult] = useState<SpeechPrepResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audio, setAudio] = useState<Record<Variant, AudioState>>({ raw: { ...EMPTY_AUDIO }, prepared: { ...EMPTY_AUDIO } });
  const audioRefs = useRef<Record<Variant, HTMLAudioElement | null>>({ raw: null, prepared: null });
  const urlsRef = useRef<Record<Variant, string | null>>({ raw: null, prepared: null });

  const resetAudio = (variant?: Variant) => {
    const targets: Variant[] = variant ? [variant] : ['raw', 'prepared'];
    targets.forEach((target) => { audioRefs.current[target]?.pause(); audioRefs.current[target] = null; if (urlsRef.current[target]) URL.revokeObjectURL(urlsRef.current[target] as string); urlsRef.current[target] = null; });
    setAudio((current) => ({ ...current, ...Object.fromEntries(targets.map((target) => [target, { ...EMPTY_AUDIO }])) } as Record<Variant, AudioState>));
  };

  useEffect(() => () => { (['raw', 'prepared'] as Variant[]).forEach((variant) => { audioRefs.current[variant]?.pause(); if (urlsRef.current[variant]) URL.revokeObjectURL(urlsRef.current[variant] as string); }); }, []);

  const handlePrepare = async () => {
    if (!inputText.trim()) return;
    setLoading(true); setError(null); setResult(null); resetAudio();
    try {
      const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: inputText }) });
      if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message || `HTTP ${response.status}`); }
      setResult(await response.json() as SpeechPrepResult);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Speech preparation failed'); }
    finally { setLoading(false); }
  };

  const generateAudio = async (variant: Variant) => {
    const text = variant === 'raw' ? inputText : result?.preparedText;
    if (!text?.trim()) return;
    (['raw', 'prepared'] as Variant[]).forEach((target) => { audioRefs.current[target]?.pause(); setAudio((current) => ({ ...current, [target]: { ...current[target], playing: false } })); });
    if (urlsRef.current[variant]) { URL.revokeObjectURL(urlsRef.current[variant] as string); urlsRef.current[variant] = null; }
    setAudio((current) => ({ ...current, [variant]: { ...EMPTY_AUDIO, loading: true } }));
    try {
      const response = await fetch(SPEAK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, speaker: VOICE_CONFIG.speaker, modelId: VOICE_CONFIG.modelId, lang: VOICE_CONFIG.lang }) });
      if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message || `HTTP ${response.status}`); }
      const url = pcmToWavUrl(await (await response.blob()).arrayBuffer());
      const element = new Audio(url);
      urlsRef.current[variant] = url; audioRefs.current[variant] = element;
      element.onloadedmetadata = () => setAudio((current) => ({ ...current, [variant]: { ...current[variant], duration: element.duration } }));
      element.ontimeupdate = () => setAudio((current) => ({ ...current, [variant]: { ...current[variant], currentTime: element.currentTime } }));
      element.onplay = () => setAudio((current) => ({ ...current, [variant]: { ...current[variant], playing: true } }));
      element.onpause = () => setAudio((current) => ({ ...current, [variant]: { ...current[variant], playing: false } }));
      element.onended = () => setAudio((current) => ({ ...current, [variant]: { ...current[variant], playing: false, currentTime: element.duration } }));
      element.onerror = () => setAudio((current) => ({ ...current, [variant]: { ...current[variant], playing: false, error: 'Failed to play audio' } }));
      setAudio((current) => ({ ...current, [variant]: { ...EMPTY_AUDIO, url } }));
      await element.play();
    } catch (caught) { setAudio((current) => ({ ...current, [variant]: { ...EMPTY_AUDIO, error: caught instanceof Error ? caught.message : 'Speech generation failed' } })); }
  };

  const toggleAudio = async (variant: Variant) => {
    const element = audioRefs.current[variant]; if (!element) return;
    const other: Variant = variant === 'raw' ? 'prepared' : 'raw';
    audioRefs.current[other]?.pause();
    if (element.ended) element.currentTime = 0;
    if (element.paused) await element.play(); else element.pause();
  };

  const seekAudio = (variant: Variant, value: number) => { const element = audioRefs.current[variant]; if (element) element.currentTime = value; };

  const displayResult = useMemo(() => result, [result]);

  return (
    <div className="ssp-root">
      <header className="ssp-header">
        <div className="ssp-header-inner">
          <Wordmark />
          <div className="ssp-rime-badge"><span className="ssp-dot ssp-dot-prep ssp-dot-glow" aria-hidden="true"></span>Powered by <strong>Rime</strong></div>
        </div>
      </header>
      <main>
        <section className="ssp-hero ssp-container">
          <SectionMarker>Speech preparation</SectionMarker>
          <h1 className="ssp-hero-title">Make technical text <em>easier to say.</em></h1>
          <p className="ssp-hero-desc">Prepare difficult technical language for clearer TTS delivery using deterministic speech-preparation rules — without changing the intended meaning.</p>
          <div className="ssp-hero-tags">
            <span>Deterministic rules</span><span>Technical text</span><span className="ssp-tag-prepared">Rime TTS</span>
          </div>
          <TextWorkspace value={inputText} loading={loading} onChange={(v) => { setInputText(v); setResult(null); setError(null); resetAudio(); }} onPrepare={handlePrepare} onClear={() => { setInputText(''); setResult(null); setError(null); resetAudio(); }} onPreset={(preset) => { setInputText(preset.text); setResult(null); setError(null); resetAudio(); }} />
          {error && (
            <div role="alert" className="ssp-error-banner">
              <AlertIcon />
              <span>{error}</span>
              <button onClick={handlePrepare} className="ssp-retry-btn"><RetryIcon />Retry</button>
            </div>
          )}
        </section>
        <div className="ssp-workspace ssp-container">
          <div className="ssp-workspace-inner ssp-container">
            {displayResult && <TextComparison result={displayResult} />}
            <AudioComparison inputText={inputText} result={displayResult} audio={audio} onGenerate={generateAudio} onToggle={toggleAudio} onSeek={seekAudio} />
            {displayResult && <Audit changes={displayResult.changes} />}
          </div>
        </div>
      </main>
      <footer className="ssp-footer">
        <span>SayRight — speech preparation for difficult technical text.</span>
        <span className="ssp-footer-config"><CheckIcon />astra · coda · en</span>
      </footer>
    </div>
  );
}

function RetryIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
    </svg>
  );
}
