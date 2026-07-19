# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.

## STATUS
FABLE-PROMPT-EMPIRE.md Part 2 is DONE: CONTENT-ROADMAP-4-SKILLS.md written and
verified (zero em-dashes). Parts 1 (FINANCIAL-MODEL-20YR.md) and 3
(RESEARCH-METHODOLOGY.md) have NOT been run. No open autonomous work.

## COMPLETED THIS SESSION
- Read all Part 2 locked inputs: PRD-CHARISMA-CHAT.md, POSITIONING.md,
  ALPHA-MODEL-ANALYSIS.md, content-library/README.md + CONTEXT.md, and locked
  contracts packages/core/{schemas,validator,score}.ts.
- Wrote CONTENT-ROADMAP-4-SKILLS.md, all Part 2 sections in full:
  - Section 0: final taxonomy Communication / Problem-Solving / Critical
    Thinking (RENAMED from "Cognitive [training]", flagged, justified: brain
    training not string-scorable, weak transfer evidence) / Decision-Making.
    All 6 pairwise separations + per-skill deterministic-scorability check.
  - Section 1: per skill: entry point, 6 mastery tiers with concrete pass
    gates, one-sentence north star, 2 fully worked author-layer units each
    (8 total). All skills keep the chat-with-persona unit shape (UnitSchema
    requires persona); warmth 0-3 reinterpreted per pack via persona text
    only (disclosure / candor / stakes-disclosed). CT and DM use structured
    labeled-line closes (CLAIM/EVIDENCE/GAP/VERDICT; OPTIONS/CHOICE/COST/
    UNKNOWN/TRIPWIRE) to stay machine-checkable; PS needs no format change.
  - Section 2: engine reuse vs new: additive-only exports (per-skill Signals
    schemas, UnitSchema.extend keyword blocks, validator-{problem,critical,
    decision}.ts reusing existing classifiers, PROBLEM/CRITICAL/DECISION
    _WEIGHTS + scoreX fns beside untouched score()). No LLM in any score path.
  - Section 3: build order Communication (exists) -> Problem-Solving ->
    Decision-Making -> Critical Thinking, with reasons.
  - Section 4: scope note re POSITIONING.md year-one narrow-identity trade.

## EXACT NEXT STEP
None autonomous. If user says go: run Parts 1 and 3 of FABLE-PROMPT-EMPIRE.md
(paste HOW-TO-RUN-FABLE.md section 5a/5c into separate Fable sessions), then
the post-run reconciliation note in section 5. If user renames skills, edit
CONTENT-ROADMAP-4-SKILLS.md top block + section 0.

## LOCKED DECISIONS
- Repurpose current app/folder, no new app.
- Keep existing engine shared across all 4 subjects; schemas.ts/score.ts/
  validator.ts are locked contracts, extend via new exports only.
- Roadmap decisions above (rename, structured closes, build order) are made
  per Part 2's "make every decision yourself"; user may override.

## OUTSTANDING FROM PRIOR THREADS (unchanged)
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md (HOW-TO-RUN-FABLE.md section 4) queued.

## DOC REFS
CONTENT-ROADMAP-4-SKILLS.md | FABLE-PROMPT-EMPIRE.md | HOW-TO-RUN-FABLE.md |
POSITIONING.md | PRD-CHARISMA-CHAT.md | ALPHA-MODEL-ANALYSIS.md |
BUSINESS-MODEL-CONVERSION.md | AVATAR-TIER-PRICING.md |
content-library/README.md + CONTEXT.md | packages/core/{schemas,validator,score}.ts
