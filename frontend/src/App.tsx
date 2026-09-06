import { useState } from 'react';
import { Header } from './components/Header';
import { TextInput } from './components/TextInput';
import { ComparisonView } from './components/ComparisonView';
import { TransformationExplainer } from './components/TransformationExplainer';
import { VoiceControls } from './components/VoiceControls';
import { EvaluationPlaceholder } from './components/EvaluationPlaceholder';
import { INITIAL_PREVIEW_RESULT, STRESS_TEST_PROMPT } from './mockData';
import type { ExamplePreset, SpeechPrepResult } from './types';
import './App.css';

export function App() {
  const [inputText, setInputText] = useState<string>(STRESS_TEST_PROMPT.text);
  const [prepResult, setPrepResult] = useState<SpeechPrepResult | null>(INITIAL_PREVIEW_RESULT);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectPreset = (preset: ExamplePreset) => {
    setInputText(preset.text);
    if (preset.id === 'stress-test') {
      setPrepResult(INITIAL_PREVIEW_RESULT);
    } else {
      // Clean, honest preview state for individual presets
      setPrepResult({
        originalText: preset.text,
        preparedText: preset.text
          .replace(/OAuth 2\.0/g, 'OAuth two point zero')
          .replace(/PostgreSQL/g, 'Postgres Q L')
          .replace(/Kubernetes/g, 'Kubernetes')
          .replace(/k8s/g, 'kubernetes')
          .replace(/v1\.28\.0/g, 'one point 28 point zero')
          .replace(/SHA-256/g, 'SHA two five six')
          .replace(/MD5-128/g, 'MD5 one two eight')
          .replace(/WebSocket/g, 'Web Socket')
          .replace(/XGBoost/g, 'X G Boost')
          .replace(/CUDA/g, 'C U D A')
          .replace(/ROC-AUC/g, 'R O C A U C')
          .replace(/API/g, 'A P I')
          .replace(/CI\/CD/g, 'C I slash C D')
          .replace(/JWT/g, 'J W T')
          .replace(/HTTPS/g, 'H T T P S')
          .replace(/SSL/g, 'S S L')
          .replace(/IPC/g, 'I P C'),
        changes: [
          {
            original: preset.label,
            prepared: preset.label === 'OAuth 2.0' ? 'OAuth two point zero'
              : preset.label === 'PostgreSQL' ? 'Postgres Q L'
              : preset.label === 'Kubernetes' ? 'Kubernetes'
              : preset.label === 'SHA-256' ? 'SHA two five six'
              : preset.label === 'WebSocket' ? 'Web Socket'
              : preset.label === 'XGBoost' ? 'X G Boost'
              : preset.label,
            reason: `${preset.category} term — phonetic expansion for natural voice delivery`,
            category: 'general'
          }
        ]
      });
    }
  };

  const handlePrepare = () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    // UI-only preview state until backend API is wired
    setTimeout(() => {
      setPrepResult({
        originalText: inputText,
        preparedText: inputText
          .replace(/OAuth 2\.0/gi, 'OAuth two point zero')
          .replace(/PostgreSQL/gi, 'Postgres Q L')
          .replace(/k8s/gi, 'kubernetes')
          .replace(/SHA-256/gi, 'SHA two five six')
          .replace(/MD5-128/gi, 'MD5 one two eight')
          .replace(/CI\/CD/gi, 'C I slash C D')
          .replace(/\bAPI\b/g, 'A P I')
          .replace(/\bJWT\b/g, 'J W T')
          .replace(/\bHTTPS\b/g, 'H T T P S')
          .replace(/\bv?(\d+)\.(\d+)\.(\d+)\b/g, '$1 point $2 point $3')
          .replace(/\bv?(\d+)\.(\d+)\b/g, '$1 point $2'),
        changes: INITIAL_PREVIEW_RESULT.changes
      });
      setIsLoading(false);
    }, 200);
  };

  const handleClear = () => {
    setInputText('');
    setPrepResult(null);
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

          {/* Step 2: Side-by-Side Comparison */}
          <ComparisonView result={prepResult} />

          {/* Step 3: Transformation Audit / Explainer */}
          <TransformationExplainer changes={prepResult?.changes || []} />

          {/* Step 4: Controlled Voice Comparison Controls */}
          <VoiceControls
            hasInput={Boolean(inputText.trim())}
            hasPrepared={Boolean(prepResult?.preparedText.trim())}
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
