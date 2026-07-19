# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0 + Phase 1 done, files verified sound (git clean, no
code written yet). Twice now a `critic` (Opus, read-only) agent has been
dispatched to validate `.omc/plans/autopilot-impl.md` against real
source before Phase 2 execution, and twice the context-watchdog forced
a checkpoint+/clear before its verdict arrived — the agent's result was
never collected either time. Its background run does not survive
/clear, so it must be re-dispatched fresh each session until one
actually completes and reports before the next forced checkpoint.

## EXACT NEXT STEP
Re-dispatch `oh-my-claudecode:critic` (Opus, read-only) fresh. Prompt:
read `.omc/autopilot/spec.md` + `.omc/plans/autopilot-impl.md`, verify
against real source (`apps/server/src/routes/sessions.ts`, `db/
schema.ts`, `db/seed.ts`, `services/caps.ts`, `db/migrations/
0000_init.sql`, `packages/core/schemas.ts`, `test/integration/
loop.test.ts`, `sessions.caps.test.ts`) whether: (1) plan's claims about
existing code are accurate, (2) 7-step dependency order valid, (3)
"byte-identical" regression claim holds — critically, does `seed.ts`
write `units.spec` verbatim from `SAM_PACK.unit` with zero
transformation, (4) mastery-fold distinct-day gate logic correct + its
4 test cases sufficient, (5) Step 3 catches every `SAM_PACK.unit.*`
call site. Verdict: APPROVE/REJECT w/ concrete file/line fixes, capped
under 500 words. **This time, wait for the completion notification
before doing anything else** (don't let a re-invoked /autopilot
interrupt it again) — if the watchdog fires again first, checkpoint
immediately with whatever verdict text is available, even partial.
Only after APPROVE, proceed to Phase 2 (execution via executor agents).

## COMPLETED PRIOR SESSIONS
- `.omc/autopilot/spec.md` (Phase 0): unit-serving route (`routeNextUnit`
  +`GET /v1/challenge/today`, INV-7 no catalog), mastery-fold
  (`foldProgress` pure fn), mobile fetch. Non-goals: no review
  mechanics, no real drill/explain serving, no `SkillPackSchema`
  widening, no content loader.
- `.omc/plans/autopilot-impl.md` (Phase 1, 7 steps: fold.ts+test ->
  router.ts -> sessions.ts generalization+fold-writer -> GET /v1/
  challenge/today -> regression gate (loop.test.ts + sessions.caps
  .test.ts + full suite, unmodified) -> mobile -> final verify).
  A1 `SAM_PACK.signals` module-sourced; A2 DB spec parsed via
  `UnitSchema`; A3 writer diffs prior status, no replay re-fire.
  Critical: `routeNextUnit` must treat zero `user_skill_state` rows as
  eligible not locked (`loop.test.ts` uses fresh random users).

## LOCKED DECISIONS (do not re-litigate)
4-skill taxonomy final; non-AI drill self-attested pass; 8 drill reps +
1 AI capstone/stage; expert anchors credibility-only; no pricing
content in curriculum; engine extends never redesigns; connection/
clarity north stars parallel. Full scenario-unit serve-path scope
(2026-07-19) over drill-only slice; spec/plan Non-goals are locked
cuts; `prd.md` obsolete, PRD-CHARISMA-CHAT.md is source of truth.

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
