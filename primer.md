# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics + CI. `apps/mobile`
(Expo/RN): P0-27, P0-28 CLOSED. `apps/web` not started (P2). P0-29 (deploy artifacts,
author-only half) CLOSED — docker-compose.yml/Caddyfile/deploy.yml/README.md at repo root +
apps/server/Dockerfile.

**This session:** closed both bugs queued from the prior primer, then cancelled autopilot
mode cleanly (`/oh-my-claudecode:cancel`, no linked ralph/ultraqa, skill-active cleared).
(a) `warmthTrace` missing-leading-0 bug: root cause was the single `insert(sessions)` in
`apps/server/src/routes/sessions.ts` relying on the `warmth_trace` column's `[]` default
instead of seeding `[0]` for the opener (the `playSession` test helper in
`packages/core/fakes/FakeChatModel.ts` already did this right, masking it from unit tests).
Fixed at that one shared insert. Added `loop.test.ts` regression test
(`warmTwoIndex accounts for the opener before crediting reciprocity`) — proven red without
the fix, green with it.
(b) 409 CAPPED now returns `next_open_at` (ISO instant of user's next tz-local midnight) via
new `nextLocalMidnightUTC` helper in `caps.ts` (stdlib `Intl`, `ponytail:`-flagged DST-at-
midnight edge case). Updated `sessions.caps.test.ts` CAPPED assertion to cover it.
Full `apps/server` suite: 34/34 green. Both fixes verified by stash-revert-rerun (red without,
green with). Changes are **uncommitted** in the working tree (user hasn't asked to commit).

**Next action:** primer's task queue is empty — both bugs closed, nothing further specified.
Await next instruction. If resuming cold, first `git status`/`git diff` to see the 4 uncommitted
files (`apps/server/src/routes/sessions.ts`, `apps/server/src/services/caps.ts`,
`apps/server/src/routes/sessions.caps.test.ts`, `apps/server/test/integration/loop.test.ts`)
before deciding whether to commit or keep iterating.

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
