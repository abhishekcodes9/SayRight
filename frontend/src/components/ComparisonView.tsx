import React from 'react';
import type { SpeechPrepResult } from '../types';

interface ComparisonViewProps {
  result: SpeechPrepResult | null;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ result }) => {
  if (!result) {
    return (
      <section className="card comparison-section empty-state">
        <div className="section-header">
          <div className="title-row">
            <span className="step-number">02</span>
            <h2 className="section-title">Original vs. SayRight Prepared</h2>
          </div>
        </div>
        <div className="empty-message">
          <span className="empty-icon">📝</span>
          <p>Enter technical text above and click <strong>Prepare Speech</strong> to see the side-by-side comparison.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card comparison-section">
      <div className="section-header">
        <div className="title-row">
          <span className="step-number">02</span>
          <h2 className="section-title">Original vs. SayRight Prepared</h2>
        </div>
        <div className="status-badge preview">
          <span>Preview</span>
        </div>
      </div>

      <div className="comparison-grid">
        {/* Original Raw Text Card */}
        <div className="comparison-card original-card">
          <div className="card-top-bar">
            <div className="card-label">
              <span className="dot dot-raw"></span>
              <span className="label-text">Original Raw Text</span>
            </div>
            <span className="badge badge-raw">Raw Input</span>
          </div>
          <div className="card-content monospace-view">
            <p className="text-display raw-text">{result.originalText}</p>
          </div>
          <div className="card-footer">
            <span className="footer-note">Standard TTS reads raw unexpanded syntax directly.</span>
          </div>
        </div>

        {/* SayRight Prepared Text Card */}
        <div className="comparison-card prepared-card">
          <div className="card-top-bar">
            <div className="card-label">
              <span className="dot dot-prepared"></span>
              <span className="label-text">SayRight Prepared Text</span>
            </div>
            <span className="badge badge-prepared">Speech Prepared</span>
          </div>
          <div className="card-content monospace-view">
            <p className="text-display prepared-text">{result.preparedText}</p>
          </div>
          <div className="card-footer">
            <span className="footer-note">Expanded with deterministic phonetic rules for natural TTS delivery.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
