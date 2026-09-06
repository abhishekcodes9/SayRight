export interface SpeechChange {
  original: string;
  prepared: string;
  reason: string;
  position?: number;
  category?: 'protocol' | 'version' | 'crypto' | 'database' | 'devops' | 'syntax' | 'general';
}

export interface SpeechPrepResult {
  originalText: string;
  preparedText: string;
  changes: SpeechChange[];
}

export interface ExamplePreset {
  id: string;
  label: string;
  text: string;
  description: string;
  category: string;
}

export interface VoiceConfig {
  speaker: string;
  modelId: string;
  lang: string;
  sampleRate: string;
}
