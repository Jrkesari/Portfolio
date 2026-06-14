# Security notes

## Secrets
- `NVIDIA_API_KEY` is **server-side only** — used in `api/prompt-golf.ts`, never sent to the browser. Verified absent from the built `dist/` bundle.
- Only `VITE_*` vars reach the client (EmailJS public IDs — public by design).
- `.env`, `.env*.local`, and `.vercel/` are git-ignored. No secrets are committed; `.env.example` holds placeholders only.

## Public API hardening (`/api/prompt-golf`)
The game endpoint is public, so it's protected against abuse:
- **Origin allowlist** — only our own site (or `ALLOWED_ORIGINS`) may call it; cross-site and no-origin (curl) requests get `403`.
- **Per-IP rate limit** — sliding window, 12/min and 80/hour → `429`.
- **Global circuit breaker** — 120/min across all callers, caps spend under a flood.
- **Input caps** — prompt ≤ 600 chars, `max_tokens` 150, 15s upstream timeout.
- **Quiet errors** — upstream failures are logged server-side, never returned to the client.

> The rate-limit counters are in-memory (reset on cold start) — a strong speed bump, not a distributed quota. **Also set a monthly spend cap on the NVIDIA key** for a hard ceiling.

## Dependency audit
- `npm audit fix` applied (resolved the PostCSS advisory).
- Remaining advisories are **dev/build-time only** (esbuild dev-server, Vite dev) and are not reachable on the deployed static site. Fixing them requires a Vite 6→8 major bump (`npm audit fix --force`), deferred to avoid breaking the build. Re-evaluate on the next Vite upgrade.
