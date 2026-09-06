# PROJECT_CONTEXT.md — SayRight

## 1. Project Metadata
- **Project Name:** SayRight
- **Hackathon:** DataForge 2026
- **Assigned Challenge:** Rime Hackathon Challenge
- **Repository Status:** Initial setup (.gitignore present)
- **Current Implementation Status:** Pre-implementation planning & context initialization phase (No code or dependencies installed yet)

---

## 2. Product Overview
### Product Purpose
SayRight is a specialized, developer-focused voice engineering tool designed to prepare difficult technical text for natural, accurate Text-to-Speech (TTS) delivery via Rime TTS. It bridges the gap between written technical syntax and spoken technical articulation.

### Target User
Students, software engineers, and technical professionals preparing for technical presentations, system design interviews, thesis defenses, or oral technical exams where precise pronunciation of domain-specific vocabulary and code identifiers is critical.

### Core Problem
Raw technical prose contains abbreviations, semantic version numbers, mathematical/cryptographic notation, slashes, punctuation, CamelCase/snake_case identifiers, and domain-specific terms (e.g., `OAuth 2.0`, `SHA-256`, `CI/CD`, `k8s`, `v1.14.2`, `gRPC`). Standard TTS engines often stumble, mispronounce, or produce robotic/awkward audio when reading these raw tokens.

---

## 3. Core Product Flow
1. **Input:** User inputs raw technical text (or selects from provided stress-test presets).
2. **Deterministic Preparation:** SayRight executes deterministic transformation rules to produce a speech-prepared phonetic/expanded version of the text.
3. **Dual View & Auditability:** User inspects side-by-side: **Original Raw Text** vs. **SayRight Prepared Text**, accompanied by a granular explanation of each applied transformation rule and why it was made.
4. **Controlled TTS Generation:**
   - User triggers **Speak Raw** (sends raw text to Rime TTS API).
   - User triggers **Speak with SayRight** (sends prepared text to Rime TTS API).
   - Both requests utilize the exact same Rime TTS configuration (voice, speed, model settings) to ensure a strictly controlled, scientifically valid comparison.
5. **Comparison & Playback:** User listens to both audio outputs back-to-back to directly observe the clarity enhancement.

---

## 4. Required MVP Features
- **Technical Text Input:** Textarea with character count, reset, and load preset capabilities.
- **Example & Stress-Test Presets:** Curated individual technical terms and complex stress-test sentences covering diverse technical patterns (cryptography, networking, DevOps, software engineering).
- **Side-by-Side Text Comparison:** Original text vs. SayRight speech-prepared text.
- **Granular Transformation Explanations:** Clear breakdown of every token modified, the rule triggered, and the rationale.
- **Dual Speech Controls:**
  - "Speak Raw" audio generation and playback.
  - "Speak with SayRight" audio generation and playback.
- **Controlled Configuration:** Enforced identical Rime voice parameters between raw and prepared speech.
- **Robust UI States:** Comprehensive loading spinners, audio player states (play, pause, progress, download), and informative error boundaries.
- **Acceptance Testing Suite:** Automated and manual validation tests confirming deterministic rules and API handling.
- **Complete Documentation:** Setup guide, architectural deep-dive, transformation catalog, and demo script.

---

## 5. Technical Architecture & Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Client)                      │
│            React 18 + TypeScript + Vite + CSS               │
│  - Text Input & Presets         - Dual Audio Players        │
│  - Diff & Explainer View        - API Client Layer          │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (API Server)                    │
│                     Node.js + Express + TS                  │
│  - POST /api/prepare: Rule-based transformation engine       │
│  - POST /api/speak: Secure proxy to Rime TTS API            │
│  - In-memory / Streamed Audio Response Handling             │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS (Authenticated)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Rime TTS API Service                     │
│  - Unified Voice Configuration (Raw & Prepared)             │
│  - High-fidelity Audio Synthesis                            │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Stack
- **Framework:** React with TypeScript
- **Bundler / Dev Server:** Vite
- **Styling:** Modern, clean, technical CSS (CSS Modules / standard CSS with design tokens)
- **Audio:** Native HTML5 Audio API / custom player components

### Backend Stack
- **Runtime:** Node.js
- **Server Framework:** Express.js (TypeScript)
- **Middleware:** `cors`, `dotenv`, `express.json()`
- **HTTP Client:** `axios` or native `fetch` for calling Rime API

---

## 6. Engineering Requirements & Constraints

### API Key Security Requirements
- The Rime API key (`RIME_API_KEY`) **MUST** reside exclusively on the server side in a `.env` file.
- **NEVER** expose the Rime API key in frontend code, client bundles, or network responses.
- **NEVER** commit `.env` or secrets to Git repository.

### Deterministic Speech Preparation Requirement
- The text transformation pipeline **MUST** be deterministic and rule-based (regex pattern matchers, tokenizers, phonetic mapping dictionaries, pronunciation expanders).
- **DO NOT** use external AI/LLM APIs (OpenAI, Anthropic, Gemini, etc.) for text preparation in the initial engine.
- Every transformation must be inspectable, predictable, and explainable with deterministic rationale.

### Raw vs. Prepared Controlled Comparison Requirement
- Raw speech synthesis and SayRight speech synthesis **MUST** use the exact same Rime voice ID, model version, sampling rate, and synthesis parameters.
- No artificial degradation of the raw audio or selective parameter boosting for prepared audio. The comparison must demonstrate the pure value of text-level speech engineering.

### Acceptance Testing Requirements
- Unit tests for all deterministic text transformation rules (abbreviations, versions, slashes, numbers, casing).
- Integration test for backend API endpoints (`/api/prepare`, `/api/speak`).
- End-to-end user flow test (Input → Prepare → Audio Playback).

### Documentation Requirements
- `README.md` covering setup, environment configuration, and execution instructions.
- Architecture explanation detailing the voice engineering pipeline.
- Demo walkthrough script highlighting stress-test sentences and value proposition.

---

## 7. Explicit Exclusions (What NOT to Build)
To maintain focus and deliver a bulletproof MVP, the following are strictly out of scope:
- User authentication, login, or registration
- Databases (SQL/NoSQL) or persistent user profiles
- Social sharing features or community feeds
- Mobile applications (native iOS/Android)
- Voice cloning or custom voice training
- Giant general-purpose pronunciation dictionaries (beyond technical domain scope)
- Conversational chat agents / LLM conversational bots
- Microphone recording, user speech capture, or acoustic analysis
- User pronunciation scoring / fluency evaluation
- Fabricated benchmarks, synthetic metrics, or fake statistics

---

## 8. Hackathon Judging Criteria & Weights
- **25% Problem / Necessity of Voice:** Clarity of the problem statement and why voice preparation is essential for technical communication.
- **25% Hard Voice Engineering:** Depth, accuracy, and sophistication of deterministic technical text transformations and phonetic handling.
- **20% Rime Integration / Voice Experience:** Polish, responsiveness, and seamless integration of Rime TTS.
- **20% Evidence / Reproducibility:** Side-by-side controlled comparisons, test suites, and transparent explanations.
- **10% Demo Clarity:** Intuitive presentation, clear stress-test cases, and immediate comprehension for judges.
