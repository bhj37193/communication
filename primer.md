# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics + CI. `apps/mobile`
(Expo/RN): P0-27, P0-28 CLOSED. `apps/web` not started (P2). P0-29 (deploy artifacts,
author-only half) CLOSED — docker-compose.yml/Caddyfile/deploy.yml/README.md at repo root +
apps/server/Dockerfile.

**Prior session:** closed 2 queued bugs in `apps/server`, both committed. (a) `warmthTrace`
was missing the opener's implicit warmth-0 (root cause: the one `insert(sessions)` in
`routes/sessions.ts` used the `warmth_trace` column's `[]` default instead of seeding `[0]`)
— fixed at that single insert; regression test added in `loop.test.ts`. (b) 409 CAPPED now
returns `next_open_at` (next tz-local midnight) via new `nextLocalMidnightUTC` in
`services/caps.ts`; test updated. Full `apps/server` suite 34/34 green, both fixes
stash-verified as real regressions.

**This session:** re-invoked via automated checkpoint/clear loop, still no new task attached.
Confirmed git tree clean and both fixes committed — nothing pending, nothing broken, no code
changes made. A stale `autopilot` state (session was `awaiting_confirmation`, never ran any
phase) was cleared via `/oh-my-claudecode:cancel` since there was no work for it to do.
Reported idle status to user twice and asked what to tackle next; no answer yet.

**Next action:** none queued. Await explicit next task from user before doing further work —
do not invent scope. If this loop fires again with still nothing queued, just re-confirm clean
state and stop; do not repeat full autopilot phases or re-cancel an already-cleared mode.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME. Payments: Merchant-of-Record (Paddle, web only).
- Product: ONE mode, EVERYDAY/charisma, TEXT CHAT only v1. Daily chat challenge vs AI
  character -> feedback + charisma SCORE (deterministic) + streak. 3-5 min.
- Monetization: text chat FULLY FREE; paywall = premium AVATAR tier (Phase 6).
- Auth header: `Authorization: Bearer <id>` (fake auth = no Clerk needed for personal use).

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, NO Docker locally. `apps/server/.env` (gitignored,
  tsx auto-loads it) holds real per-app env; root `.env` is an unrelated project's file.
- User is pasting their own Anthropic key into apps/server/.env manually (not yet confirmed
  done) — once done, run `cd apps/server && pnpm smoke:anthropic` to verify.
- Don't `kill $(lsof -ti:3000)` — verify server boot via vitest `app.inject()`.
- Open gates: G-01 Anthropic key (in progress), G-02 Clerk, G-03 Paddle, G-04/G-05/G-09 deploy.
- Out of scope, flagged only: `ci.yml`/root `package.json` reference `pnpm --filter
  @charisma/content validate` but `packages/content` isn't a real pnpm package (data dir
  inside packages/core) — needs its own cycle, don't fix without explicit instruction.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
BUILD-PLAN-MAP.md | BUILD-EXECUTION-PLAN.md (gates table ~1370-1395) |
FABLE-PROMPT-CHARISMA-CHAT.md | POSITIONING.md | HANDOFF.md (loop doctrine).
