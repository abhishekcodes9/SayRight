import React from 'react';

export const EvaluationPlaceholder: React.FC = () => {
  return (
    <section className="card evaluation-section">
      <div className="section-header">
        <div className="title-row">
          <span className="step-number">05</span>
          <h2 className="section-title">Evaluation & Acceptance Criteria</h2>
        </div>
        <span className="badge badge-eval">To Be Tested</span>
      </div>

      <p className="section-subtitle">
        Qualitative dimensions for observing side-by-side Rime TTS output. No scores or benchmark claims are made; observations must be recorded manually.
      </p>

      <div className="eval-grid">
        <div className="eval-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🎯</span>
            <h4 className="metric-title">Intelligibility</h4>
          </div>
          <p className="metric-desc">
            Are initialisms, abbreviations, and alphanumeric tokens clearly distinguishable when spoken?
          </p>
          <div className="criteria-checklist">
            <div className="criteria-item"><span>▪</span><span>Letter-by-letter or phonetic spacing</span></div>
            <div className="criteria-item"><span>▪</span><span>Digit groups clearly separated</span></div>
          </div>
        </div>

        <div className="eval-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🗣️</span>
            <h4 className="metric-title">Delivery Clarity</h4>
          </div>
          <p className="metric-desc">
            Is punctuation and syntax handled in a conversational rather than literal manner?
          </p>
          <div className="criteria-checklist">
            <div className="criteria-item"><span>▪</span><span>Natural cadence and pauses</span></div>
            <div className="criteria-item"><span>▪</span><span>Avoidance of abrupt stops</span></div>
          </div>
        </div>

        <div className="eval-metric-card">
          <div className="metric-header">
            <span className="metric-icon">📐</span>
            <h4 className="metric-title">Technical Fidelity</h4>
          </div>
          <p className="metric-desc">
            Does the prepared output preserve all technical meaning without altering versions, protocols, or identifiers?
          </p>
          <div className="criteria-checklist">
            <div className="criteria-item"><span>▪</span><span>No semantic alteration</span></div>
            <div className="criteria-item"><span>▪</span><span>Versions, hashes, and names intact</span></div>
          </div>
        </div>

        <div className="eval-metric-card">
          <div className="metric-header">
            <span className="metric-icon">🔬</span>
            <h4 className="metric-title">Consistency</h4>
          </div>
          <p className="metric-desc">
            Is the preparation deterministic and reproducible under identical Rime parameters?
          </p>
          <div className="criteria-checklist">
            <div className="criteria-item"><span>▪</span><span>Same input → same prepared output</span></div>
            <div className="criteria-item"><span>▪</span><span>1:1 controlled Rime parity</span></div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-code)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Acceptance Corpus (observation set — not results)</h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Around 20 technical terms/sentences to be listened to under identical Rime settings. No results recorded here.</p>
        <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.1rem' }}>
          <li>OAuth 2.0 / JWT bearer tokens over HTTPS</li>
          <li>PostgreSQL replication with SSL enabled</li>
          <li>k8s ingress v1.28.0</li>
          <li>SHA-256 and MD5-128 cryptographic checksums</li>
          <li>WebSocket wss://api.example.com/v2/stream</li>
          <li>XGBoost classifier with CUDA and ROC-AUC</li>
          <li>CI/CD pipeline with automated deployment</li>
          <li>gRPC microservice endpoint at 10.0.0.1:8080</li>
          <li>GraphQL mutation with JWT authorization</li>
          <li>Kafka topic partition-3 offset 1048576</li>
          <li>Redis cluster node shard-01 master</li>
          <li>Docker-compose v2.23.1 with healthchecks</li>
          <li>Terraform state s3://tf-state-bucket/prod/</li>
          <li>Prometheus metric scrape_interval 15s</li>
          <li>NGINX reverse proxy /api/v2/health</li>
          <li>OpenSSL TLS 1.3 cipher ECDHE-RSA-AES256-GCM-SHA384</li>
          <li>IPv6 address 2001:0db8:85a3::8a2e:0370:7334</li>
          <li>Base64-encoded ECDSA public key block</li>
          <li>SemVer v3.2.1-alpha.1 pre-release</li>
          <li>Full-stack stress sentence combining all above categories</li>
        </ul>
      </div>

      <div className="eval-footer-note">
        <span className="eval-note-icon">ℹ️</span>
        <span>
          These criteria describe observation dimensions only. No synthetic benchmark statistics, fabricated scores, or universal improvement claims are made. Record actual listening observations in RIME_EVIDENCE.md.
        </span>
      </div>
    </section>
  );
};
