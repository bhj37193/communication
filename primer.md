# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0+1 done (plan APPROVED). Phase 2 (Steps 1-7 of
`.omc/plans/autopilot-impl.md`) DONE and verified this session. Phase 4
(multi-perspective validation) dispatched, 3 agents running in
background, results not yet collected as of this checkpoint.

## COMPLETED THIS SESSION
- `apps/server/src/services/fold.ts`/`fold.test.ts`, `router.ts`: done,
  verified earlier (Wave A).
- `apps/server/src/routes/sessions.ts`: generalized off DB-loaded unit
  spec via `loadUnitSpec`/`routeNextUnit`; `SAM_UNIT_ID` import dropped,
  `SAM_PACK` kept only for `.signals`; fold writer wired in `/end`
  (progress_events -> foldProgress -> conditional skill_mastered ->
  upsert user_skill_state); new `GET /v1/challenge/today` (explicit
  field allowlist, excludes opener, fires `challenge_viewed`).
- `apps/mobile/lib/api.ts`: added `Challenge` + `getChallenge()`.
- `apps/mobile/app/index.tsx`: removed hardcoded `SCENARIO_TITLE`/
  `SCENARIO_SETUP`; fetches via `getChallenge()` on mount.
- `apps/mobile/test/api.test.ts`: added `getChallenge` case.
- `apps/mobile/test/screens.test.tsx`: fixed pre-existing test (added
  `getChallenge: jest.fn()` to mock, mocked resolved value) — was
  failing after copy removal, unrelated fallout, now fixed.
- Verified: server/mobile/core `tsc --noEmit` all clean; server vitest
  43/43, core vitest 95/95, mobile jest 26/26, all green; grep confirms
  zero residual `SAM_UNIT_ID`/`SAM_PACK.unit.` reads and zero residual
  `SCENARIO_TITLE`/`SCENARIO_SETUP`.

## EXACT NEXT STEP
1. Collect results from the 3 background Phase 4 validator agents
   (architect, security-reviewer, code-reviewer — dispatched against
   the full diff). Do NOT call `TaskOutput` on them (blows context) —
   wait for task-notification, or use SendMessage to the agent id if
   resuming. If a "killed"/"completed" notification looks stale (from
   before a context clear), cross-check against actual file state
   before trusting it.
2. If all 3 approve: Phase 5 — delete `.omc/state/{autopilot,ralph,
   ultrawork,ultraqa}-state.json`, run `/oh-my-claudecode:cancel`.
3. If any reject: fix the specific file:line issues raised, re-run the
   affected test suite, re-dispatch only the rejecting reviewer(s) (max
   3 rounds per autopilot policy).

## LOCKED DECISIONS (do not re-litigate)
4-skill taxonomy final; non-AI drill self-attested pass; 8 drill reps +
1 AI capstone/stage; expert anchors credibility-only; no pricing
content in curriculum; engine extends never redesigns; connection/
clarity north stars parallel. Full scenario-unit serve-path scope over
drill-only slice; spec/plan Non-goals are locked cuts; `prd.md`
obsolete, PRD-CHARISMA-CHAT.md is source of truth.

## OUTSTANDING OPS
App-store tasks #1-4 user-blocked; FABLE-PROMPT-PROVEN-PROGRESS.md
deferred, unrelated.

## DOC REFS
PRD-CHARISMA-CHAT.md | .omc/autopilot/spec.md | .omc/plans/
autopilot-impl.md | apps/server/test/integration/{loop,setup}.ts |
apps/server/src/routes/sessions*.ts | apps/server/src/services/
{profile,caps,fold,router}.ts | packages/core/schemas.ts |
apps/mobile/app/index.tsx | apps/mobile/lib/api.ts
