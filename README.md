# SayRight — Make difficult technical language easier to say

SayRight is a voice-engineering tool that prepares difficult technical text for clearer TTS (text-to-speech) delivery using deterministic speech-preparation rules.

## What it is

SayRight takes technical input (protocol names, version numbers, abbreviations, identifiers) and produces a prepared spoken form that is easier for a TTS engine to pronounce correctly. It then compares the original and prepared output side-by-side and can generate audio from both.

## Target user / problem

Technical presenters, documentation authors, and engineers need to read complex sentences aloud (e.g., in recordings, demos, or accessibility content). Raw technical text often confuses TTS systems: abbreviations sound like words, version numbers split incorrectly, slash-separated terms get misread, and domain-specific vocabulary renders poorly.

## Why voice / TTS is necessary

Text alone does not communicate pronunciation. TTS converts written text to audible speech, but its output quality depends heavily on how the text is structured. By preparing the text before TTS, SayRight improves the audible result without changing the intended meaning.

## The hard voice problem Solve

Technical text contains patterns that TTS handles poorly:
- Abbreviations (OAuth, JWT, SQL, UUID)
- Version numbers (v1.14.2, v1.28.0, 1.0.0)
- Slash-separated terms (wss://, HTTPS, CI/CD)
- Symbols and identifiers (SHA-256, MD5-128, ROC-AUC)
- Domain-specific vocabulary (PostgreSQL, Kubernetes, PyTorch, GraphQL)
- Mixed alphanumeric identifiers (k8s, XGBoost)

SayRight applies a curated, deterministic expansion/formatting lexicon to these patterns before sending to Rime.

## End-to-end user flow

1. Enter technical text (paste, preset, or type).
2. Click **Prepare Speech** — deterministic rules expand/format the text.
3. See the **Prepared output** comparison (original vs. prepared with explanations).
4. Click **Speak Raw** — original text sent to Rime.
5. Click **Speak Prepared** — prepared text sent to Rime.
6. Compare both audio samples (same voice/config; only text differs).
7. Review the **Transformation audit** (before / after / why).

## Architecture

- **Frontend**: React + TypeScript + Vite (client build: `npm run build`)
- **Speech preparation**: deterministic rule-based service (backend `/api/prepare`)
- **Text comparison**: original / prepared side-by-side with explanation
- **Audio generation**: `POST /api/speak` → Node/Express → Rime TTS → WAV/PCM response
- **TTS engine**: Rime (`users.rime.ai/v1/rime-tts`, speaker `astra`, model `coda`, lang `en`)

## Rime integration (actual implementation)

The backend connects to Rime at:

- Endpoint: `https://users.rime.ai/v1/rime-tts`
- HTTP method: `POST`
- Request format (JSON body): `{ text, speaker: 'astra', modelId: 'coda', lang: 'en', audioConfig: { encoding: 'mp3' } }`
- Headers: `Authorization: Bearer ${RIME_API_KEY}`, `Content-Type: application/json`
- Response format: `arraybuffer` (audio bytes, MP3 encoding per `audioConfig`)
- Transport: HTTPS
- Speaker: `astra`
- Model ID: `coda`
- Language: `en`

The frontend passes `VOICE_CONFIG = { speaker: 'astra', modelId: 'coda', lang: 'en' }` to `/api/speak`; the backend forwards to Rime with the same config.

## Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env  # fill RIME_API_KEY
npm test
npm start

# Frontend
cd frontend
npm install
npm run build
npm run dev
```

## Environment variables

- `RIME_API_KEY` — required for `/api/speak`. The backend checks it at startup; if missing or equal to `your_rime_api_key_here`, the endpoint is disabled with a warning.
- `PORT` — backend port (default 3001).

See `.env.example` for placeholder format.

## Tests

- Backend: `npm test` (Jest, 44 tests pass across `prepare.test.ts` and `speechPrep.test.ts`)
- Frontend build: `npm run build` (Vite + TypeScript)

## Acceptance test instructions

1. Load the frontend at `https://sayright-delta.vercel.app/`.
2. Select a preset (e.g., OAuth 2.0, Kubernetes, SHA-256, WebSocket).
3. Click **Prepare Speech**.
4. Verify transformed text appears, with explanations for changes.
5. Click **Speak Raw** and **Speak Prepared**.
6. Confirm both audio samples load and play.
7. Confirm the audit shows before/after pairs with reasons.

## Known limitations and failure behavior

- SayRight does NOT claim universal pronunciation correctness.
- Some transformations (e.g., SHA-256) can sometimes sound less natural/clear than raw speech; evaluation is case-by-case.
- Deterministic rule-based preparation with a finite curated lexicon — not a universal TTS optimizer.
- Rime output can vary by context; same text may render slightly differently across sessions.
- The backend requires `RIME_API_KEY`; without it, `/api/speak` returns an error / is unavailable.
- If Rime returns a 400/401/429/500, the backend passes the error message through to the frontend.

## Reproduction

- Source repository: `https://github.com/abhishekcodes9/SayRight`
- Frontend: `https://sayright-delta.vercel.app/`
- Backend: `https://sayright-backend.vercel.app/`

To reproduce locally:
```bash
git clone https://github.com/abhishekcodes9/SayRight.git
cd SayRight/backend && npm install && npm test
cd ../frontend && npm install && npm run build
```

## Important clarification

SayRight is NOT a universal pronunciation correctness detector. It does NOT analyze the user's voice, compare spoken output to a reference, or score pronunciation accuracy. It prepares written text deterministically and compares the written result with the original. Evaluation is based on controlled text comparison (same Rime model/speaker/config, only text changed) and manual listening, not on fabricated numerical benchmarks.
