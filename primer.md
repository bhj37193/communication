# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS
Server loop complete and green: sessions/messages/end/result wired to packages/core
(validator + deterministic score) + AnthropicChatModel (real, Haiku) / FakeChatModel
(test) + FakeAuthVerifier + daily cap + cost breaker + retention sweep + Clerk webhook +
analytics + CI. Core 71/71, server 35/35, typecheck clean. apps/mobile P0-27/28 closed.
apps/web not started (P2). content-library/ + assemble.ts committed (e1a00e5).
**G-01 (Anthropic key) CLOSED.** Autopilot cancelled cleanly (inactive, resume preserved).

## COMPLETED THIS SESSION
Key confirmed in apps/server/.env; `pnpm smoke:anthropic` PASSED. Full real e2e Sam
session vs live Haiku (server booted with MODEL_PROVIDER=anthropic shell override on
:3999; .env untouched, still MODEL_PROVIDER=fake): open -> 4 turns -> end -> scored
20/100 fail. Replies in-character; Haiku rejected an invented detail. Usage recorded
(4 character + 2 feedback rows, ~6k in / ~700 out total). Findings (reported only,
nothing fixed):
1. warmth 0 all turns (Haiku warmth_delta judgment; possibly stingy, tune later).
2. open_questions/followups = 0 despite 3 real questions: validator start-anchored per
   PRD 4.5 (question must START message); trailing questions never count. Tuning question.
3. template_fallback=true: feedback quotes failed verbatim checkEvidence twice; designed
   fallback fired. Anomaly: both feedback rows identical usage (821/261) 37ms apart,
   second call implausibly fast; add debug log before trusting cost data.
4. cached_in=0 everywhere: cache_control set, but Haiku 4.5 min cacheable prefix is
   4096 tokens and unit prompt ~1k. Silently uncached until prompt grows. Not a bug.
Test server killed; primer updated; autopilot state cancelled via /cancel.

## EXACT NEXT STEP
None pending from loop. User picks one: (a) tune warmth/validator thresholds against
real transcripts, (b) debug log for feedback retry anomaly, (c) G-02 Clerk, (d) mobile
app against real server. If checkpoint loop refires with no new task: check git status,
report findings above, do not invent scope, do not re-run autopilot phases.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME. Payments: Paddle MoR, web only.
- ONE mode, EVERYDAY/charisma, TEXT CHAT only v1. Daily challenge vs AI character ->
  feedback + deterministic score + streak. 3-5 min.
- Text chat fully free; paywall = premium AVATAR tier (Phase 6).
- Auth header: `Authorization: Bearer <id>` (fake auth for personal use).
- Prompt design LOCKED: static system per unit; per-turn context in messages, never in
  system (assemble.test.ts enforces).

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, no Docker. apps/server/.env (gitignored, tsx
  auto-loads) holds real env incl. Anthropic key; root .env is an unrelated project.
- Gates: G-01 CLOSED. G-02 Clerk, G-03 Paddle, G-04/05/09 deploy remain.
- Uncommitted (not mine, left alone): apps/mobile chat.tsx + package.json + .expo/,
  apps/server package.json + app.ts + smoke-anthropic.ts, pnpm-lock.yaml, "quizlet /".
- userProfile projections not built: server passes none, renders "first session, no
  history yet". Build DB projection when event-log work is scheduled.
- Flagged only, do not fix unprompted: ci.yml/root package.json reference
  @charisma/content which is not a real pnpm package.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
content-library/README.md + CONTEXT.md | BUILD-PLAN-MAP.md | BUILD-EXECUTION-PLAN.md
(gates ~1370-1395) | FABLE-PROMPT-CONNECTION-LIBRARY.md | POSITIONING.md | HANDOFF.md
(loop doctrine).
