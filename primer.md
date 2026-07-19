# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0 done. Phase 1 (planning) in progress: architect agent
`phase1-planner` dispatched in background; no `.omc/plans/autopilot-
impl.md` on disk yet; sent a check-in, no reply yet. Fallback wakeup
~15:51 scheduled as backstop. No code written yet.

## COMPLETED THIS SESSION
- `.omc/autopilot/spec.md` (Phase 0): (1) `routeNextUnit` + `GET /v1/
  challenge/today` (PRD INV-7: never list/catalog) + generalizing
  `POST /v1/sessions` off a DB-loaded unit spec instead of hardcoded
  `SAM_PACK` (byte-identical regression bar); (2) `foldProgress` pure
  fold fn (`progress_events` enum verified vs migrations/0000_init.sql
  :56-59; mastery `passes_required:2, distinct_days:true` unreachable
  same-day, needs synthetic-event unit tests, user-tz via `caps.ts`);
  (3) mobile `index.tsx` fetching the new endpoint. Non-goals: no review
  mechanics, no real drill/explain serving, no `SkillPackSchema`
  widening, no content loader.
- Dispatched `oh-my-claudecode:architect` (`phase1-planner`, opus, bg)
  for the Phase 1 plan; not yet returned despite a check-in ping.
- Resolved: `prd.md` is a superseded older draft ("Cadence"); PRD-
  CHARISMA-CHAT.md:3 supersedes it, ignore prd.md going forward.
- Read `loop.test.ts` in full — THE regression gate. 4 fixed-value cases
  (good run score 100 + exact signals; bad run score 20, monologue_brag;
  fabricated-quote->template fallback; warmTwoIndex opener-offset) must
  survive SAM_PACK->DB-loaded-spec generalization byte-for-byte. Uses
  `buildTestApp`/`playToResult`/`seedContent` (./setup.js) + `FakeChatModel`
  /SAM_GOOD_RUN/SAM_BAD_RUN (@charisma/core/fakes). Also: sessions.caps
  .test.ts + app/AuthVerifier/retention/analytics/caps/events + core's
  schemas/score/validator/assemble tests.

## EXACT NEXT STEP
Wait for `phase1-planner`'s reply/notification (no more pinging beyond
the one sent). Once `.omc/plans/autopilot-impl.md` exists, confirm it
names loop.test.ts's 4 fixed-value cases as the regression gate, run
`oh-my-claudecode:critic`, then Phase 2 (execution), Phase 3 (QA), Phase
4 (architect+security-reviewer+code-reviewer), Phase 5 (cleanup+cancel).

## LOCKED DECISIONS (do not re-litigate)
- 4-skill taxonomy final; non-AI drill self-attested pass; 8 drill reps +
  1 AI capstone/stage; expert anchors credibility-only w/ corroboration;
  no pricing content in curriculum docs; engine extends, never redesigns;
  connection/clarity north stars parallel, clarity never touches
  connection's locked code path.
- Full scenario-unit serve-path scope (2026-07-19) over drill-only slice.
  Spec.md Non-goals are locked scope cuts. `prd.md` obsolete.

## OUTSTANDING OPS
App-store tasks #1-4 user-blocked; FABLE-PROMPT-PROVEN-PROGRESS.md deferred, unrelated.

## DOC REFS
PRD-CHARISMA-CHAT.md (§3.2, §3.7/INV-7, §4, §4.7, §5) | .omc/autopilot/
spec.md | .omc/plans/autopilot-impl.md (pending) | apps/server/test/
integration/{loop,setup}.ts | apps/server/src/routes/sessions*.ts |
apps/server/src/db/{schema,seed}.ts+migrations/0000_init.sql |
apps/server/src/services/{profile,caps}.ts | packages/core/{schemas,
fakes/FakeChatModel}.ts | apps/mobile/app/index.tsx | lib/api.ts
