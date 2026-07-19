# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
`CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md` is complete and fully approved
(all 5 sections final, Sec 3's 12 anchors user-approved). Communication
now has two independent, parallel north stars in the engine: connection
(locked, untouched) and clarity (new, engine-only). Core+server
`tsc --noEmit` clean, 95 core tests pass. No serve path exists yet for
ANY unit type in this phase-0 app (no unit-serving route, no
mastery-fold write from `progress_events` into `user_skill_state`, no
mobile screen reads unit fields).

## COMPLETED THIS SESSION
- Sec 4 engine (prior work): `DrillSchema`, `unit_type` discriminator on
  `UnitSchema`, `DrillUnitSchema`, `AnyUnitSchema` union.
- Clarity north star, parallel dimension (user-confirmed: parallel
  schema, deterministic proxies, new scenario family): `ExplainUnitSchema`
  + `ClaritySignalsSchema` (schemas.ts); `computeClaritySignals` /
  `claritySignalValue` / `passesClarity` (validator.ts); `clarityScore`
  (score.ts); new `content-library/constraints/clarity-northstar.md`;
  pointer updates in `content-library/README.md` + curriculum doc.
  Fixed a substring-matching bug in filler/hedge counting (word-boundary
  regex now, was false-firing 'er'/'um' inside ordinary words).
  Zero edits to `connection-northstar.md`, `ReasonCodeSchema`,
  `SignalsSchema`, `computeSignals`, `score()`.
- Gave user a full status readout of the curriculum doc vs. engine state
  (no code changed this turn).

## EXACT NEXT STEP
User must decide before any serve-path code is written: (a) build the
scenario-unit serve path first, drill/explain units ride along, or (b)
scope a narrow drill-only path (e.g. attestation endpoint appending to
`progress_events` only). Not started either way. Parked, still open.
Separately: curriculum doc is final and ready to author real
content-library files from (drills, expert-anchor material) whenever
user wants to start, independent of the serve-path decision.

## LOCKED DECISIONS (do not re-litigate)
- 4-skill taxonomy final: Communication, Problem-Solving, Critical
  Thinking, Decision-Making (CONTENT-ROADMAP-4-SKILLS.md).
- Non-AI drill: self-attested pass, existing mastery gate unchanged.
- Per stage: 8 drill reps then one AI capstone; split is emergent.
- Expert anchors credibility-directional only, never primary content;
  hard corroboration rule (2+ independent public sources).
- No business-model/pricing content in curriculum docs; all-ages
  deferred. Engine/schemas: extend, never redesign.
- Communication's two north stars (connection, clarity) are parallel and
  independent; clarity must never touch connection's locked code path.

## OUTSTANDING OPS
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md still deferred, unrelated.

## DOC REFS
CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md | CONTENT-ROADMAP-4-SKILLS.md |
packages/core/{schemas,validator,score}.ts |
content-library/constraints/{connection,clarity}-northstar.md
