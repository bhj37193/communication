# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.

## STATUS
2026-07-19: Full vision given (democratize top-class education in 4 locked
skills, Alpha School model, no teachers/school, AI-minimized). Ran
/deep-interview -> spec PASSED (17% ambiguity). Handed to /plan
--consensus --direct (RALPLAN-DR); that consensus loop's state was lost to
session "checkpoint before clear" resets (`.omc/state/ralplan-state.json`
and the Planner's output both confirmed absent on disk, not just missing
from context). Rather than re-chase the flaky multi-agent loop, wrote the
FABLE-PROMPT deliverable directly from the locked spec + existing house
style (FABLE-PROMPT-EMPIRE.md / EXTRACTION-META-PROMPT.md conventions).
**Done.** No production code changed this session; only .omc/specs/, this
primer, and the new FABLE-PROMPT-CURRICULUM-V2.md touched.

## COMPLETED THIS SESSION
- `.omc/specs/deep-interview-curriculum-sourcing-ai-minimization.md`:
  locked spec (non-AI drill unit type, expert-sourcing methodology,
  drills-then-capstone sequencing).
- `FABLE-PROMPT-CURRICULUM-V2.md` (repo root): the paste-ready Fable
  prompt implementing that spec. Covers per-skill non-AI drill designs,
  drills-then-capstone sequencing, expert-sourcing methodology
  generalizing EXTRACTION-META-PROMPT.md's two-pass clean-room pattern
  across all 4 skills, a flagged (not implemented) UnitSchema extension,
  and explicit scope confirmation (no pricing/business-model/all-ages
  content).

## EXACT NEXT STEP
Paste `FABLE-PROMPT-CURRICULUM-V2.md` into a fresh Fable session. It will
write `CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md` as output. Once that
lands: (1) user reviews the 1-3 proposed expert-sourcing figures per
skill (prompt does not block on this), (2) the schema-extension it flags
(new optional non-AI drill fields on `packages/core/schemas.ts`
`UnitSchema`) becomes real follow-up engine work, not yet started.

## LOCKED DECISIONS (carry forward, do not re-litigate)
- 4-skill taxonomy final: Communication, Problem-Solving, Critical
  Thinking, Decision-Making (CONTENT-ROADMAP-4-SKILLS.md).
- Non-AI drill: self-attested pass, reuses existing mastery gate
  (`passes_required` + `distinct_days`) unchanged.
- Drill format: structured timed written response + self-check key,
  standardized across all 4 skills; Communication also gets a recording
  variant (5-min speech, random-word prompt).
- Per mastery stage: several non-AI drills, then ONE AI-scored scenario
  capstone before the gate opens (~90/10 split is emergent, not a quota).
- Expert sourcing: Fable researches (web search, no scraper/API),
  proposes 1-3 named public figures per skill as credibility anchors
  only; content itself stays canon-based/clean-room. No single-guru
  dependency.
- No business-model content in the FABLE-PROMPT; no all-ages design
  (deferred); no cheat-resistance for self-attested drills (v1 accepted).
- Prior locks: repurpose existing app, keep engine/schemas as locked
  contracts (extend never redesign), pricing anchors from
  AVATAR-TIER-PRICING.md.

## OUTSTANDING OPS
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) still
  user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md still deferred, unrelated to this
  thread.

## DOC REFS
.omc/specs/deep-interview-curriculum-sourcing-ai-minimization.md |
FABLE-PROMPT-CURRICULUM-V2.md | CONTENT-ROADMAP-4-SKILLS.md |
EXTRACTION-META-PROMPT.md | RESEARCH-METHODOLOGY.md |
ALPHA-MODEL-ANALYSIS.md | packages/core/{schemas,validator,score}.ts
