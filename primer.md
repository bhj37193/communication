# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics + CI. `apps/mobile`
(Expo/RN): P0-27, P0-28 CLOSED. `apps/web` not started (P2). P0-29 (deploy artifacts,
author-only half) CLOSED prior session — see docker-compose.yml/Caddyfile/deploy.yml/README.md
at repo root + apps/server/Dockerfile.

**This session:** cancelled a stray autopilot mode left active from a prior `/autopilot`
invocation (state marked inactive, skill-active cleared, no linked ralph/ultraqa) — that mode
didn't match this repo's actual ralph-loop/primer.md pattern, no autopilot work was lost.
Then picked up the next queued task from primer.md: fixing bug (a) below. Dispatched an
Explore agent to map every `computeSignals` call site and confirm exactly where the `/end`
handler's `warmthTrace` array is missing its leading opener `0`. **Agent had not yet returned
results when this context-watchdog trigger fired** — no fix has been written yet, nothing to
verify.

**Next action (ONE task only):** Check the Explore agent's findings (or re-run the search if
its result was lost across /clear: grep `computeSignals(` across apps/server, packages/core,
tests). Confirm the `/end` handler's trace array omits a leading `0` for the opener message,
shifting `warmTwoIndex`/reciprocity math. Fix at computeSignals' shared call site / trace
construction, not per-caller (ponytail root-cause rule). Add/update one test asserting correct
indexing. Then move to bug (b): 409 CAPPED response missing next-open-time field (spec wants
it, current impl/test omit it) — same file area likely.

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
