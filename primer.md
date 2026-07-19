# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 0 done. Phase 1 (planning) in progress: architect agent
dispatched, not yet returned. No code written yet.

## COMPLETED THIS SESSION
- Phase 0 spec written: `.omc/autopilot/spec.md`. Covers 3 deliverables:
  (1) `routeNextUnit` service + `GET /v1/challenge/today` (PRD INV-7:
  never a list/catalog endpoint) + generalizing `POST /v1/sessions` off
  a DB-loaded unit spec instead of the hardcoded `SAM_PACK` import
  (byte-identical regression bar for the single seeded unit); (2)
  mastery-fold service `foldProgress` (pure function; `progress_events`
  enum verified byte-for-byte against migrations/0000_init.sql:56-59;
  mastery block is `passes_required:2, distinct_days:true` so it CANNOT
  be reached end-to-end in one day — must be tested as pure fn with
  synthetic events, user-tz dates via `caps.ts`'s pattern, not UTC); (3)
  mobile `index.tsx` fetching `GET /v1/challenge/today` instead of
  hardcoded copy. Explicit Non-goals in spec.md: no review mechanics, no
  real drill/explain serving, no `SkillPackSchema` widening, no content
  loader.
- Dispatched `oh-my-claudecode:architect` (agent name `phase1-planner`,
  opus, background) to turn spec.md into `.omc/plans/autopilot-impl.md`.
  Result not yet received — awaiting completion notification.

## EXACT NEXT STEP
Check for `phase1-planner` agent's completion notification (SendMessage
to resume it if needed, agent name `phase1-planner`). Once
`.omc/plans/autopilot-impl.md` exists, run `oh-my-claudecode:critic` to
validate the plan, then start Phase 2 (execution via executor agents),
Phase 3 (QA cycles: existing server/core tests must pass unmodified —
this is spec.md's regression bar), Phase 4 (validation: architect +
security-reviewer + code-reviewer), Phase 5 (cleanup + `/cancel`).

## LOCKED DECISIONS (do not re-litigate)
- 4-skill taxonomy final; non-AI drill self-attested pass; 8 drill reps
  + 1 AI capstone per stage; expert anchors credibility-only w/
  corroboration rule; no pricing content in curriculum docs; engine
  extends, never redesigns; connection/clarity north stars parallel,
  clarity never touches connection's locked code path.
- Full scenario-unit serve-path scope chosen (2026-07-19) over narrow
  drill-only slice. Spec.md Non-goals (above) are locked scope cuts.

## OUTSTANDING OPS
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md still deferred, unrelated.
- Open question: unread `prd.md` at repo root, relation to
  PRD-CHARISMA-CHAT.md unknown (dup/draft/other?). Not used for spec.md.

## DOC REFS
PRD-CHARISMA-CHAT.md (authoritative: §3.2, §3.7/INV-7, §4, §4.7, §5) |
.omc/autopilot/spec.md | .omc/plans/autopilot-impl.md (pending) |
apps/server/src/routes/sessions.ts | apps/server/src/db/{schema,seed}.ts |
apps/server/src/db/migrations/0000_init.sql |
apps/server/src/services/{profile,caps}.ts | apps/server/src/content.ts |
packages/core/schemas.ts | apps/mobile/app/index.tsx | apps/mobile/lib/api.ts
