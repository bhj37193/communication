# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS
Core loop green (core 71/71, server 39/39) on real Anthropic models. Mobile
app-store pivot tasks #1-4 (Apple Developer, EAS, VPS, Clerk accounts) still
user-blocked. Separately, worked a strategy thread: communication-vs-connection
positioning, then "prove improvement with a real metric," now authored as a
new Fable driver prompt (not yet run).

## COMPLETED THIS SESSION
- Positioning call (reasoning only, not written to a file beyond this primer):
  train communication as the mechanic, market connection as the outcome.
- Researched Alpha School (mastery-gating 90%, spaced re-quizzing, external
  standardized benchmark NWEA MAP 3x/yr, Bloom's 2-sigma) as precedent for
  "does this work as real education, not a scoring toy" — answer: yes, the
  pedagogy shape is precedented; the one gap vs Alpha is an EXTERNAL,
  independently-normed validation of the score (Alpha has NWEA MAP, we don't).
- Consulted opus advisor on how to prompt Fable for this: split into
  reliability (done, validator.ts/score.ts, don't touch) / comparability
  (new: fixed "checkpoint" retest, separate from rotating daily practice, to
  resolve tension with POSITIONING.md's anti-companion-drift "rotate
  characters" rule) / validity (design + instrument only, can't fabricate a
  real study).
- Wrote `FABLE-PROMPT-PROVEN-PROGRESS.md`: driver prompt for Fable 5 to
  design/build the checkpoint mechanism + longitudinal storage + a validity
  roadmap section, hard-locked against schemas.ts/score.ts/validator.ts/
  static-prompt-split/strict-JSON contracts, free on schema shape/cadence/
  content/copy. NOT yet run through Fable.
- Updated `HOW-TO-RUN-FABLE.md`: added section 4 (run after core code) +
  updated the combined fallback to 4 steps. Verified no duplicate sections.

## EXACT NEXT STEP
1. App-store side: still nothing autonomously actionable, all of #1-4 +
   name/screenshots/privacy-URL are user-blocked (see prior status, unchanged).
2. Strategy side: `FABLE-PROMPT-PROVEN-PROGRESS.md` is ready to paste into
   Fable per HOW-TO-RUN-FABLE.md section 4. After it runs: reconcile its
   schema additions against core/server test suites before building on them
   (per the "After the runs" note in that file).

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME. ONE mode, EVERYDAY/charisma, TEXT
  CHAT only v1. Daily challenge vs AI character -> feedback + deterministic
  score + streak. Text chat free; paywall = AVATAR tier (Phase 6).
- Prompt design LOCKED: static system per unit; per-turn context in messages,
  never system (assemble.test.ts enforces).
- Models: character = Haiku, feedback = Sonnet, routed by call `tag`.
- Mobile-only App Store release; hosting = user's own plain Ubuntu VPS.
- New: score.ts formula/weights and validator.ts signal defs stay untouched
  by the proven-progress work; checkpoint is a separate mode from daily
  rotating practice, not a redesign of it.

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, no Docker locally.
- Gates: G-01 CLOSED. G-02 Clerk in progress. G-03 Paddle deferred.
- User has zero of: Apple Developer, Expo/EAS, VPS, Clerk accounts.
- Flagged only, don't fix unprompted: ci.yml/root package.json reference
  nonexistent `@charisma/content`; SOURCE-DO-NOT-SHIP/ deletion discrepancy.

## DOC REFS
content-library/README.md + CONTEXT.md | POSITIONING.md |
FABLE-PROMPT-PROVEN-PROGRESS.md | HOW-TO-RUN-FABLE.md |
FABLE-PROMPT-CONNECTION-LIBRARY.md | packages/core/{schemas,validator,score}.ts
| apps/mobile/app-store-listing.md | deploy/README.md.
