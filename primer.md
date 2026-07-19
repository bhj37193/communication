# Primer: Charisma Trainer -> 5-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19._

## STATUS
Working tree DIRTY: `apps/mobile/app-store-listing.md` (modified this
session, not yet committed), `legal/` (new dir, untracked). Everything
else is clean/committed, including the prior concurrent session's
Behavior Science grounding-citation pass on CONTENT-ROADMAP-4-SKILLS.md
(verified present on disk and already committed -- do not re-ask).

## COMPLETED THIS SESSION
Drafted `legal/privacy-policy.html`: self-contained static page (no build
step, dark-mode aware), content pulled from the already-audited data table
in `apps/mobile/app-store-listing.md` (data collected, 60-day transcript
auto-delete, immediate full delete on account deletion, no tracking/no
third-party analytics, children's privacy). Has a TODO placeholder for a
real support email and a note to replace the working app name once final.
Cross-referenced it from `apps/mobile/app-store-listing.md` (both the
Privacy Policy URL line and the numbered blocker list) so it's no longer
a bare TODO -- item 3 of the app-store blockers is now "deploy this file
and fill in the URL," not "write the page."

## EXACT NEXT STEP
Nothing in flight. App-store items 1 (name), 2 (real icon/screenshots),
4 (Apple Developer Program enrollment) are still genuinely user-blocked.
Item 3 (privacy policy) is drafted but needs a host (GitHub Pages /
Cloudflare Pages both work, no VPS required) and the resulting URL filled
into `apps/mobile/app-store-listing.md`. Ask the user what to work on next.

## LOCKED DECISIONS (do not re-litigate)
5-skill taxonomy (Communication, Problem-Solving, Critical Thinking,
Decision-Making, Behavior Science -- all 5 as transcript-scorable drills;
Behavior Science added + grounded with citations by a prior concurrent
session, verified real). Non-AI drill self-attested pass; 8 drill reps +
1 AI capstone/stage; expert anchors credibility-only; no pricing content
in curriculum; engine extends never redesigns; connection/clarity north
stars parallel. Full scenario-unit serve-path scope over drill-only slice;
spec/plan Non-goals are locked cuts; `prd.md` obsolete,
PRD-CHARISMA-CHAT.md is source of truth.

## OUTSTANDING OPS
App-store tasks: #1 name, #2 artwork, #4 Apple Developer enrollment are
user-blocked; #3 privacy policy is drafted, needs hosting + URL.
Behavior Science grounding-citation pass exists only for §1.5; the other
4 skills (Communication, Problem-Solving, Critical Thinking,
Decision-Making) don't yet have research citations against their §1.x
design claims -- offer, don't start unprompted. Behavior Science
implementation in code (packages/core/schemas.ts, validator.ts, score.ts)
is spec'd/grounded but NOT started. FABLE-PROMPT-PROVEN-PROGRESS.md
deferred, unrelated.

⚠ CONCURRENCY: this repo has had multiple autopilot sessions racing on
this exact primer.md same-day. If more than one Claude Code tab is open
on this project, `/clear` the extras to stop duplicate/conflicting work.

## DOC REFS
PRD-CHARISMA-CHAT.md | .omc/plans/autopilot-impl.md | apps/server/src/
routes/sessions.ts | apps/server/src/services/{fold,router,profile,
caps}.ts | apps/mobile/app/index.tsx | apps/mobile/lib/api.ts |
CONTENT-ROADMAP-4-SKILLS.md | RESEARCH-METHODOLOGY.md |
apps/mobile/app-store-listing.md | legal/privacy-policy.html
