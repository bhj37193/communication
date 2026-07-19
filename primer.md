# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot resumed from prior primer. User picked scope for the parked
serve-path decision: **full scenario-unit path** (unit-serving route +
mastery-fold write from `progress_events` into `user_skill_state` +
mobile screen reading unit fields), not the narrow drill-only slice.
Mid-recon (Phase 0 expansion, pre-spec). No code written yet.

## COMPLETED THIS SESSION
- User decision captured: full scenario-unit path chosen over narrow
  drill-only attestation endpoint.
- Dispatched an Explore agent (id a92f95229f122eec1) for full recon:
  packages/core exports, apps/ structure, backend routes, persistence
  layer, mobile screen structure, content-library unit instances. First
  pass completed but content wasn't relayed in full; re-sent asking it
  to repost the structured report. Second completion notification just
  arrived, not yet read.
- Own direct greps/reads confirmed (trust this, don't re-derive):
  - `apps/server/src/db/schema.ts` already defines `progressEvents`
    (append-only, line 53), `userSkillState` (fold table, line 61), and
    `units` (id/skillId/spec jsonb, line 47). Schema pre-provisioned,
    unused by any service.
  - No writer exists for either table anywhere in apps/server/src.
    `userSkillState` is only ever *read* (services/profile.ts:39-41, to
    list mastered skillIds). `progressEvents` has zero references
    outside schema.ts.
  - `apps/server/src/content.ts` loads exactly one hardcoded pack
    (`SAM_PACK`/`SAM_UNIT_ID`) via `UnitSchema` (not the newer
    `AnyUnitSchema`/`unit_type` union) at import time. No generic
    multi-unit serve path exists.
  - `apps/server/src/routes/` only has `me.ts`, `sessions.ts`,
    `webhooks.ts` — sessions.ts drives the connection-scenario chat
    flow, nothing unit-type-generic.
  - Confirms prior primer claim ("no serve path for any unit type").

## EXACT NEXT STEP
Read the recon agent's reposted report (output file path:
/private/tmp/claude-501/-Users-main-Desktop-Active-Projects-communication/c920db20-5f83-45b2-a3be-a44fa6a69921/tasks/a92f95229f122eec1.output
— do NOT cat/Read this JSONL directly, resume via SendMessage or check
notification text). Need: mobile app screen/nav structure + data-fetch
pattern, content-library unit-instance files, exact packages/core
exported names (AnyUnitSchema/DrillUnitSchema/ExplainUnitSchema/
computeSignals/computeClaritySignals/score/clarityScore). Then run
Phase 0 (analyst+architect spec) + Phase 1 (plan) for: (1) generic
unit-serving route keyed on unit_type, (2) mastery-fold service writing
progress_events -> user_skill_state, (3) mobile screen consuming unit
fields. Then Phase 2 execution, Phase 3 QA, Phase 4 validation.

## LOCKED DECISIONS (do not re-litigate)
- 4-skill taxonomy final; non-AI drill self-attested pass; 8 drill reps
  + 1 AI capstone per stage; expert anchors credibility-only w/
  corroboration rule; no pricing content in curriculum docs; engine
  extends, never redesigns; connection/clarity north stars parallel,
  clarity never touches connection's locked code path.
- NEW: full scenario-unit serve-path scope chosen (2026-07-19) over
  narrow drill-only slice.

## OUTSTANDING OPS
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md still deferred, unrelated.

## DOC REFS
CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md | CONTENT-ROADMAP-4-SKILLS.md |
packages/core/{schemas,validator,score}.ts |
content-library/constraints/{connection,clarity}-northstar.md |
apps/server/src/db/schema.ts | apps/server/src/content.ts |
apps/server/src/routes/sessions.ts | apps/server/src/services/profile.ts
