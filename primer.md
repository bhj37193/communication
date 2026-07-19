# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Server loop complete and green: sessions/messages/end/result endpoints wired to
packages/core (validator + deterministic score) + AnthropicChatModel (real, Haiku) /
FakeChatModel (test) + FakeAuthVerifier + daily cap + cost breaker + retention sweep +
Clerk webhook + analytics + CI. apps/mobile P0-27/28 closed. apps/web not started (P2).
P0-29 deploy artifacts (author-only half) closed. Autopilot state cancelled cleanly this
session (inactive, resume data preserved).

**This session (committed e1a00e5):** ran FABLE-PROMPT-CONNECTION-LIBRARY.md in full.
Authored `content-library/` (ICM author layer: north-star + humanizer constraints,
everyday-connection skill FULL + 7 stubs, sam-housewarming persona FULL + 3 stubs, both
system prompt templates, talks.md, README/CONTEXT). Added `packages/core/assemble.ts`
(assembleCharacterTurn / assembleFeedback / renderUserProfile) + tests; system prompt is
byte-identical per unit (cache-stable), warmth + user profile ride in a [session context]
first user message (also fixes user-first ordering for real API). Wired sessions.ts
character + feedback calls through the assembler. AnthropicChatModel: json-fence
stripping committed + strict-TS nit fixed. Core 71/71, server 35/35, typecheck clean.

**Next action:** user still pasting real Anthropic key into apps/server/.env (opened in
TextEdit earlier, unconfirmed). Once confirmed: `cd apps/server && pnpm smoke:anthropic`,
then a real end-to-end Sam session against Haiku. If checkpoint loop refires with no new
task: check git status, re-ask about the key, do not invent scope, do not re-run
autopilot phases.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME. Payments: Paddle MoR, web only.
- ONE mode, EVERYDAY/charisma, TEXT CHAT only v1. Daily challenge vs AI character ->
  feedback + deterministic score + streak. 3-5 min.
- Text chat fully free; paywall = premium AVATAR tier (Phase 6).
- Auth header: `Authorization: Bearer <id>` (fake auth for personal use).
- Prompt design LOCKED: static system per unit; per-turn context in messages, never in
  system (assemble.test.ts enforces).

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, no Docker locally. apps/server/.env (gitignored,
  tsx auto-loads) holds real env; root .env belongs to an unrelated project.
- Gates: G-01 Anthropic key (in progress), G-02 Clerk, G-03 Paddle, G-04/05/09 deploy.
- Uncommitted (not mine, left alone): apps/mobile chat.tsx + package.json + .expo/,
  apps/server package.json + app.ts + smoke-anthropic.ts, pnpm-lock.yaml, "quizlet /".
- userProfile projections not built: server passes none, renders "first session, no
  history yet". Build DB projection when event-log work is scheduled.
- Flagged only, do not fix unprompted: ci.yml/root package.json reference
  @charisma/content which is not a real pnpm package.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
content-library/README.md + CONTEXT.md (author-vs-serve mapping) | BUILD-PLAN-MAP.md |
BUILD-EXECUTION-PLAN.md (gates ~1370-1395) | FABLE-PROMPT-CONNECTION-LIBRARY.md |
POSITIONING.md | HANDOFF.md (loop doctrine).
