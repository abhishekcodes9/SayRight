import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { TextInput } from './components/TextInput';
import { ComparisonView } from './components/ComparisonView';
import { TransformationExplainer } from './components/TransformationExplainer';
import { VoiceControls } from './components/VoiceControls';
import { EvaluationPlaceholder } from './components/EvaluationPlaceholder';
import { STRESS_TEST_PROMPT } from './mockData';
import type { ExamplePreset, SpeechPrepResult } from './types';
import './App.css';

const API_URL = 'http://localhost:3001/api/prepare';
const SPEAK_URL = 'http://localhost:3001/api/speak';

export function App() {
  const [inputText, setInputText] = useState<string>(STRESS_TEST_PROMPT.text);
  const [prepResult, setPrepResult] = useState<SpeechPrepResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rawAudioLoading, setRawAudioLoading] = useState<boolean>(false);
  const [preparedAudioLoading, setPreparedAudioLoading] = useState<boolean>(false);
  const [rawAudioError, setRawAudioError] = useState<string | null>(null);
  const [preparedAudioError, setPreparedAudioError] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeUrlRef = useRef<string | null>(null);

  const handleSelectPreset = (preset: ExamplePreset) => {
    setInputText(preset.text);
    setPrepResult(null);
    setError(null);
  };

  const handlePrepare = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setPrepResult(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || `HTTP ${response.status}`);
      }

      const data: SpeechPrepResult = await response.json();
      setPrepResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speech preparation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setPrepResult(null);
    setError(null);
  };

  const playAudio = async (text: string, variant: 'raw' | 'prepared') => {
    const setLoading = variant === 'raw' ? setRawAudioLoading : setPreparedAudioLoading;
    const setErr = variant === 'raw' ? setRawAudioError : setPreparedAudioError;

    // Stop/cleanup any existing audio before starting a new one
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (activeUrlRef.current) {
      URL.revokeObjectURL(activeUrlRef.current);
      activeUrlRef.current = null;
    }

    setLoading(true);
    setErr(null);

    try {
      const response = await fetch(SPEAK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          speaker: 'astra',
          modelId: 'coda',
          lang: 'en'
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || `HTTP ${response.status}`);
      }

      const audioBlob = await response.blob();
      // The Rime backend returns raw PCM audio labeled as audio/mpeg.
      // Wrap it in a WAV container so HTMLAudioElement can play it.
      const pcmBuffer = await audioBlob.arrayBuffer();
      const pcmData = new Uint8Array(pcmBuffer);
      const sampleRate = 22050;
      const numChannels = 1;
      const bitsPerSample = 16;
      const byteRate = sampleRate * numChannels * bitsPerSample / 8;
      const blockAlign = numChannels * bitsPerSample / 8;
      const dataLength = pcmData.length;
      const wavLength = 36 + dataLength;

      const wavBuffer = new ArrayBuffer(44 + dataLength);
      const view = new DataView(wavBuffer);
      const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
      };
      writeString(0, 'RIFF');
      view.setUint32(4, wavLength, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
      view.setUint16(20, 1, true); // AudioFormat (PCM = 1)
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, byteRate, true);
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, bitsPerSample, true);
      writeString(36, 'data');
      view.setUint32(40, dataLength, true);
      const wavBytes = new Uint8Array(wavBuffer);
      wavBytes.set(pcmData, 44);
      const objectUrl = URL.createObjectURL(new Blob([wavBytes], { type: 'audio/wav' }));
      activeUrlRef.current = objectUrl;

      const audio = new Audio();
      activeAudioRef.current = audio;
      audio.src = objectUrl;
      audio.load();
      audio.onended = () => {
        if (activeUrlRef.current) URL.revokeObjectURL(activeUrlRef.current);
        activeUrlRef.current = null;
        activeAudioRef.current = null;
      };
      audio.onerror = () => {
        if (activeUrlRef.current) URL.revokeObjectURL(activeUrlRef.current);
        activeUrlRef.current = null;
        activeAudioRef.current = null;
        setErr('Failed to play audio');
      };
      await audio.play();
    } catch (err) {
      setErr(err instanceof Error ? err.message : 'Speech generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakRaw = () => {
    if (!inputText.trim()) return;
    playAudio(inputText, 'raw');
  };

  const handleSpeakPrepared = () => {
    if (!prepResult?.preparedText.trim()) return;
    playAudio(prepResult.preparedText, 'prepared');
  };

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <div className="layout-grid">
          {/* Step 1: Input & Presets */}
          <TextInput
            value={inputText}
            onChange={setInputText}
            onPrepare={handlePrepare}
            onClear={handleClear}
            onSelectPreset={handleSelectPreset}
            isLoading={isLoading}
          />

          {/* Error state */}
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Step 2: Side-by-Side Comparison */}
          <ComparisonView result={prepResult} />

          {/* Step 3: Transformation Audit / Explainer */}
          <TransformationExplainer changes={prepResult?.changes || []} />

          {/* Step 4: Controlled Voice Comparison Controls */}
          <VoiceControls
            hasInput={Boolean(inputText.trim())}
            hasPrepared={Boolean(prepResult?.preparedText.trim())}
            rawAudioLoading={rawAudioLoading}
            preparedAudioLoading={preparedAudioLoading}
            rawAudioError={rawAudioError}
            preparedAudioError={preparedAudioError}
            onSpeakRaw={handleSpeakRaw}
            onSpeakPrepared={handleSpeakPrepared}
          />

          {/* Step 5: Evaluation Section */}
          <EvaluationPlaceholder />
        </div>
      </main>

      <footer className="footer">
        <div className="footer-container">
          <p className="footer-text">
            <strong>SayRight</strong> — Voice engineering tool for technical Text-to-Speech synthesis.
          </p>
          <p className="footer-subtext">
            Built for DataForge 2026 Hackathon • Powered by Rime TTS API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
