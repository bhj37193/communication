# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.

## STATUS
FABLE-PROMPT-EMPIRE.md Parts 1, 2, 3 all done and reconciled. Naming decision
resolved 2026-07-19: final taxonomy is Communication / Problem-Solving /
Critical Thinking / Decision-Making. FINANCIAL-MODEL-20YR.md line 4 fixed to
match (was stale "Cognitive Training"). One new open question raised this
session (below), not yet resolved. Last updated 2026-07-19.

## COMPLETED THIS SESSION
- User confirmed final skill name "Critical Thinking" (not "Cognitive
  Training"). Fixed FINANCIAL-MODEL-20YR.md line 4; verified via grep, zero
  stale references remain, zero em-dashes introduced.
- Updated primer.md reconciliation/decision sections to reflect the fix.
- User asked whether to merge Critical Thinking into Problem-Solving (their
  reasoning: "problem solving makes you a better thinker"). Consulted Opus
  advisor. Recommendation given to user: keep the two skills structurally
  distinct (PS = diagnosing a raw situation nobody is arguing about; CT =
  resisting a persuader with a flawed claim/evidence, an "anti-con" skill PS
  doesn't cover). Merging also breaks scoring (PS uses classifier markers,
  CT requires a mandatory structured CLAIM/EVIDENCE/GAP/VERDICT close;
  merging either drops CT's scorability or leaves one skill with two
  rubrics). If the goal is less to build now, recommended **defer** CT
  (already last in build order per CONTENT-ROADMAP-4-SKILLS.md) instead of
  merging permanently.

## EXACT NEXT STEP
Waiting on user: keep 4-skill taxonomy as-is, defer CT's build (taxonomy
unchanged, just build-order emphasis), or merge CT into Problem-Solving
anyway. Do not resolve autonomously. If user picks "defer," update
CONTENT-ROADMAP-4-SKILLS.md build-order section to state CT is explicitly
deferred/optional-for-v1. If "merge," would require reworking Part 2's
pairwise-separation section and Part 1's skill count/cost assumptions
(non-trivial, flag for its own session).

## LOCKED DECISIONS
- Repurpose current app/folder, no new app.
- Keep existing engine (mastery gating, deterministic validator/score,
  event-sourced progress) shared across all subjects; do not redesign
  schemas.ts/score.ts/validator.ts contracts.
- Pricing anchors: $14.99/mo avatar, 120-min cap, $119/yr, ~$0.03/min COGS,
  15-min trial at ~$0.45, Paddle ~5%+$0.50, ~4% refund reserve.
- Final skill taxonomy: Communication / Problem-Solving / Critical Thinking /
  Decision-Making (Critical Thinking name confirmed 2026-07-19).

## OUTSTANDING OPS
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) still user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md (HOW-TO-RUN-FABLE.md section 4) queued,
  not run; confirm with user before running.
- CT merge/defer/keep decision above, unresolved.

## DOC REFS
FINANCIAL-MODEL-20YR.md | CONTENT-ROADMAP-4-SKILLS.md | FABLE-PROMPT-EMPIRE.md
| HOW-TO-RUN-FABLE.md | POSITIONING.md | PRD-CHARISMA-CHAT.md |
ALPHA-MODEL-ANALYSIS.md | BUSINESS-MODEL-CONVERSION.md | AVATAR-TIER-PRICING.md
| content-library/README.md + CONTEXT.md | packages/core/{schemas,validator,score}.ts
