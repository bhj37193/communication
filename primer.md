# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0+1 done (plan APPROVED). Phase 2 (Steps 1-7 of
`.omc/plans/autopilot-impl.md`) DONE and verified this session. Phase 4
(multi-perspective validation): architect APPROVE (confirmed twice),
security-reviewer APPROVE Risk-LOW (confirmed twice). code-reviewer
(agent id `ac9a7eb575e9ea495`) has completed its review per its own
status but has not yet stated an explicit verdict in any message
received — nudged twice via SendMessage asking for a one-line
APPROVE/REJECT + issue list; response not yet landed.

## COMPLETED THIS SESSION
- `apps/server/src/services/fold.ts`/`fold.test.ts`, `router.ts`: done,
  verified (Wave A).
- `apps/server/src/routes/sessions.ts`: generalized off DB-loaded unit
  spec via `loadUnitSpec`/`routeNextUnit`; `SAM_UNIT_ID` import dropped,
  `SAM_PACK` kept only for `.signals`; fold writer wired in `/end`; new
  `GET /v1/challenge/today` (explicit field allowlist, excludes opener).
- `apps/mobile/lib/api.ts` + `app/index.tsx`: `getChallenge()` added,
  hardcoded `SCENARIO_TITLE`/`SCENARIO_SETUP` removed, screen fetches
  copy on mount.
- `apps/mobile/test/api.test.ts` + `test/screens.test.tsx`: updated for
  the new endpoint/mock.
- Verified (already done, do not re-run unless a validator flags a
  regression): server/mobile/core `tsc --noEmit` all clean; server
  vitest 43/43, core vitest 95/95, mobile jest 26/26 all green; grep
  confirms zero residual `SAM_UNIT_ID`/`SAM_PACK.unit.`/
  `SCENARIO_TITLE`/`SCENARIO_SETUP`.

## EXACT NEXT STEP
1. Wait for/collect code-reviewer's (agent id `ac9a7eb575e9ea495`)
   explicit verdict. Do NOT call `TaskOutput` on it (dumps full
   transcript, blows context). If no real verdict lands after 1-2 more
   checks, it is reasonable to dispatch one fresh code-reviewer agent
   against the same diff rather than waiting indefinitely (2/3
   reviewers have already given clean APPROVE, so this is the last
   blocker to Phase 5).
2. On all-3 APPROVE: Phase 5 — delete `.omc/state/{autopilot,ralph,
   ultrawork,ultraqa}-state.json`, run `/oh-my-claudecode:cancel`.
3. If code-reviewer (or a fresh redispatch) rejects: fix the specific
   file:line issues, re-run affected test suite, re-validate only that
   reviewer (max 3 rounds per autopilot policy).

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
