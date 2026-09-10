# Rime Evidence

## Hard Voice Claim

Technical text contains abbreviations (OAuth 2.0, JWT, SHA-256), version numbers (v1.28.0, v1.14.2), symbols/slashes (wss://, HTTPS), identifiers (k8s, CUDA, ROC-AUC), and domain vocabulary (PostgreSQL, Kubernetes, MongoDB, GraphQL). Raw TTS often mispronounces or splits these incorrectly. SayRight prepares text deterministically before sending to Rime, using the same speaker/model/config for both variants.

SayRight does NOT claim universal correctness, does NOT analyze user voice, and does NOT fabricate benchmark numbers.

## Rime Configuration (verified from code)

- Speaker: astra
- Model ID: coda
- Language: en
- Endpoint: https://users.rime.ai/v1/rime-tts
- HTTP: POST
- Request: JSON { text, speaker, modelId, lang, audioConfig: { encoding: 'mp3' } }
- Headers: Authorization: Bearer ${key}, Content-Type: application/json
- Response: arraybuffer (MP3 audio)
- Transport: HTTPS

Sources: backend/src/services/rimeClient.ts, frontend/src/components/SayRightStudio.tsx (VOICE_CONFIG)

## Acceptance Corpus (approx 20 cases from presets)

OAuth 2.0, JWT, PostgreSQL, Kubernetes/k8s, SHA-256, MD5-128, REST/HTTPS, WebSocket/wss://, CI/CD, MongoDB, MySQL, SQL/NoSQL, React.js, Node.js, TypeScript, GraphQL, CUDA, XGBoost, ROC-AUC, v1.28.0/v1.14.2

## Procedure

1. Enter text; click Prepare Speech.
2. Click Speak Raw (original to /api/speak).
3. Click Speak Prepared (prepared to /api/speak, identical config).
4. Only text differs; model/speaker/lang/endpoint unchanged.
5. Listen and record.

Commands: cd backend && npm test; cd ../frontend && npm run build

## Actual Results / Observations

Manually verified clearer for prepared: WebSocket, PostgreSQL, MongoDB, MySQL, GraphQL, React.js, Node.js.
Known limitation: SHA-256 can sometimes sound less clear prepared; not universally better.
No fabricated benchmark scores. Backend tests: 44/44 pass.

## Limitations

Rule-based, finite lexicon; no universal guarantee; some transformations not always better; Rime varies by context; no voice analysis; evaluation is controlled comparison + manual listening.
