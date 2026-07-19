# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19._

## STATUS
`CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md` (repo root) is complete and
fully approved: user approved all 12 Sec 3 anchors as-is 2026-07-19, the
doc's only open item is closed. Sec 4's `UnitSchema` extension (drill
units) is implemented in `packages/core/schemas.ts`, tests added,
core+server `tsc --noEmit` clean, 72 core tests pass. Serve path for
drill units NOT built: no serve path exists yet for ANY unit type in
this phase-0 app (no unit-serving route, no mastery-fold write path from
`progress_events` into `user_skill_state`, no mobile screen reads unit
fields at all). Ralplan/consensus thread is superseded and closed.

## COMPLETED THIS SESSION
- Sec 1-3, 5 of the curriculum doc (drills, sequencing, expert anchors,
  scope) all done and approved; see doc for detail, not repeated here.
- Sec 4 engine work: `DrillSchema`, `unit_type` discriminator on
  `UnitSchema` (defaults 'scenario', existing pack JSON unchanged),
  sibling `DrillUnitSchema`, `AnyUnitSchema` union, in
  `packages/core/schemas.ts` + `schemas.test.ts`. `SkillPackSchema.units`
  left untouched (nothing loads through it yet). Attestation is a
  runtime signal, not a schema field, not built.

## EXACT NEXT STEP
User must decide before any serve-path code is written: (a) build the
scenario-unit serve path first, drill units ride along, or (b) scope a
narrow drill-only path (e.g. attestation endpoint appending to
`progress_events` only). Not started either way.

## LOCKED DECISIONS (do not re-litigate)
- 4-skill taxonomy final: Communication, Problem-Solving, Critical
  Thinking, Decision-Making (CONTENT-ROADMAP-4-SKILLS.md).
- Non-AI drill: self-attested pass, existing mastery gate unchanged.
- Per stage: 8 drill reps then one AI capstone; split is emergent.
- Expert anchors credibility-directional only, never primary content;
  hard corroboration rule (2+ independent public sources).
- No business-model/pricing content in curriculum docs; all-ages
  deferred. Engine/schemas: extend, never redesign.

## OUTSTANDING OPS
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md still deferred, unrelated.

## DOC REFS
CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md | FABLE-PROMPT-CURRICULUM-V2.md |
.omc/specs/deep-interview-curriculum-sourcing-ai-minimization.md |
CONTENT-ROADMAP-4-SKILLS.md | EXTRACTION-META-PROMPT.md |
RESEARCH-METHODOLOGY.md | packages/core/{schemas,validator,score}.ts
