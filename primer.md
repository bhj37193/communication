# Primer: Charisma Trainer -> 5-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19._

## STATUS
Working tree clean, all committed and pushed to origin/main.

## COMPLETED THIS SESSION
Hosted the drafted privacy policy: moved `legal/privacy-policy.html` ->
`docs/index.html` (single source, no duplication). GitHub Pages needs a
paid plan for private repos, so per user's explicit choice
`bhj37193/communication` was made **public** and Pages enabled (source:
main /docs). Verified live at `https://bhj37193.github.io/communication/`
(200, correct content). Filled the real URL into
`apps/mobile/app-store-listing.md` (blocker item 3 now done).

Also (concurrent prior session, already on disk): added §2.3 "0-10
mastery-level display" to CONTENT-ROADMAP-4-SKILLS.md — per-skill,
computed at read time from existing Unit.mastery pass-counting, zero
schema/validator/score.ts changes; 1-6 maps to authored stages, 7-10 is
declared headroom (no content yet, UI shows "6/10, more coming").

## EXACT NEXT STEP
Nothing in flight; ask the user what to work on next. Live thread:
all-5-skills implementation in code (packages/core/schemas.ts,
validator.ts, score.ts) is spec'd/grounded but NOT started, and would also
need the new §2.3 mastery_level read-time function. App-store items 1
(name), 2 (icon/screenshots), 4 (Apple Developer enrollment) remain
user-blocked.

## LOCKED DECISIONS (do not re-litigate)
5-skill taxonomy (Communication, Problem-Solving, Critical Thinking,
Decision-Making, Behavior Science — all 5 as transcript-scorable drills).
Non-AI drill self-attested pass; 8 drill reps + 1 AI capstone/stage;
expert anchors credibility-only; no pricing content in curriculum; engine
extends never redesigns; connection/clarity north stars parallel. Full
scenario-unit serve-path scope over drill-only slice; spec/plan Non-goals
are locked cuts; `prd.md` obsolete, PRD-CHARISMA-CHAT.md is source of
truth. mastery_level (§2.3) is per-skill 0-10, computed not stored, caps
at 6 until stage 7+ content exists.

## OUTSTANDING OPS
App-store tasks #1, #2, #4 user-blocked; #3 (privacy policy) done. Repo
`bhj37193/communication` is now PUBLIC (was private; changed to enable
GitHub Pages, user confirmed). FABLE-PROMPT-PROVEN-PROGRESS.md deferred,
unrelated.

## DOC REFS
PRD-CHARISMA-CHAT.md | CONTENT-ROADMAP-4-SKILLS.md §2.3 |
ALPHA-MODEL-ANALYSIS.md | packages/core/schemas.ts | apps/server/src/
routes/sessions.ts | apps/server/src/services/{fold,router,profile,
caps}.ts | apps/mobile/app/index.tsx | RESEARCH-METHODOLOGY.md |
docs/index.html (privacy policy, live at
https://bhj37193.github.io/communication/)
