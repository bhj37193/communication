# Primer: Charisma Trainer -> 5-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19._

## STATUS
Working tree clean, all committed (latest: "Ground remaining 4 skills'
design claims in research corpus").

## COMPLETED THIS SESSION
Ran the research-grounding citation pass on the 4 skills that still
lacked one (Communication, Problem-Solving, Critical Thinking,
Decision-Making) in CONTENT-ROADMAP-4-SKILLS.md, matching the pattern
already used for Behavior Science: each got a "Research grounding"
subsection citing named papers from research/literature/*.json against
its own §1.x design claims, per RESEARCH-METHODOLOGY.md §4 (named source
+ access date, 2026-07-19). Citation counts verified against source JSON
(python json.load) before writing, not eyeballed. Key picks: Communication
= West/Huston 2025 + Yip & Fisher 2022 + Cheng & Wang 2024 + honest
caution Andalibi 2020; Problem-Solving = Heppner & Witty 2004 +
Stanisławski 2019 + Schulz & Meyer 2018, with an honest caution that the
corpus is thin on human-subjects interpersonal-coaching research and
Unit B's isolate-the-variable mechanic is designed, not sourced;
Critical Thinking = Dawes et al. 2005 Sicily Statement + Deeks & Dinnes
2003 + Redaelli & Biller-Andorno 2025 + honest caution Markman &
McMullen 2003; Decision-Making = Loewenstein & Thaler 1989 + Sahu &
Padhy 2020 + Klinger 2013 + honest caution Kahan 2013. All 5 skills'
roadmap sections are now grounded. Committed as one commit.

Note: a concurrent session (not this one) had already drafted
legal/privacy-policy.html and cross-referenced it into
apps/mobile/app-store-listing.md item 3 during this same calendar day;
that work is separately committed and already reflected as done.

## EXACT NEXT STEP
Nothing in flight; ask the user what to work on next. Two live threads:
(1) Behavior Science implementation in code (packages/core/schemas.ts,
validator.ts, score.ts) is spec'd/grounded but NOT started, for any of
the 5 skills — the natural next build step once picked up. (2) App-store
items 1 (name), 2 (icon/screenshots), 4 (Apple Developer enrollment) are
still user-blocked; item 3 (privacy policy) is drafted, needs hosting
(GitHub Pages/Cloudflare Pages, no VPS) and the URL filled in.

## LOCKED DECISIONS (do not re-litigate)
5-skill taxonomy (Communication, Problem-Solving, Critical Thinking,
Decision-Making, Behavior Science - all 5 as transcript-scorable drills).
Non-AI drill self-attested pass; 8 drill reps + 1 AI capstone/stage;
expert anchors credibility-only; no pricing content in curriculum; engine
extends never redesigns; connection/clarity north stars parallel. Full
scenario-unit serve-path scope over drill-only slice; spec/plan Non-goals
are locked cuts; `prd.md` obsolete, PRD-CHARISMA-CHAT.md is source of
truth.

## OUTSTANDING OPS
App-store tasks #1-4 user-blocked (see EXACT NEXT STEP); privacy policy
drafted but unhosted. FABLE-PROMPT-PROVEN-PROGRESS.md deferred,
unrelated.

## DOC REFS
PRD-CHARISMA-CHAT.md | .omc/plans/autopilot-impl.md | apps/server/src/
routes/sessions.ts | apps/server/src/services/{fold,router,profile,
caps}.ts | apps/mobile/app/index.tsx | apps/mobile/lib/api.ts |
CONTENT-ROADMAP-4-SKILLS.md | RESEARCH-METHODOLOGY.md |
research/fetch_literature.py | research/README.md | legal/privacy-policy.html
