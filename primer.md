# Primer: Charisma Trainer -> pivoting to 4-skill Alpha-School-style platform. Name TBD.

## STATUS
Empire pivot prompt is DONE and delivered to user this session. Waiting on user to
(a) confirm or rename the 4-skill taxonomy and (b) decide whether to run the 3
Fable sessions, since this is a scope-expanding pivot away from current
single-skill positioning. No open autonomous work remains.

## COMPLETED THIS SESSION
- Local grounding read: POSITIONING.md, PRD-CHARISMA-CHAT.md, content-library/
  README.md, ALPHA-MODEL-ANALYSIS.md, BUSINESS-MODEL-CONVERSION.md,
  AVATAR-TIER-PRICING.md.
- Alpha School research agent completed (tuition $10k-75k/yr, 13 campuses,
  $2-5.5k/pupil licensing to "2 Hour Learning," no disclosed funding/valuation,
  charter rejections in PA/NC/AR/UT citing "untested," no independent peer-reviewed
  validation, Ackman endorsement but no disclosed investment figure). Flagged and
  ignored an unrelated prompt-injection attempt embedded in one fetched page.
- advisor() consulted before drafting: confirmed 3-part self-contained structure,
  required the financial model to force explicit named assumptions + shown
  arithmetic per scenario, required the content roadmap to open by
  defining/differentiating the 4 skills (they overlap as named), flagged that this
  pivot contradicts POSITIONING.md's "hold the charisma identity tightly year one"
  rule.
- Wrote FABLE-PROMPT-EMPIRE.md (3 self-contained parts: financial model, content
  roadmap, research methodology, each writing its own output .md) and appended
  section 5 to HOW-TO-RUN-FABLE.md with paste-ready run blocks for all 3 parallel
  sessions plus a post-run reconciliation note. Both flags relayed to user in chat.

## EXACT NEXT STEP
None autonomous. If user says go: paste HOW-TO-RUN-FABLE.md section 5a/5b/5c into 3
Fable sessions. If user wants to rename the 4 skills or scope this down, edit
FABLE-PROMPT-EMPIRE.md's shared-context block and Part 0/1 first.

## LOCKED DECISIONS
- Repurpose current app/folder, no new app.
- Keep existing engine (mastery gating, deterministic validator/score,
  event-sourced progress) shared across all 4 subjects; do not redesign
  schemas.ts/score.ts/validator.ts contracts.

## OUTSTANDING FROM PRIOR THREAD (unchanged)
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) still user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md (HOW-TO-RUN-FABLE.md section 4) queued, not run.

## DOC REFS
FABLE-PROMPT-EMPIRE.md | HOW-TO-RUN-FABLE.md | POSITIONING.md | PRD-CHARISMA-CHAT.md
| ALPHA-MODEL-ANALYSIS.md | BUSINESS-MODEL-CONVERSION.md | AVATAR-TIER-PRICING.md |
FABLE-PROMPT-PROVEN-PROGRESS.md | content-library/README.md + CONTEXT.md |
packages/core/{schemas,validator,score}.ts.
