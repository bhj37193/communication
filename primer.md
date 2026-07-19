# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics + CI. `apps/mobile`
(Expo/RN) has real screens: `chat.tsx`, `result.tsx`, `profile.tsx`, `index.tsx` — P0-27
(scaffold) and P0-28 (share card) both CLOSED, green. `apps/web` not started (P2, not
blocking).

Flagged, unfixed (carried, need own cycle): (a) `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` — shifts `warmTwoIndex`/reciprocity; (b) 409
CAPPED spec wants a next-open-time, current impl/test omit it.

**This session:** user wants personal solo use (skip auth — already true, `FakeAuthVerifier`
trusts any Bearer token, no Clerk needed). Created `apps/server/.env` (new file, gitignored —
did NOT exist before; root `.env` at repo root is for UNRELATED transcription scripts,
Deepgram/Apify keys, not charisma) with schema defaults + `AUTH_PROVIDER=fake` +
`MODEL_PROVIDER=anthropic` set + `ANTHROPIC_API_KEY=` left blank, opened in TextEdit
(`open -e`) for user to paste their real key. Confirmed tsx 4.23.1 auto-loads `.env` from
cwd, so `pnpm --filter @charisma/server dev`/`smoke:anthropic` will pick it up automatically,
no dotenv package needed.

**Next action (ONE task only):** Once user confirms the key is pasted into
`apps/server/.env`, run `cd apps/server && pnpm smoke:anthropic` to verify the real Anthropic
call works, then resume P0-29 (deploy artifacts, AUTONOMOUS-author portion only; deps P0-25
satisfied; execute half is GATED G-04/G-05/G-09, do NOT attempt). Repo still has NONE of:
`docker-compose.yml`, `Caddyfile`, root `README.md`, `apps/server/Dockerfile` (P0-12 gap).
`apps/web` doesn't exist — compose/Caddyfile should NOT reference a `web` service yet (api +
caddy + postgres + uptime-kuma only, web routing as commented placeholder). Write: `Caddyfile`,
`docker-compose.yml` (prod profile only), minimal `apps/server/Dockerfile` (node:22-slim, pnpm
workspace install, run via existing `tsx src/index.ts`), `.github/workflows/deploy.yml`
(no-ops with clear message when SSH_HOST/SSH_USER/SSH_KEY secrets absent), `README.md` ops
section (restic + Hetzner Storage Box + RESTIC_PASSWORD, Uptime Kuma, secret names matching
BUILD-EXECUTION-PLAN.md gates table ~line 1380). Accept: `docker compose --profile prod
config` validates, `pnpm ci:local` still green. Also OUT OF SCOPE, noted: `ci.yml` runs
`pnpm --filter @charisma/content validate` but `packages/content` isn't a real pnpm package
(data dir inside `packages/core`) — pre-existing, needs own cycle.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME. Payments: Merchant-of-Record (Paddle, web only).
- Product: ONE mode, EVERYDAY/charisma, TEXT CHAT only v1. Daily chat challenge vs AI
  character -> feedback + charisma SCORE (deterministic) + streak. 3-5 min.
- Monetization: text chat FULLY FREE; paywall = premium AVATAR tier (Phase 6).
- Model: Claude Haiku behind swappable ChatModel; 2 calls/session (character + scoring).
- Auth header: `Authorization: Bearer <id>` (BUILD-EXECUTION-PLAN.md Section 3.3's
  `x-test-user` claim is stale; trust `apps/server/src/auth/AuthVerifier.ts`).

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, NO Docker locally. DBs `charisma` + `charisma_test`
  exist; migration applied to `charisma_test` ONLY.
- `apps/server/.env` is the real per-app env file (tsx auto-loads from cwd); root `.env` is
  an unrelated project's file, do not confuse the two.
- Don't `kill $(lsof -ti:3000)` — verify server boot via vitest `app.inject()`.
- Open gates: G-01 Anthropic key (in progress this session), G-02 Clerk, G-03 Paddle,
  G-04/G-05/G-09 deploy.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
BUILD-PLAN-MAP.md | BUILD-EXECUTION-PLAN.md (offset/limit only; P0-29 spec ~line 1254,
gates table ~1370-1395, file tree ~95-120) | FABLE-PROMPT-CHARISMA-CHAT.md | POSITIONING.md |
HANDOFF.md (loop doctrine).
