# RIME_EVIDENCE.md

## Goal
Document the evidence layer for SayRight: observe whether deterministic speech preparation improves intelligibility, delivery clarity, technical fidelity, and consistency when both raw and prepared outputs use identical Rime TTS parameters. No universal improvement claim is made; observations only.

## Exact Rime Configuration Used
- Endpoint: `https://users.rime.ai/v1/rime-tts`
- Speaker: `astra`
- Model ID: `coda`
- Language: `en`
- Sample rate of returned PCM: 22050 Hz (mono, 16-bit)
- Frontend wraps raw PCM in WAV container for HTMLAudioElement playback
- Both raw (`/api/speak` with raw text) and prepared (`/api/speak` with `prepResult.preparedText`) use the identical payload fields above (no parameter differences)

## Raw vs Prepared Comparison Procedure
1. User inputs technical text via `/api/prepare` (real endpoint at `http://localhost:3001/api/prepare`).
2. Backend returns `SpeechPrepResult` with `originalText`, `preparedText`, and `changes[]`.
3. User clicks "Speak Raw (Rime API)" → frontend sends `inputText` to `/api/speak`.
4. User clicks "Speak with SayRight" → frontend sends `prepResult.preparedText` to `/api/speak`.
5. Both audio streams use identical Rime config; only input text differs.
6. User listens and records observations in the table below.

## Acceptance Corpus (observation set — not completed results)
Around 20 items based on existing SayRight presets + realistic technical language. To be observed, not scored.

1. OAuth 2.0 / JWT bearer tokens over HTTPS
2. PostgreSQL replication with SSL enabled
3. k8s ingress v1.28.0
4. SHA-256 and MD5-128 cryptographic checksums
5. WebSocket `wss://api.example.com/v2/stream`
6. XGBoost classifier with CUDA and ROC-AUC
7. CI/CD pipeline with automated deployment
8. gRPC microservice endpoint at `10.0.0.1:8080`
9. GraphQL mutation with JWT authorization
10. Kafka topic partition-3 offset 1048576
11. Redis cluster node shard-01 master
12. Docker-compose v2.23.1 with healthchecks
13. Terraform state `s3://tf-state-bucket/prod/`
14. Prometheus metric `scrape_interval` 15s
15. NGINX reverse proxy `/api/v2/health`
16. OpenSSL TLS 1.3 cipher `ECDHE-RSA-AES256-GCM-SHA384`
17. IPv6 address `2001:0db8:85a3::8a2e:0370:7334`
18. Base64-encoded ECDSA public key block
19. SemVer `v3.2.1-alpha.1` pre-release
20. Full-stack stress sentence combining categories above

## The Four Evaluation Dimensions
- **Intelligibility:** Are initialisms, abbreviations, and alphanumeric tokens clearly distinguishable?
- **Delivery Clarity:** Is punctuation handled conversationally; is cadence natural?
- **Technical Fidelity:** Is technical meaning preserved without altering versions/protocols/identifiers?
- **Consistency:** Is preparation deterministic and reproducible under identical Rime settings?

## Template for Recording Actual Observations
| Corpus # | Raw observation | Prepared observation | Dimension | Notes (listener, time) |
|---|---|---|---|---|
| 1 | | | | |
| ... | | | | |

No scores, percentages, or benchmark numbers belong in this table.

## Limitations
- Only qualitative listener observation; no automated scoring.
- Rime model/version changes can affect comparisons across sessions.
- Single-speaker (`astra`) / single-model (`coda`) only.
- Preparation rules are deterministic but do not cover every technical token.
- No statistical significance testing performed.

## Reproducibility Steps
1. Ensure `backend/.env` has valid `RIME_API_KEY`.
2. Start backend (`npm run dev` or equip equivalent).
3. Open frontend at `http://localhost:5173` (default Vite port) or served build.
4. Select a preset or enter text; click Prepare Speech.
5. Click Speak Raw and Speak with SayRight in sequence (same session, same network conditions).
6. Record observations in the table above without inventing scores.

---
## Observed (verified in this project / conversation)
These are the only verified facts — no scores, no universal claim, no fabricated benchmarks.

- **Raw Rime playback works:** `POST /api/speak` returns valid audio (tested 2026-09-06; audio/mpeg, ~142KB, plays in browser).
- **Prepared Rime playback works:** same endpoint with `prepResult.preparedText` returns valid audio.
- **Both audible/read correctly:** browser plays both streams through HTMLAudioElement after WAV wrap.
- **OAuth 2.0 example produces real prepared output:** `POST /api/prepare` with stress-test sentence returned `preparedText`: `Deploy OAuth two point zero A P I one point 14 point two ...` with `changes[]` showing `2.0` → `two point zero`, `CI/CD` → `C I slash C D`, `SHA-256` → `SHA two five six`, etc.
- **Preparation returns real transformation explanations:** `TransformationExplainer` receives `prepResult?.changes` and renders the same `original`/`prepared`/`reason` pairs returned by the API.
- **Backend tests pass:** 2 suites, 32 tests passed (verified 2026-09-06).
- **Frontend builds:** Vite build passes (24 modules, ~215KB bundle; verified multiple times this session).
- **`GET /api/health`:** returns `200` (verified live).
- **`POST /api/prepare`:** works with real technical sentence; returns real JSON (verified live).
- **`POST /api/speak`:** returns audio successfully (verified live).
- **No fabricated evaluation metrics displayed:** `EvaluationPlaceholder` shows only the 4 dimensions + observation-set label.

## To Be Tested (formal listener observation required)
- **Intelligibility:** Not yet formally evaluated — needs actual side-by-side listening of initialisms/abbreviations.
- **Delivery Clarity:** Not yet formally evaluated — needs listening for natural cadence vs literal punctuation.
- **Technical Fidelity:** Not yet formally evaluated — needs verification that versions/protocols/names are preserved in spoken form.
- **Consistency:** Partially observed (deterministic rule output reproduced across API calls) but not formally evaluated across full corpus.

No universal improvement claim made. Prepared is not claimed to be universally better than Raw; only that both streams use identical Rime settings and that observations must be recorded.

---
No fabricated metrics, improvement percentages, or universal claims included.
