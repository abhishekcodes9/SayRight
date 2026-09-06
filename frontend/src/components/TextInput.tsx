import React from 'react';
import { EXAMPLE_CHIPS, STRESS_TEST_PROMPT } from '../mockData';
import type { ExamplePreset } from '../types';

interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
  onPrepare: () => void;
  onClear: () => void;
  onSelectPreset: (preset: ExamplePreset) => void;
  isLoading?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onPrepare,
  onClear,
  onSelectPreset,
  isLoading = false
}) => {
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <section className="card input-section">
      <div className="section-header">
        <div className="title-row">
          <span className="step-number">01</span>
          <h2 className="section-title">Technical Text Input</h2>
        </div>
        <div className="input-stats">
          <span>{charCount} characters</span>
          <span className="stat-separator">•</span>
          <span>{wordCount} words</span>
        </div>
      </div>

      <div className="chips-container">
        <span className="chips-label">Quick Presets:</span>
        <div className="chips-list">
          {EXAMPLE_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="chip-btn"
              onClick={() => onSelectPreset(chip)}
              title={chip.description}
            >
              <span className="chip-category">{chip.category}</span>
              <span className="chip-title">{chip.label}</span>
            </button>
          ))}
          <button
            type="button"
            className="chip-btn chip-stress-test"
            onClick={() => onSelectPreset(STRESS_TEST_PROMPT)}
            title={STRESS_TEST_PROMPT.description}
          >
            <span className="chip-icon">⚡</span>
            <span className="chip-title">Stress Test</span>
          </button>
        </div>
      </div>

      <div className="textarea-wrapper">
        <textarea
          className="technical-textarea"
          rows={4}
          placeholder="Paste or type technical text here (e.g. OAuth 2.0, SHA-256, CI/CD, PostgreSQL, Kubernetes v1.28, WebSocket)..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <div className="input-actions">
        <div className="action-hints">
          <span className="hint-text">
            💡 Supports protocols, version numbers, crypto hashes, compound identifiers, and DevOps syntax.
          </span>
        </div>
        <div className="action-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClear}
            disabled={!value || isLoading}
          >
            Clear
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onPrepare}
            disabled={!value.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-sm"></span> Preparing Speech...
              </>
            ) : (
              <>
                <span>✨ Prepare Speech</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
