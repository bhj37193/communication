# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0+1 done (plan APPROVED). Phase 2 (Steps 1-7 of
`.omc/plans/autopilot-impl.md`) DONE and verified this session. Phase 4
(multi-perspective validation) dispatched: architect, security-reviewer,
code-reviewer running in background against the full diff. No
completion notification received yet as of this checkpoint (waited
twice, ~40min combined, none landed) — may still be running, or a
notification was lost across a context clear. Do not assume failure;
just re-check.

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
  updated for the new endpoint/mock (screens.test.tsx fix was
  unrelated fallout of removing hardcoded copy, now fixed).
- Verified: server/mobile/core `tsc --noEmit` all clean; server vitest
  43/43, core vitest 95/95, mobile jest 26/26, all green; grep confirms
  zero residual `SAM_UNIT_ID`/`SAM_PACK.unit.`/`SCENARIO_TITLE`/
  `SCENARIO_SETUP`.

## EXACT NEXT STEP
1. Check for the 3 background Phase 4 validator agents' results (they
   were dispatched via the Agent tool: architect, security-reviewer,
   code-reviewer, each reviewing `git diff` on sessions.ts/api.ts/
   index.tsx/api.test.ts/screens.test.tsx + fold.ts/router.ts/
   fold.test.ts). Wait for task-notification; do NOT call `TaskOutput`
   (dumps full transcript, blows context). If uncertain whether
   dispatched agents are even still alive, it's fine to just re-dispatch
   the same 3 reviews fresh rather than guessing at stale state.
2. If all 3 approve: Phase 5 — delete `.omc/state/{autopilot,ralph,
   ultrawork,ultraqa}-state.json`, run `/oh-my-claudecode:cancel`.
3. If any reject: fix specific file:line issues, re-run affected test
   suite, re-dispatch only the rejecting reviewer(s) (max 3 rounds).

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
