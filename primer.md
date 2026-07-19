# Primer: Charisma Trainer -> 5-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19._

## STATUS
Working tree DIRTY: `apps/mobile/app-store-listing.md` (modified, not yet
committed), `legal/` (new dir, untracked) -- both from a prior concurrent
session, not this one. This session's edit, the 4-skill grounding-citation
pass on `CONTENT-ROADMAP-4-SKILLS.md`, is also NOT YET COMMITTED (verify
with `git status` before assuming a checkpoint caught it).

## COMPLETED THIS SESSION
Ran the same research-grounding citation pass (that Behavior Science
already had) on the other 4 skills in `CONTENT-ROADMAP-4-SKILLS.md`, each
citing its own topic's JSON in `research/literature/` against its own
§1.x design claims, per RESEARCH-METHODOLOGY.md §4 (named source + access
date, access date 2026-07-19 throughout):
- §1.1 Communication: West/Huston 2025 (listening -> social connection,
  grounds the north star + followups/open_questions), Yip & Fisher 2022
  (listening as separable trainable behavior), Cheng & Wang 2024
  (self-disclosure turn-taking grounds reciprocity), honest caution
  Andalibi 2020 (forcing stigmatized disclosure backfires -- why hidden
  depth reveals in layers, not on direct ask).
- §1.2 Problem-Solving: Heppner & Witty 2004 (problem-solving appraisal as
  a measured construct), Stanisławski 2019 Coping Circumplex (grounds the
  premature_fix hard-fail as the avoidant-coping pattern), Schulz & Meyer
  2018 (diagnostic reasoning's separable epistemic steps). Honest caution
  recorded: corpus is thin on human-subjects interpersonal-coaching
  research, and Unit B's isolate-the-variable mechanic has no direct
  source -- flagged as designed-not-sourced rather than papered over.
- §1.3 Critical Thinking: Dawes et al. 2005 Sicily Statement (grounds the
  CLAIM/EVIDENCE/GAP/VERDICT format as compressed EBP steps), Deeks &
  Dinnes 2003 (bias-in-evidence methodology grounds gap_named/
  base_rate_probe), Redaelli & Biller-Andorno 2025 (critical-thinking
  skill empirically predicts real-world misinformation discernment).
  Honest caution: Markman & McMullen 2003 (people default to the easier
  experiential comparison mode -- why steelman_present is a hard gate).
- §1.4 Decision-Making: Loewenstein & Thaler 1989 Anomalies (implicit
  costs get mispriced -- grounds tradeoff_priced as a hard gate), Sahu &
  Padhy 2020 Behavioral Reasoning Theory (named reasons-for/against
  grounds OPTIONS/COST as separate lines), Klinger 2013 (goal commitment
  is a real cognitive state-change -- grounds choice_committed/waffle).
  Honest caution: Kahan 2013 (confident decisiveness is often motivated
  reasoning, not correctness -- why unknown_named/tripwire_set are
  separate hard gates from choice_committed, not folded into it).
All citation counts verified against the source JSON files directly
(python json.load, not eyeballed) before writing. This closes the
"other 4 skills need grounding too" item noted in the prior primer.

## EXACT NEXT STEP
Nothing in flight. Recommend: commit this session's
CONTENT-ROADMAP-4-SKILLS.md changes (and decide separately whether to
also commit the pre-existing app-store-listing.md / legal/ changes from
the prior session, or leave those for that thread). After that: Behavior
Science implementation in code (packages/core/schemas.ts, validator.ts,
score.ts) is spec'd/grounded but NOT started for any of the 5 skills --
the natural next build step. App-store items 1 (name), 2 (icon/
screenshots), 4 (Apple Developer enrollment) are still user-blocked; item
3 (privacy policy) is drafted, needs hosting + URL filled in. Ask the user
which to pick up.

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
