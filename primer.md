# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0+1 done, critic-equivalent validation APPROVED (done
synchronously against real source this session — seed.ts byte-
identical claim, all SAM_PACK.unit.* call sites, progress_events CHECK
constraint, UnitSchema/AnyUnitSchema split, fresh-random-user test
pattern all confirmed correct — no blockers). Phase 2 execution
started, Wave A (2 parallel executors):
- `apps/server/src/services/fold.ts` + `fold.test.ts`: **files exist on
  disk** (confirmed via `ls`, 15:39). NOT yet verified correct/passing
  — do not assume green, read + run
  `cd apps/server && npx vitest run src/services/fold.test.ts` first.
- `apps/server/src/services/router.ts`: **does NOT exist yet**
  (confirmed via `ls` — exit 1). That executor agent is still running
  or failed silently; check for its result/redispatch.

## EXACT NEXT STEP
1. Confirm fold.ts/fold.test.ts pass (`vitest run`), read fold.ts to
   sanity-check the distinct-day gate logic before trusting it.
2. Get router.ts landed (redispatch executor if needed — see prior
   dispatch prompt pattern: `routeNextUnit(deps, userId)` +
   `loadUnitSpec(deps, unitId)` in `apps/server/src/services/router.ts`,
   full spec in `.omc/plans/autopilot-impl.md` Step 2. Key constraint:
   zero `user_skill_state` rows = eligible, not locked; only one unit
   ever seeded so query `units` joined `skills`, ignore
   `user_skill_state` entirely for now).
3. Wave B (single executor, same file so must be sequential): Steps
   3+4 — generalize `apps/server/src/routes/sessions.ts` off DB-loaded
   spec + wire fold writer in `POST /v1/sessions/:id/end`, add
   `GET /v1/challenge/today` (field-allowlist, never spread spec, no
   query params per INV-7). Plan Steps 3-4 have full details.
4. Step 5: regression gate, full server+core `vitest run` unmodified
   (`loop.test.ts`, `sessions.caps.test.ts`, rest) + new `fold.test.ts`.
   Any diff = bug in new code, never edit a test.
5. Step 6: mobile (`apps/mobile/lib/api.ts` `getChallenge()`,
   `app/index.tsx` remove hardcoded copy, `test/api.test.ts` new case).
6. Step 7: final verification (typecheck all; grep confirms no
   residual `SAM_UNIT_ID`/`SAM_PACK.unit.` outside `.signals`).
7. Phase 4: parallel architect+security-reviewer+code-reviewer, all
   must approve. Phase 5: cleanup state files + `/oh-my-claudecode:cancel`.

**Process note**: do NOT call TaskOutput on background agents (its
full-transcript dump is what blew context to 74% this cycle) — use
`ls`/quick `Read`/`git status` on the actual output files instead to
check whether dispatched work landed.

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
PRD-CHARISMA-CHAT.md (§3.2, §3.7/INV-7, §4, §4.7, §5) | .omc/autopilot/
spec.md | .omc/plans/autopilot-impl.md | apps/server/test/integration/
{loop,setup}.ts | apps/server/src/routes/sessions*.ts | apps/server/src/
db/{schema,seed}.ts+migrations/0000_init.sql | apps/server/src/services/
{profile,caps,fold,router}.ts | packages/core/{schemas,fakes/
FakeChatModel}.ts | apps/mobile/app/index.tsx | lib/api.ts
