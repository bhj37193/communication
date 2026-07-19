# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19._

## STATUS
FABLE-PROMPT-CURRICULUM-V2.md was executed. Deliverable written:
`CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md` (repo root, zero em-dashes,
verified against .omc/specs/deep-interview-curriculum-sourcing-ai-
minimization.md acceptance criteria). **Done.** No production code
changed. Ralplan/consensus thread is superseded and closed.

## COMPLETED
`CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md` contains:
- Sec 1: worked non-AI drills per skill (timed written response +
  self-check key, self-attested pass via passes_required +
  distinct_days): Communication "Follow-Up Ladder" + recording variant;
  Problem-Solving "Five Questions Before Any Fix"; Critical Thinking
  "Four Lines Against the Pitch"; Decision-Making "Close It in Five
  Lines".
- Sec 2: 8 drill reps per stage then ONE AI-scored capstone; ~89/11
  split stated as emergent, no quota mechanism.
- Sec 3: clean-room two-pass wall + hard corroboration rule generalized
  to all 4 skills; 3 proposed anchors per skill (PENDING USER REVIEW):
  Comm: Duhigg, Headlee, Van Edwards; PS: Polya, Toyoda/Ohno,
  Kepner-Tregoe; CT: Sagan, Kahneman, Paul & Elder; DM: Duke, Heath
  brothers, Klein.
- Sec 4: UnitSchema extension FLAGGED not built (unit_type
  discriminator, drill{prompt_text,timer_seconds,variants,self_check,
  recording_variant}, attestation boolean).
- Sec 5: scope confirmed (no pricing, no cheat-resistance, no all-ages,
  no AI-chat redesign).

## EXACT NEXT STEP
1. User reviews/approves the 12 proposed anchor figures in Sec 3 of
   CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md (only open item on that doc).
2. Then start flagged engine work: extend packages/core/schemas.ts
   UnitSchema per Sec 4 (additive, base schema untouched), plus serve
   path for drill units. Not yet started.

## LOCKED DECISIONS (do not re-litigate)
- 4-skill taxonomy final: Communication, Problem-Solving, Critical
  Thinking, Decision-Making (CONTENT-ROADMAP-4-SKILLS.md).
- Non-AI drill: self-attested pass, existing mastery gate unchanged.
- Per stage: 8 drill reps then one AI capstone; split is emergent.
- Expert anchors are credibility-directional only, never primary
  content; hard corroboration rule (2+ independent public sources).
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
