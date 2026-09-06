import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="brand-group">
          <div className="logo-badge">
            <span className="logo-icon">🔊</span>
            <span className="logo-text">SayRight</span>
          </div>
          <p className="tagline">Make difficult technical language easier to say.</p>
        </div>

        <div className="header-meta">
          <div className="rime-badge" title="Synthesized using Rime TTS High-Fidelity Audio API">
            <span className="rime-dot"></span>
            <span className="rime-label">Voice powered by</span>
            <span className="rime-brand">Rime</span>
          </div>
          <div className="hackathon-tag">
            <span>DataForge 2026</span>
          </div>
        </div>
      </div>
    </header>
  );
};
