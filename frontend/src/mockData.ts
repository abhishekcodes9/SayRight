import type { ExamplePreset } from './types';

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

export const DEFAULT_VOICE_CONFIG = {
  speaker: 'astra',
  modelId: 'coda',
  lang: 'en',
  sampleRate: '24kHz (Controlled 1:1 Parity)'
};

