# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0 + Phase 1 done. `.omc/plans/autopilot-impl.md` exists
(`phase1-planner` completed; its notification never surfaced in-band —
found by checking disk directly, not by polling further). Next: dispatch
`oh-my-claudecode:critic` to validate the plan, then Phase 2 execution.
No code written yet.

## COMPLETED THIS SESSION
- `.omc/autopilot/spec.md` (Phase 0): 3 deliverables — unit-serving route
  (`routeNextUnit`+`GET /v1/challenge/today`, PRD INV-7 no catalog),
  mastery-fold (`foldProgress` pure fn off `progress_events`), mobile
  fetch. Non-goals: no review mechanics, no real drill/explain serving,
  no `SkillPackSchema` widening, no content loader.
- `.omc/plans/autopilot-impl.md` (Phase 1, 7 steps, dependency-ordered:
  fold.ts+test -> router.ts -> sessions.ts generalization+fold-writer ->
  GET /v1/challenge/today -> regression gate (loop.test.ts +
  sessions.caps.test.ts + full server/core suite, unmodified) -> mobile
  -> final verify). Key resolved calls: `SAM_PACK.signals` stays
  module-sourced (pack-level signals never seeded to DB — A1); loaded
  spec parsed via `UnitSchema` not `AnyUnitSchema` (scenario-only is
  real — A2); `foldProgress` pure, writer detects newly-mastered via
  prior-status diff so replays never re-fire `skill_mastered` (A3).
  **Critical regression catch**: `routeNextUnit` must treat a user with
  zero `user_skill_state` rows as eligible, not locked — `loop.test.ts`
  uses fresh random users and would break otherwise.
- Resolved: `prd.md` is a superseded older draft ("Cadence"); PRD-
  CHARISMA-CHAT.md:3 supersedes it, ignore prd.md going forward.

## EXACT NEXT STEP
Dispatch `oh-my-claudecode:critic` (opus, read-only) with spec.md + the
plan to validate before Phase 2 (execution via executor agents). Phase 3
QA must run `loop.test.ts` + `sessions.caps.test.ts` + full server/core
suite unmodified — any diff is a bug in the new code, never a reason to
edit the test. Then Phase 4 (architect+security-reviewer+code-reviewer),
Phase 5 (cleanup + `/oh-my-claudecode:cancel`).

## LOCKED DECISIONS (do not re-litigate)
- 4-skill taxonomy final; non-AI drill self-attested pass; 8 drill reps +
  1 AI capstone/stage; expert anchors credibility-only w/ corroboration;
  no pricing content in curriculum docs; engine extends, never redesigns;
  connection/clarity north stars parallel, clarity never touches
  connection's locked code path.
- Full scenario-unit serve-path scope (2026-07-19) over drill-only slice.
  spec.md/plan.md Non-goals are locked scope cuts. `prd.md` obsolete.

## OUTSTANDING OPS
App-store tasks #1-4 user-blocked; FABLE-PROMPT-PROVEN-PROGRESS.md deferred, unrelated.

## DOC REFS
PRD-CHARISMA-CHAT.md (§3.2, §3.7/INV-7, §4, §4.7, §5) | .omc/autopilot/
spec.md | .omc/plans/autopilot-impl.md | apps/server/test/integration/
{loop,setup}.ts | apps/server/src/routes/sessions*.ts | apps/server/src/
db/{schema,seed}.ts+migrations/0000_init.sql | apps/server/src/services/
{profile,caps}.ts | packages/core/{schemas,fakes/FakeChatModel}.ts |
apps/mobile/app/index.tsx | lib/api.ts
