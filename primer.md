# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics + CI. `apps/mobile`
(Expo/RN): P0-27, P0-28 CLOSED. `apps/web` not started (P2). P0-29 (deploy artifacts,
author-only half) CLOSED — docker-compose.yml/Caddyfile/deploy.yml/README.md at repo root +
apps/server/Dockerfile.

**Prior session:** closed 2 queued bugs in `apps/server`, both committed (warmthTrace opener
seed fix in `routes/sessions.ts`; 409 CAPPED `next_open_at` via `nextLocalMidnightUTC` in
`services/caps.ts`). Full suite 34/34 green, both stash-verified as real regressions.

**This session:** re-invoked repeatedly via automated checkpoint/clear loop with no new task
attached each time — confirmed clean git tree, made no code changes, declined to invent scope
per standing instruction. User then asked to open `apps/server/.env` so they could paste in
their real Anthropic key; opened it via `open -e` (TextEdit). Not yet confirmed saved/pasted.

**Next action:** once user confirms the key is pasted and saved into `apps/server/.env`, run
`cd apps/server && pnpm smoke:anthropic` to verify it works. If the checkpoint loop fires again
before that confirmation arrives, just re-check git status and re-ask — do not invent scope,
do not re-run autopilot phases.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME. Payments: Merchant-of-Record (Paddle, web only).
- Product: ONE mode, EVERYDAY/charisma, TEXT CHAT only v1. Daily chat challenge vs AI
  character -> feedback + charisma SCORE (deterministic) + streak. 3-5 min.
- Monetization: text chat FULLY FREE; paywall = premium AVATAR tier (Phase 6).
- Auth header: `Authorization: Bearer <id>` (fake auth = no Clerk needed for personal use).

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, NO Docker locally. `apps/server/.env` (gitignored,
  tsx auto-loads it) holds real per-app env; root `.env` is an unrelated project's file.
- Anthropic key: user pasting into `apps/server/.env` manually, in progress this session —
  once confirmed, run `cd apps/server && pnpm smoke:anthropic`.
- Don't `kill $(lsof -ti:3000)` — verify server boot via vitest `app.inject()`.
- Open gates: G-01 Anthropic key (in progress), G-02 Clerk, G-03 Paddle, G-04/G-05/G-09 deploy.
- Out of scope, flagged only: `ci.yml`/root `package.json` reference `pnpm --filter
  @charisma/content validate` but `packages/content` isn't a real pnpm package (data dir
  inside packages/core) — needs its own cycle, don't fix without explicit instruction.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
BUILD-PLAN-MAP.md | BUILD-EXECUTION-PLAN.md (gates table ~1370-1395) |
FABLE-PROMPT-CHARISMA-CHAT.md | POSITIONING.md | HANDOFF.md (loop doctrine).
