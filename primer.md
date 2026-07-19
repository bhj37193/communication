# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0 + Phase 1 done and verified sound (files exist, git
clean). A `critic` (Opus, read-only) agent was dispatched to validate
`.omc/plans/autopilot-impl.md` against the actual source files before
Phase 2 execution starts. That agent was still running (mid-read of
spec/plan) when this checkpoint was forced by context limit — its
result was never collected. No code written yet.

## EXACT NEXT STEP
Re-dispatch `oh-my-claudecode:critic` (Opus, read-only) fresh — do not
try to resume the prior agent, its ID will not survive /clear. Prompt:
have it read `.omc/autopilot/spec.md` and `.omc/plans/autopilot-impl.md`,
then verify against real source (`apps/server/src/routes/sessions.ts`,
`db/schema.ts`, `db/seed.ts`, `services/caps.ts`, `db/migrations/
0000_init.sql`, `packages/core/schemas.ts`, `test/integration/
loop.test.ts`, `sessions.caps.test.ts`) whether: (1) the plan's claims
about existing code are accurate, (2) the 7-step dependency order is
valid, (3) the "byte-identical" regression claim actually holds
(critically: does `seed.ts` write `units.spec` verbatim from
`SAM_PACK.unit` with zero transformation — if not, the regression bar
is false), (4) the mastery-fold distinct-day gate logic is correct and
its 4 planned test cases are sufficient, (5) Step 3 catches every
`SAM_PACK.unit.*` call site. Verdict: APPROVE or REJECT with concrete
file/line fixes. Only after APPROVE, proceed to Phase 2 (execution via
executor agents, parallel where independent).

## COMPLETED THIS SESSION
- `.omc/autopilot/spec.md` (Phase 0): 3 deliverables — unit-serving
  route (`routeNextUnit`+`GET /v1/challenge/today`, INV-7 no catalog),
  mastery-fold (`foldProgress` pure fn off `progress_events`), mobile
  fetch. Non-goals: no review mechanics, no real drill/explain serving,
  no `SkillPackSchema` widening, no content loader.
- `.omc/plans/autopilot-impl.md` (Phase 1, 7 dependency-ordered steps,
  fold.ts+test -> router.ts -> sessions.ts generalization+fold-writer ->
  GET /v1/challenge/today -> regression gate (loop.test.ts +
  sessions.caps.test.ts + full server/core suite, unmodified) -> mobile
  -> final verify). Resolved calls: A1 `SAM_PACK.signals` stays
  module-sourced; A2 loaded spec parsed via `UnitSchema` not
  `AnyUnitSchema`; A3 `foldProgress` pure, writer diffs prior status so
  replays never re-fire `skill_mastered`. Critical regression catch:
  `routeNextUnit` must treat zero `user_skill_state` rows as eligible,
  not locked (`loop.test.ts` uses fresh random users).

## LOCKED DECISIONS (do not re-litigate)
- 4-skill taxonomy final; non-AI drill self-attested pass; 8 drill reps
  + 1 AI capstone/stage; expert anchors credibility-only w/
  corroboration; no pricing content in curriculum docs; engine extends,
  never redesigns; connection/clarity north stars parallel, clarity
  never touches connection's locked code path.
- Full scenario-unit serve-path scope (2026-07-19) over drill-only
  slice. spec.md/plan.md Non-goals are locked scope cuts. `prd.md`
  (superseded draft) obsolete; PRD-CHARISMA-CHAT.md is source of truth.

## OUTSTANDING OPS
App-store tasks #1-4 user-blocked; FABLE-PROMPT-PROVEN-PROGRESS.md
deferred, unrelated.

## DOC REFS
PRD-CHARISMA-CHAT.md (§3.2, §3.7/INV-7, §4, §4.7, §5) | .omc/autopilot/
spec.md | .omc/plans/autopilot-impl.md | apps/server/test/integration/
{loop,setup}.ts | apps/server/src/routes/sessions*.ts | apps/server/src/
db/{schema,seed}.ts+migrations/0000_init.sql | apps/server/src/services/
{profile,caps}.ts | packages/core/{schemas,fakes/FakeChatModel}.ts |
apps/mobile/app/index.tsx | lib/api.ts
