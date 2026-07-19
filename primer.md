# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.

## STATUS
FABLE-PROMPT-EMPIRE.md Parts 1 AND 2 are DONE (written by two parallel Fable
sessions; this file merges both). Part 1: FINANCIAL-MODEL-20YR.md written and
verified (zero em-dashes, all numbers tie to a simulation). Part 2:
CONTENT-ROADMAP-4-SKILLS.md written and verified (zero em-dashes). Part 3
(RESEARCH-METHODOLOGY.md) has NOT been run. No open autonomous work. Last
updated 2026-07-19 at context-limit checkpoint of the Part 1 session.

## COMPLETED: PART 1 (financial model session)
- Locked inputs read: PRD-CHARISMA-CHAT.md, AVATAR-TIER-PRICING.md,
  BUSINESS-MODEL-CONVERSION.md.
- 240-month simulation (session scratchpad model.py), 20 named assumptions per
  scenario; doc has assumption tables, bear/conservative/realistic y1-5 +
  milestone y10/15/20 rows, year-3 worked arithmetic chain, sanity checks.
- Results: realistic = breakeven y2, cash-positive y4, y20 ~104k payers / $14.8M
  rev / $2.8M after-tax, peak funding need ~$130k. Conservative = permanent
  near-breakeven at ~$1.8M rev. Bear = never viable, rational shutdown mo 18-24.
- Conflict resolved: PRD's $9.99 text sub dropped; BUSINESS-MODEL-CONVERSION.md
  (newer, decided) wins: text free, avatar-only paywall $14.99/mo, $119/yr.
- Biggest sensitivity: monthly churn (5% -> 7% turns realistic into conservative).

## COMPLETED: PART 2 (content roadmap session, merged from its primer)
- Final taxonomy: Communication / Problem-Solving / Critical Thinking (RENAMED
  from "Cognitive [training]", flagged and justified) / Decision-Making, with all
  pairwise separations + per-skill deterministic-scorability checks.
- Per skill: entry point, 6 mastery tiers with pass gates, north star, 2 worked
  author-layer units each (8 total). CT and DM use structured labeled-line closes
  (CLAIM/EVIDENCE/GAP/VERDICT; OPTIONS/CHOICE/COST/UNKNOWN/TRIPWIRE).
- Engine reuse: additive-only exports (per-skill Signals schemas, UnitSchema
  extensions, validator-{problem,critical,decision}.ts, new weight sets beside
  untouched score()). No LLM in any score path.

## EXACT NEXT STEP
None autonomous. If user says go: run Part 3 (RESEARCH-METHODOLOGY.md) per
HOW-TO-RUN-FABLE.md section 5c, then do the post-run reconciliation note in
section 5 (incl. reconciling Part 1's taxonomy naming vs Part 2's rename).

## LOCKED DECISIONS
- Repurpose current app/folder, no new app.
- Keep existing engine (mastery gating, deterministic validator/score,
  event-sourced progress) shared across all 4 subjects; do not redesign
  schemas.ts/score.ts/validator.ts contracts.
- Pricing anchors: $14.99/mo avatar, 120-min cap, $119/yr, ~$0.03/min COGS,
  15-min trial at ~$0.45, Paddle ~5%+$0.50, ~4% refund reserve.

## OUTSTANDING FROM PRIOR THREAD (unchanged)
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) still user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md (HOW-TO-RUN-FABLE.md section 4) queued, not run.
- 4-skill taxonomy: Part 2 renamed one skill; user has not confirmed final names.

## DOC REFS
FINANCIAL-MODEL-20YR.md (new) | CONTENT-ROADMAP-4-SKILLS.md (new) |
FABLE-PROMPT-EMPIRE.md | HOW-TO-RUN-FABLE.md | POSITIONING.md |
PRD-CHARISMA-CHAT.md | ALPHA-MODEL-ANALYSIS.md | BUSINESS-MODEL-CONVERSION.md |
AVATAR-TIER-PRICING.md | content-library/README.md + CONTEXT.md |
packages/core/{schemas,validator,score}.ts
