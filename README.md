# SayRight

**Make difficult technical language easier to say.**

SayRight prepares technical text for speech using deterministic rules, then compares Raw vs Prepared output through the same Rime TTS configuration for an honest A/B listening check.

## Problem

Difficult technical terms, abbreviations, versions, hashes, identifiers, and punctuation can be awkward to deliver clearly in speech. Standard TTS often stumbles over tokens like `OAuth 2.0`, `SHA-256`, `CI/CD`, `k8s`, `v1.14.2`, or `wss://api.example.com/v2/stream`.

## Solution

- Input technical text (or pick a preset).
- SayRight deterministically prepares the text for speech and shows each transformation with rationale.
- Send both Original and Prepared versions through the same Rime TTS settings.
- Listen side-by-side and record observations.

## Why Rime matters

Rime provides the speech generation layer used to compare Raw vs SayRight Prepared text under controlled parameters (`astra` / `coda` / `en`). The same endpoint (`https://users.rime.ai/v1/rime-tts`), speaker, model, and language are used for both streams — only the input text differs.

## Core flow

`Input → deterministic speech preparation → transformation explanations → Raw Rime voice → Prepared Rime voice → evaluation / evidence`

## Architecture

- **Frontend:** React + TypeScript + Vite (`frontend/`)
- **Backend:** Node + Express (`backend/`)
- **Speech:** Rime TTS API (key stays server-side in `backend/.env`; never in client code)
- **Evidence:** `RIME_EVIDENCE.md`

## Important deterministic examples

- `OAuth 2.0` → `OAuth two point zero`
- `SHA-256` → `SHA two five six`
- `CI/CD` → `C I slash C D`

## Evaluation & Acceptance Criteria

Four qualitative dimensions (not scores):

- **Intelligibility** — are tokens distinguishable?
- **Delivery Clarity** — natural cadence, punctuation handling?
- **Technical Fidelity** — meaning preserved?
- **Consistency** — deterministic under identical Rime settings?

Actual observations must be recorded. No fabricated benchmark numbers are claimed. See `RIME_EVIDENCE.md`.

## Setup

```bash
# Install and run frontend
cd frontend && npm install && npm run dev

# Install and run backend
cd backend && npm install && npm run dev
```

Place your Rime API key in `backend/.env` (see `.env.example`); never expose it in the README or frontend bundle.

## API

- `GET /api/health`
- `POST /api/prepare` — deterministic speech preparation
- `POST /api/speak` — Rime TTS proxy (server-side only)

## Reproducibility

Exact Rime config (`astra`, `coda`, `en`), comparison procedure, acceptance corpus (~20 items), and observation template: see `RIME_EVIDENCE.md`.

## Limitations

- Deterministic rule-based preparation, not an AI pronunciation model.
- Finite rule coverage; not every token is handled.
- No universal improvement claim — evaluation requires actual listening/observation.
- Evaluation is qualitative; no automated benchmark scores.

Built for DataForge 2026 Hackathon • Powered by Rime TTS.
