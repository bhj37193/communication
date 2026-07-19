# Primer: Charisma Trainer -> 5-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19._

## STATUS
Working tree clean, all committed and pushed to origin/main.

## COMPLETED THIS SESSION (privacy policy hosting)
Hosted the drafted privacy policy: moved `legal/privacy-policy.html` ->
`docs/index.html` (git mv, single source of truth, no duplication).
GitHub Pages requires a paid plan for Pages on a private repo, so per
user's explicit choice the repo `bhj37193/communication` was made
**public** (user confirmed, aware source becomes visible). Enabled Pages
via `gh api POST repos/bhj37193/communication/pages` (source: main
branch, /docs path). Verified live: `https://bhj37193.github.io/communication/`
returns 200 and serves the correct content. Filled the real URL into
`apps/mobile/app-store-listing.md` (Privacy Policy URL line + blocker
list item 3, now struck through as done).

## COMPLETED PRIOR SESSION (concurrent, already on disk)
Added §2.3 "The 0-10 mastery-level display" to CONTENT-ROADMAP-4-SKILLS.md
per user request for a 0-10 mastery scale. Design: per-skill (not blended,
matching §0.2's no-merge rule), purely computed at read time from existing
Unit.mastery pass-counting, zero schema/validator/score.ts changes. Mapping:
0 = zero knowledge (no unit_state row yet); 1-6 = one level per already-
authored stage (matches locked "8 drill reps + 1 AI capstone/stage"
structure 1:1, awarded when that stage's mastery gate is satisfied); 7-10 =
declared headroom, not curriculum (no stage 7-10 exists for any skill; UI
should show "6/10, more coming" rather than inventing filler). Chose this
over redesigning content into a literal 10-stage structure to avoid
re-authoring already-grounded curriculum (engine extends never redesigns).

Also answered a conversational question (no file changes) on differentiation
vs Alpha School, sourced from ALPHA-MODEL-ANALYSIS.md: same instructional
mechanic (mastery-gated skill tree, Bloom 1968 pedagogy) applied to a
different domain (adult soft skills vs K-8 academics) and delivery (app,
no campus/human guides). Flagged that ALPHA-MODEL-ANALYSIS.md is stale on
scope (says public speaking+sales via MCP; current locked scope is the
5-skill app) but its mechanic-level analysis still holds.

## EXACT NEXT STEP
Nothing in flight; ask the user what to work on next. One live thread:
all-5-skills implementation in code (packages/core/schemas.ts,
validator.ts, score.ts) is spec'd/grounded but NOT started — the natural
next build step once picked up, would also need to implement the new
§2.3 mastery_level read-time function. App-store item 3 (privacy policy)
is now DONE (hosted + URL filled in, see COMPLETED THIS SESSION); items 1
(name), 2 (icon/screenshots), 4 (Apple Developer enrollment) remain
user-blocked.

## LOCKED DECISIONS (do not re-litigate)
5-skill taxonomy (Communication, Problem-Solving, Critical Thinking,
Decision-Making, Behavior Science - all 5 as transcript-scorable drills).
Non-AI drill self-attested pass; 8 drill reps + 1 AI capstone/stage;
expert anchors credibility-only; no pricing content in curriculum; engine
extends never redesigns; connection/clarity north stars parallel. Full
scenario-unit serve-path scope over drill-only slice; spec/plan Non-goals
are locked cuts; `prd.md` obsolete, PRD-CHARISMA-CHAT.md is source of
truth. New: mastery_level (§2.3) is per-skill 0-10, computed not stored,
caps at 6 until stage 7+ content exists.

## OUTSTANDING OPS
App-store tasks #1, #2, #4 user-blocked (see EXACT NEXT STEP); #3 (privacy
policy) done. Repo `bhj37193/communication` is now PUBLIC (was private;
changed to enable GitHub Pages, user confirmed). FABLE-PROMPT-PROVEN-
PROGRESS.md deferred, unrelated.

## DOC REFS
PRD-CHARISMA-CHAT.md | CONTENT-ROADMAP-4-SKILLS.md §2.3 |
ALPHA-MODEL-ANALYSIS.md | packages/core/schemas.ts | apps/server/src/
routes/sessions.ts | apps/server/src/services/{fold,router,profile,
caps}.ts | apps/mobile/app/index.tsx | RESEARCH-METHODOLOGY.md |
docs/index.html (privacy policy, live at
https://bhj37193.github.io/communication/)
