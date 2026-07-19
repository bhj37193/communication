# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0 done. Phase 1 (planning) in progress: architect agent
`phase1-planner` dispatched in background, no `.omc/plans/autopilot-
impl.md` on disk yet. Many stop-hook cycles have passed with no
notification arriving, so sent it a check-in message via SendMessage
(name `phase1-planner`) asking it to confirm status/report if already
done. Fallback wakeup ~15:45 also still scheduled. No code written yet.

## COMPLETED THIS SESSION
- `.omc/autopilot/spec.md` (Phase 0): 3 deliverables — (1) `routeNextUnit`
  service + `GET /v1/challenge/today` (PRD INV-7: never list/catalog) +
  generalizing `POST /v1/sessions` off a DB-loaded unit spec instead of
  hardcoded `SAM_PACK` (byte-identical regression bar for the seeded
  unit); (2) `foldProgress` pure fold fn (`progress_events` enum verified
  vs migrations/0000_init.sql:56-59; mastery `passes_required:2,
  distinct_days:true` unreachable in one day — needs synthetic-event unit
  tests, user-tz dates via `caps.ts` pattern); (3) mobile `index.tsx`
  fetching the new endpoint instead of hardcoded copy. Non-goals: no
  review mechanics, no real drill/explain serving, no `SkillPackSchema`
  widening, no content loader.
- Dispatched `oh-my-claudecode:architect` (`phase1-planner`, opus, bg) to
  write the Phase 1 plan. Not yet returned.
- Resolved: `prd.md` is a superseded older draft ("Cadence", voice-first).
  PRD-CHARISMA-CHAT.md:3 supersedes it; ignore prd.md going forward.
- Located the regression suite for spec.md's byte-identical bar:
  `apps/server/test/integration/loop.test.ts` ("the loop proof", full
  session runs w/ exact deterministic scores) + `sessions.caps.test.ts`.
  Also present: app/AuthVerifier/AnthropicChatModel/retention/analytics/
  caps/events tests + packages/core's schemas/score/validator/assemble.

## EXACT NEXT STEP
Wait for `phase1-planner`'s completion notification (do not poll/resume
manually). Once `.omc/plans/autopilot-impl.md` exists, confirm it names
`loop.test.ts` + `sessions.caps.test.ts` as the regression gate, run
`oh-my-claudecode:critic` to validate, then Phase 2 (execution), Phase 3
(QA: those tests pass unmodified), Phase 4 (architect + security-reviewer
+ code-reviewer), Phase 5 (cleanup + `/oh-my-claudecode:cancel`).

## LOCKED DECISIONS (do not re-litigate)
- 4-skill taxonomy final; non-AI drill self-attested pass; 8 drill reps +
  1 AI capstone/stage; expert anchors credibility-only w/ corroboration;
  no pricing content in curriculum docs; engine extends, never redesigns;
  connection/clarity north stars parallel, clarity never touches
  connection's locked code path.
- Full scenario-unit serve-path scope (2026-07-19) over drill-only slice.
  Spec.md Non-goals are locked scope cuts. `prd.md` obsolete.

## OUTSTANDING OPS
- App-store tasks #1-4 user-blocked; FABLE-PROMPT-PROVEN-PROGRESS.md deferred, unrelated.

## DOC REFS
PRD-CHARISMA-CHAT.md (§3.2, §3.7/INV-7, §4, §4.7, §5) | .omc/autopilot/
spec.md | .omc/plans/autopilot-impl.md (pending) | apps/server/test/
integration/loop.test.ts | apps/server/src/routes/{sessions,sessions.caps
.test}.ts | apps/server/src/db/{schema,seed}.ts+migrations/0000_init.sql
| apps/server/src/services/{profile,caps}.ts | apps/server/src/content.ts
| packages/core/schemas.ts | apps/mobile/app/index.tsx | lib/api.ts
