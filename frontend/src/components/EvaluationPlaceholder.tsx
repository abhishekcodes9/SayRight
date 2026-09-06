import React from 'react';

export const EvaluationPlaceholder: React.FC = () => {
  return (
    <section className="card evaluation-section">
      <div className="section-header">
        <div className="title-row">
          <span className="step-number">05</span>
          <h2 className="section-title">A/B Speech Quality Evaluation Criteria</h2>
        </div>
        <span className="badge badge-eval">Acceptance Criteria</span>
      </div>

      <p className="section-subtitle">
        Qualitative evaluation criteria to be validated via side-by-side listening and acceptance testing under identical Rime TTS parameters.
      </p>

      <div className="eval-grid">
        <div className="eval-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🎯</span>
            <h4 className="metric-title">Intelligibility</h4>
          </div>
          <p className="metric-desc">
            Technical initialisms (<code>JWT</code>, <code>gRPC</code>, <code>k8s</code>) and semantic version structures are phonetically spaced so every syllable is distinct and intelligible.
          </p>
          <div className="criteria-checklist">
            <div className="criteria-item">
              <span className="criteria-bullet">▪</span>
              <span>Individual character spacing for initialisms</span>
            </div>
            <div className="criteria-item">
              <span className="criteria-bullet">▪</span>
              <span>Clear digit-by-digit expansion for crypto hashes</span>
            </div>
          </div>
        </div>

        <div className="eval-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🗣️</span>
            <h4 className="metric-title">Delivery Clarity</h4>
          </div>
          <p className="metric-desc">
            Replaces awkward, literal slash and punctuation reading with natural conversational phrasing (e.g. <code>CI/CD</code> spoken as "C I slash C D").
          </p>
          <div className="criteria-checklist">
            <div className="criteria-item">
              <span className="criteria-bullet">▪</span>
              <span>Explicit conversational punctuation handling</span>
            </div>
            <div className="criteria-item">
              <span className="criteria-bullet">▪</span>
              <span>Natural cadence without abrupt TTS stops</span>
            </div>
          </div>
        </div>

        <div className="eval-metric-card">
          <div className="metric-header">
            <span className="metric-icon">📐</span>
            <h4 className="metric-title">Technical Fidelity</h4>
          </div>
          <p className="metric-desc">
            Preserves domain-specific semantic meaning without loss of technical nuance, preserving versions, bit widths, and protocol identities.
          </p>
          <div className="criteria-checklist">
            <div className="criteria-item">
              <span className="criteria-bullet">▪</span>
              <span>Zero alteration of underlying technical meaning</span>
            </div>
            <div className="criteria-item">
              <span className="criteria-bullet">▪</span>
              <span>Exact version and patch level preservation</span>
            </div>
          </div>
        </div>

        <div className="eval-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🔬</span>
            <h4 className="metric-title">Consistency</h4>
          </div>
          <p className="metric-desc">
            Deterministic rule execution guarantees identical, reproducible preparation across runs with zero non-deterministic drift.
          </p>
          <div className="criteria-checklist">
            <div className="criteria-item">
              <span className="criteria-bullet">▪</span>
              <span>Deterministic rule-based transformation</span>
            </div>
            <div className="criteria-item">
              <span className="criteria-bullet">▪</span>
              <span>1:1 controlled Rime parameter parity</span>
            </div>
          </div>
        </div>
      </div>

      <div className="eval-footer-note">
        <span className="eval-note-icon">ℹ️</span>
        <span>
          Note: These criteria represent qualitative evaluation dimensions for manual and automated acceptance tests. No synthetic benchmark statistics or fabricated metrics are claimed.
        </span>
      </div>
    </section>
  );
};
