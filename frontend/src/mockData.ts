import type { ExamplePreset, SpeechPrepResult, VoiceConfig } from './types';

export const EXAMPLE_CHIPS: ExamplePreset[] = [
  {
    id: 'oauth',
    label: 'OAuth 2.0',
    text: 'Authenticate client using OAuth 2.0 and JWT bearer tokens over HTTPS.',
    description: 'Protocol name & semantic versioning',
    category: 'Auth'
  },
  {
    id: 'postgres',
    label: 'PostgreSQL',
    text: 'Configure PostgreSQL connection pooling with SSL encryption enabled.',
    description: 'Database pronunciation & acronyms',
    category: 'Database'
  },
  {
    id: 'k8s',
    label: 'Kubernetes',
    text: 'Scale the microservice on a Kubernetes cluster using k8s ingress v1.28.0.',
    description: 'DevOps terminology & version numbers',
    category: 'DevOps'
  },
  {
    id: 'sha256',
    label: 'SHA-256',
    text: 'Verify the file integrity using SHA-256 and MD5-128 cryptographic checksums.',
    description: 'Cryptographic algorithms & bit lengths',
    category: 'Crypto'
  },
  {
    id: 'websocket',
    label: 'WebSocket',
    text: 'Establish full-duplex WebSocket connection at wss://api.example.com/v2/stream for real-time IPC.',
    description: 'Protocols & URI structures',
    category: 'Network'
  },
  {
    id: 'xgboost',
    label: 'XGBoost',
    text: 'Train the XGBoost classifier model with CUDA acceleration and evaluate via ROC-AUC.',
    description: 'Machine learning libraries & metrics',
    category: 'ML/AI'
  }
];

export const STRESS_TEST_PROMPT: ExamplePreset = {
  id: 'stress-test',
  label: 'Full Stack Stress Test',
  text: 'Deploy the OAuth 2.0 API v1.14.2 on a Kubernetes cluster with CI/CD, PostgreSQL replication, and SHA-256 signed JWT tokens over HTTPS.',
  description: 'Complex sentence combining 7 distinct technical speech patterns',
  category: 'Stress Test'
};

export const INITIAL_PREVIEW_RESULT: SpeechPrepResult = {
  originalText: 'Deploy the OAuth 2.0 API v1.14.2 on a Kubernetes cluster with CI/CD, PostgreSQL replication, and SHA-256 signed JWT tokens over HTTPS.',
  preparedText: 'Deploy the OAuth two point zero A P I one point 14 point two on a Kubernetes cluster with C I slash C D, Postgres Q L replication, and SHA two five six signed J W T tokens over H T T P S.',
  changes: [
    {
      original: '2.0',
      prepared: 'two point zero',
      reason: 'Version number — expanded for clear conversational cadence',
      category: 'version'
    },
    {
      original: 'API',
      prepared: 'A P I',
      reason: 'Technical initialism — spaced for individual letter articulation',
      category: 'protocol'
    },
    {
      original: 'v1.14.2',
      prepared: 'one point 14 point two',
      reason: 'Semantic version — strip prefix and speak major, minor, patch units',
      category: 'version'
    },
    {
      original: 'CI/CD',
      prepared: 'C I slash C D',
      reason: 'Slash-separated DevOps initialism — explicit slash vocalization',
      category: 'devops'
    },
    {
      original: 'PostgreSQL',
      prepared: 'Postgres Q L',
      reason: 'Compound database name — syllabic expansion for natural delivery',
      category: 'database'
    },
    {
      original: 'SHA-256',
      prepared: 'SHA two five six',
      reason: 'Cryptographic hash — algorithm preserved, bit width expanded digit-by-digit',
      category: 'crypto'
    },
    {
      original: 'JWT',
      prepared: 'J W T',
      reason: 'JSON Web Token initialism — spell out letter-by-letter',
      category: 'protocol'
    },
    {
      original: 'HTTPS',
      prepared: 'H T T P S',
      reason: 'Secure transfer protocol — explicit character pacing',
      category: 'protocol'
    }
  ]
};

export const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  speaker: 'astra',
  modelId: 'coda',
  lang: 'en',
  sampleRate: '24kHz (Controlled 1:1 Parity)'
};
