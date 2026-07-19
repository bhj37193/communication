# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0 done. Phase 1 (planning) in progress: architect agent
`phase1-planner` dispatched in background, not yet returned. A fallback
wakeup is scheduled (~15:45); its own completion notification is the
primary wake signal. No code written yet.

## COMPLETED THIS SESSION
- Phase 0 spec written: `.omc/autopilot/spec.md`. Covers 3 deliverables:
  (1) `routeNextUnit` service + `GET /v1/challenge/today` (PRD INV-7:
  never a list/catalog endpoint) + generalizing `POST /v1/sessions` off
  a DB-loaded unit spec instead of the hardcoded `SAM_PACK` import
  (byte-identical regression bar for the single seeded unit); (2)
  mastery-fold service `foldProgress` (pure function; `progress_events`
  enum verified byte-for-byte against migrations/0000_init.sql:56-59;
  mastery block is `passes_required:2, distinct_days:true`, unreachable
  end-to-end in one day — must be tested as pure fn with synthetic
  events, user-tz dates via `caps.ts`'s pattern); (3) mobile `index.tsx`
  fetching `GET /v1/challenge/today` instead of hardcoded copy. Non-goals:
  no review mechanics, no real drill/explain serving, no
  `SkillPackSchema` widening, no content loader.
- Dispatched `oh-my-claudecode:architect` (agent `phase1-planner`, opus,
  background) to write `.omc/plans/autopilot-impl.md`. Not yet returned.
- Resolved: `prd.md` is a superseded older draft ("Cadence", voice-first
  LiveKit/Deepgram/FastAPI). PRD-CHARISMA-CHAT.md:3 supersedes it. Ignore
  prd.md going forward.
- Located the exact regression suite for spec.md's byte-identical bar:
  `apps/server/test/integration/loop.test.ts` ("the loop proof" — runs
  full session flows, asserts exact deterministic scores) and
  `apps/server/src/routes/sessions.caps.test.ts`. Full test-file list
  under apps/server + packages/core: app.test.ts, AuthVerifier.test.ts,
  AnthropicChatModel.test.ts, retention.test.ts, sessions.caps.test.ts,
  analytics.test.ts, caps.test.ts, events.test.ts, loop.test.ts,
  schemas/score/validator/assemble.test.ts (packages/core).

## EXACT NEXT STEP
Wait for `phase1-planner` completion notification (do not poll/resume
manually). Once `.omc/plans/autopilot-impl.md` exists, ensure its plan
names `loop.test.ts` + `sessions.caps.test.ts` explicitly as the
regression gate, then run `oh-my-claudecode:critic` to validate, then
Phase 2 (execution), Phase 3 (QA: those tests must pass unmodified),
Phase 4 (validation: architect + security-reviewer + code-reviewer),
Phase 5 (cleanup + `/oh-my-claudecode:cancel`).

## LOCKED DECISIONS (do not re-litigate)
- 4-skill taxonomy final; non-AI drill self-attested pass; 8 drill reps
  + 1 AI capstone per stage; expert anchors credibility-only w/
  corroboration rule; no pricing content in curriculum docs; engine
  extends, never redesigns; connection/clarity north stars parallel,
  clarity never touches connection's locked code path.
- Full scenario-unit serve-path scope chosen (2026-07-19) over narrow
  drill-only slice. Spec.md Non-goals are locked scope cuts.
- `prd.md` obsolete; PRD-CHARISMA-CHAT.md is sole authoritative spec.

## OUTSTANDING OPS
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md still deferred, unrelated.

## DOC REFS
PRD-CHARISMA-CHAT.md (§3.2, §3.7/INV-7, §4, §4.7, §5) |
.omc/autopilot/spec.md | .omc/plans/autopilot-impl.md (pending) |
apps/server/test/integration/loop.test.ts |
apps/server/src/routes/{sessions,sessions.caps.test}.ts |
apps/server/src/db/{schema,seed}.ts |
apps/server/src/db/migrations/0000_init.sql |
apps/server/src/services/{profile,caps}.ts | apps/server/src/content.ts |
packages/core/schemas.ts | apps/mobile/app/index.tsx | apps/mobile/lib/api.ts
