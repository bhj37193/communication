# Primer: Charisma Trainer -> pivoting to 4-skill Alpha-School-style platform. Name TBD.

## STATUS
Mid-pivot. User wants to expand from communication-only app to training FOUR skills
on the same app/folder (no new app): Communication, Problem-Solving, Cognitive,
Decision-Making (assumption stated to user, NOT yet confirmed by them). Modeled on
Alpha School (2-hour mastery-gated adaptive learning) but for adults, app-only, no
physical school. Deliverable: a 3-part Fable driver prompt (one input doc, three
independently runnable sections so they can be pasted into 3 parallel Fable sessions
without interfering) producing THREE separate output .md files:
  1. Business model + 20-year financial projection: monthly/yearly profit, cost,
     margin, AFTER-TAX profit, user count + monthly price, in one table with bear /
     conservative / realistic cases.
  2. Content roadmap for the 4 subjects: zero-knowledge-to-mastery curriculum
     direction per subject, using only this app.
  3. Research methodology: what's the best API/data source for Fable to do this
     research, and whether a scraper platform (Apify) is needed.
User explicitly asked to use the `advisor` tool (opus-backed) to synthesize/critique
the prompt before finalizing it.

## COMPLETED THIS SESSION
- Read local grounding: POSITIONING.md, PRD-CHARISMA-CHAT.md, content-library/
  README.md, ALPHA-MODEL-ANALYSIS.md (prior work already scoped Alpha mechanics to
  communication sub-domains only, sales+public-speaking -- this pivot goes wider than
  that doc's scope), BUSINESS-MODEL-CONVERSION.md, AVATAR-TIER-PRICING.md (existing
  pricing/cost numbers: text free, avatar $14.99/mo capped, Haiku ~$0.02/challenge).
- Launched a background research agent on Alpha School's actual business model,
  scale, pedagogy mechanics, funding, and public non-K12 expansion signals (agent id
  a1b4b5844cc722e50, still running -- check for its completion notification first on
  resume, do not re-launch).

## EXACT NEXT STEP
1. On resume, wait for/check the Alpha School research agent's result (do not
   poll -- notification arrives automatically; if session shows it already
   completed, read its output).
2. Call `advisor()` with: the user's full 4-skill pivot ask, the Alpha School
   research, and the local context above, to pressure-test scope + structure the
   3-part prompt, BEFORE drafting.
3. Draft one new FABLE-PROMPT md (e.g. FABLE-PROMPT-EMPIRE.md) with 3 sections per
   above, each telling Fable to write its own output file (e.g.
   FINANCIAL-MODEL-20YR.md, CONTENT-ROADMAP-4-SKILLS.md, RESEARCH-METHODOLOGY.md).
4. Append a new numbered section to HOW-TO-RUN-FABLE.md (match existing style)
   documenting how to run the 3 in parallel.
5. Flag the "4 skills" naming assumption to the user explicitly before/when
   presenting the prompt, since it drives the whole financial model + curriculum.

## LOCKED DECISIONS (new, this pivot)
- Repurpose the CURRENT folder/app; do not build a new app.
- Keep existing engine (mastery gating, deterministic validator/score, event-sourced
  progress) as the shared engine across all 4 subjects, per ALPHA-MODEL-ANALYSIS.md's
  "one engine, many skill packs" model -- do not redesign schemas.ts/score.ts/
  validator.ts contracts to do this (same hard-contracts rule as prior thread).

## OUTSTANDING FROM PRIOR THREAD (unchanged, still true)
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk accounts) still
  user-blocked, nothing autonomously actionable there.
- FABLE-PROMPT-PROVEN-PROGRESS.md (checkpoint/validity-layer prompt) was ready to
  run per HOW-TO-RUN-FABLE.md section 4 but NOT yet run -- still queued, now
  secondary to this bigger pivot.

## DOC REFS
POSITIONING.md | PRD-CHARISMA-CHAT.md | ALPHA-MODEL-ANALYSIS.md |
BUSINESS-MODEL-CONVERSION.md | AVATAR-TIER-PRICING.md | HOW-TO-RUN-FABLE.md |
FABLE-PROMPT-PROVEN-PROGRESS.md | content-library/README.md + CONTEXT.md |
packages/core/{schemas,validator,score}.ts.
