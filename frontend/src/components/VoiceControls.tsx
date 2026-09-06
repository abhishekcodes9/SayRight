import React from 'react';
import { DEFAULT_VOICE_CONFIG } from '../mockData';

interface VoiceControlsProps {
  hasInput: boolean;
  hasPrepared: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  hasInput,
  hasPrepared
}) => {
  return (
    <section className="card voice-section">
      <div className="section-header">
        <div className="title-row">
          <span className="step-number">04</span>
          <h2 className="section-title">Controlled Speech Synthesis</h2>
        </div>
        <div className="controlled-badge" title="Scientific parity: Identical TTS parameters ensure pure text-level enhancement comparison">
          <span className="lock-icon">🔒</span>
          <span>1:1 Controlled Parity</span>
        </div>
      </div>

      {/* Controlled Parameter Banner */}
      <div className="voice-params-banner">
        <div className="param-item">
          <span className="param-label">Rime Model:</span>
          <span className="param-value">{DEFAULT_VOICE_CONFIG.modelId}</span>
        </div>
        <div className="param-item">
          <span className="param-label">Speaker:</span>
          <span className="param-value">{DEFAULT_VOICE_CONFIG.speaker}</span>
        </div>
        <div className="param-item">
          <span className="param-label">Language:</span>
          <span className="param-value">English ({DEFAULT_VOICE_CONFIG.lang})</span>
        </div>
        <div className="param-item">
          <span className="param-label">Parity Guarantee:</span>
          <span className="param-value highlight">Enforced Identical</span>
        </div>
      </div>

      {/* Dual Voice Synthesis Cards */}
      <div className="voice-grid">
        {/* Raw Voice Card */}
        <div className="voice-card raw-voice-card">
          <div className="voice-card-header">
            <div className="voice-title-group">
              <span className="voice-badge raw-badge">Voice A</span>
              <h3 className="voice-card-title">Raw Technical Voice</h3>
            </div>
            <span className="voice-subtitle">Sends unmodified raw text to Rime</span>
          </div>

          <div className="audio-player-mock">
            <div className="waveform-mock">
              <span className="bar bar-1"></span>
              <span className="bar bar-2"></span>
              <span className="bar bar-3"></span>
              <span className="bar bar-4"></span>
              <span className="bar bar-5"></span>
              <span className="bar bar-6"></span>
              <span className="bar bar-7"></span>
              <span className="bar bar-8"></span>
              <span className="bar bar-9"></span>
              <span className="bar bar-10"></span>
              <span className="bar bar-11"></span>
              <span className="bar bar-12"></span>
            </div>
            <div className="player-meta">
              <span className="time-display">0:00 / --:--</span>
              <span className="format-tag">MP3 (24kHz)</span>
            </div>
          </div>

          <div className="voice-card-actions">
            <button
              type="button"
              className="btn btn-voice btn-raw-voice"
              disabled={!hasInput}
            >
              <span className="btn-icon">▶</span>
              <span>Speak Raw (Rime API)</span>
            </button>
          </div>
          <p className="voice-note">
            ⚠️ Standard TTS reading raw tokens without phonetic engineering.
          </p>
        </div>

        {/* SayRight Prepared Voice Card */}
        <div className="voice-card prepared-voice-card">
          <div className="voice-card-header">
            <div className="voice-title-group">
              <span className="voice-badge prepared-badge">Voice B</span>
              <h3 className="voice-card-title">SayRight Prepared Voice</h3>
            </div>
            <span className="voice-subtitle">Sends speech-prepared text to Rime</span>
          </div>

          <div className="audio-player-mock">
            <div className="waveform-mock active-waveform">
              <span className="bar bar-1"></span>
              <span className="bar bar-2"></span>
              <span className="bar bar-3"></span>
              <span className="bar bar-4"></span>
              <span className="bar bar-5"></span>
              <span className="bar bar-6"></span>
              <span className="bar bar-7"></span>
              <span className="bar bar-8"></span>
              <span className="bar bar-9"></span>
              <span className="bar bar-10"></span>
              <span className="bar bar-11"></span>
              <span className="bar bar-12"></span>
            </div>
            <div className="player-meta">
              <span className="time-display">0:00 / --:--</span>
              <span className="format-tag">MP3 (24kHz)</span>
            </div>
          </div>

          <div className="voice-card-actions">
            <button
              type="button"
              className="btn btn-voice btn-prepared-voice"
              disabled={!hasPrepared}
            >
              <span className="btn-icon">⚡</span>
              <span>Speak with SayRight</span>
            </button>
          </div>
          <p className="voice-note success">
            ✨ Enhanced pronunciation with natural cadence & precise technical articulation.
          </p>
        </div>
      </div>
    </section>
  );
};
