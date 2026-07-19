# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0+1 done (plan APPROVED). Phase 2 (Steps 1-7 of
`.omc/plans/autopilot-impl.md`) DONE and verified this session. Phase 4
(multi-perspective validation) in progress: architect + security-
reviewer both returned APPROVE but only a thin one-line summary landed
(full findings text was lost); both were resumed via SendMessage and
asked to restate findings in full — response not yet received.
code-reviewer (3rd validator) has not yet reported at all. Do not
re-dispatch fresh reviewers until confirming these are truly dead —
just keep waiting for notifications.

## COMPLETED THIS SESSION
- `apps/server/src/services/fold.ts`/`fold.test.ts`, `router.ts`: done
  earlier (Wave A), verified.
- `apps/server/src/routes/sessions.ts`: generalized off DB-loaded unit
  spec via `loadUnitSpec`/`routeNextUnit`; `SAM_UNIT_ID` import dropped,
  `SAM_PACK` kept only for `.signals`; fold writer wired in `/end`; new
  `GET /v1/challenge/today` (explicit field allowlist, excludes opener).
- `apps/mobile/lib/api.ts` + `app/index.tsx`: `getChallenge()` added,
  hardcoded `SCENARIO_TITLE`/`SCENARIO_SETUP` removed, screen fetches
  copy on mount.
- `apps/mobile/test/api.test.ts` + `test/screens.test.tsx`: both
  updated for the new endpoint/mock.
- Verified: server/mobile/core `tsc --noEmit` all clean; server vitest
  43/43, core vitest 95/95, mobile jest 26/26, all green; grep confirms
  zero residual `SAM_UNIT_ID`/`SAM_PACK.unit.`/`SCENARIO_TITLE`/
  `SCENARIO_SETUP`. This is real, already verified — do not re-run
  unless a validator flags a specific regression.

## EXACT NEXT STEP
1. Wait for task-notifications from: architect (agent id
   `afd6cf61411359a5a`, resumed, asked to restate findings),
   security-reviewer (agent id `a7bd09cb0c723513f`, resumed, asked to
   restate findings), code-reviewer (agent id `ac9a7eb575e9ea495`,
   original dispatch, never reported). Do NOT call `TaskOutput` on any
   of them (dumps full transcript, blows context).
2. If all 3 land and all APPROVE: Phase 5 — delete `.omc/state/
   {autopilot,ralph,ultrawork,ultraqa}-state.json`, run
   `/oh-my-claudecode:cancel`.
3. If any reject: fix the specific file:line issues, re-run affected
   test suite, re-dispatch only the rejecting reviewer(s) (max 3 rounds
   per autopilot policy).
4. If code-reviewer notification never arrives after 1-2 more wakeups,
   it's reasonable to dispatch a fresh code-reviewer agent rather than
   waiting indefinitely.

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
autopilot-impl.md | apps/server/src/routes/sessions.ts | apps/server/
src/services/{fold,router,profile,caps}.ts | packages/core/schemas.ts |
apps/mobile/app/index.tsx | apps/mobile/lib/api.ts
