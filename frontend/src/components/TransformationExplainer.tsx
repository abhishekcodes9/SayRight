import React from 'react';
import type { SpeechChange } from '../types';

interface TransformationExplainerProps {
  changes: SpeechChange[];
}

export const TransformationExplainer: React.FC<TransformationExplainerProps> = ({ changes }) => {
  if (!changes || changes.length === 0) {
    return (
      <section className="card explainer-section empty-state">
        <div className="section-header">
          <div className="title-row">
            <span className="step-number">03</span>
            <h2 className="section-title">Transformation Explanations</h2>
          </div>
          <span className="count-pill explanation-pill">Explanation</span>
        </div>
        <div className="empty-message">
          <p>No transformations yet. Enter text above to inspect rule explanations.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card explainer-section">
      <div className="section-header">
        <div className="title-row">
          <span className="step-number">03</span>
          <h2 className="section-title">Transformation Explanations</h2>
        </div>
        <span className="count-pill explanation-pill">Explanation</span>
      </div>

      <p className="section-subtitle">
        Deterministic rule applications and their phonetic rationale.
      </p>

      <div className="transformations-table-wrapper">
        <table className="transformations-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th style={{ width: '160px' }}>Original Token</th>
              <th style={{ width: '40px' }}></th>
              <th style={{ width: '220px' }}>Prepared Speech Form</th>
              <th>Deterministic Rationale</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change, idx) => (
              <tr key={`${change.original}-${idx}`} className="transformation-row">
                <td className="index-cell">
                  <span className="index-badge">{String(idx + 1).padStart(2, '0')}</span>
                </td>
                <td className="original-cell">
                  <code className="code-badge original-badge">{change.original}</code>
                </td>
                <td className="arrow-cell">
                  <span className="arrow-icon">→</span>
                </td>
                <td className="prepared-cell">
                  <code className="code-badge prepared-badge">{change.prepared}</code>
                </td>
                <td className="reason-cell">
                  <span className="reason-text">{change.reason}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
