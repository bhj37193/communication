# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.

## STATUS
FABLE-PROMPT-EMPIRE.md Parts 1, 2, AND 3 are ALL DONE. Part 1:
FINANCIAL-MODEL-20YR.md written and verified (zero em-dashes, all numbers tie
to a simulation). Part 2: CONTENT-ROADMAP-4-SKILLS.md written and verified
(zero em-dashes). Part 3: RESEARCH-METHODOLOGY.md written and verified (zero
em-dashes, 1858 words), run via an Agent with model="fable". Post-run
reconciliation (below) done. No open autonomous work. Last updated 2026-07-19.

## RECONCILIATION (Part 1 vs Part 2, done since no Fable session saw both)
- **Naming drift, real, unfixed:** FINANCIAL-MODEL-20YR.md line 4 still names
  the fourth skill "Cognitive Training" (the working-assumption name). Part 2
  explicitly rejected that name (brain-training category fails string-scoring
  and carries FTC/Lumosity-precedent risk) and renamed it "Critical Thinking,"
  stating the rename applies even for marketing. Part 1 ran in parallel and
  never saw that rename. This is label-only: Part 1's dollar figures are
  skill-agnostic aggregates (SKILL_ROLLOUT never names which skill ships which
  year), so no number is wrong, just the doc's own intro line is now stale
  against Part 2's decision. Left unedited pending the naming call below.
- **Build-cost blind spot, not a contradiction, but unmodeled:** Part 1's
  SKILL_ROLLOUT assumption (Section 2.3) is "year 1 ships Communication plus
  one new skill, year 2 adds the third, year 3 completes all four," uniform
  cost/pace regardless of which skill. Part 2's Section 3 build order
  (Communication -> Problem-Solving -> Decision-Making -> Critical Thinking)
  explicitly flags Critical Thinking as the highest implementation risk (new
  structured-close UX, most homework-like). The two are not contradictory
  (CT landing last, in year 3, is consistent with it being hardest), but
  neither doc actually checked whether a 3-year all-in build cadence holds up
  once CT's extra engineering effort is priced in. No engineering-time
  estimate exists anywhere in this repo yet; flagging as a gap, not fixing it
  here since it would require new estimation, not just cross-referencing.

## OPEN DECISION FOR THE USER (do not resolve autonomously)
Final skill names are still unconfirmed. Part 2 proposes: Communication /
Problem-Solving / Critical Thinking (renamed from "Cognitive [training]") /
Decision-Making. If confirmed, the one-line fix in FINANCIAL-MODEL-20YR.md
(line 4, "Cognitive Training" -> "Critical Thinking") should be made to match.

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
None autonomous. Waiting on the user to confirm final skill names (see OPEN
DECISION above). Once confirmed, apply the one-line "Cognitive Training" ->
final-name fix in FINANCIAL-MODEL-20YR.md line 4. All three FABLE-PROMPT-
EMPIRE.md parts are otherwise complete; FABLE-PROMPT-PROVEN-PROGRESS.md
(HOW-TO-RUN-FABLE.md section 4) is still queued, not run.

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
