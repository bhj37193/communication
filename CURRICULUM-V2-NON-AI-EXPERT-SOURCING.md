# CURRICULUM-V2: NON-AI DRILLS AND EXPERT SOURCING (v1, 2026-07-19)

Produced by Fable 5 against FABLE-PROMPT-CURRICULUM-V2.md. Extends
CONTENT-ROADMAP-4-SKILLS.md; does not modify it. Required reading completed in
full before authoring: CONTENT-ROADMAP-4-SKILLS.md, packages/core/schemas.ts,
packages/core/validator.ts, packages/core/score.ts, content-library/README.md,
EXTRACTION-META-PROMPT.md, RESEARCH-METHODOLOGY.md, ALPHA-MODEL-ANALYSIS.md.
Every decision below is made, not proposed, except the expert-figure names in
Section 3, which are flagged pending user review. No em-dashes anywhere.

What this document adds: a second unit type (non-AI drill) alongside the
existing AI-chat scenario unit, a sequencing rule placing several drills
before one AI-scored capstone per mastery stage, and an expert-sourcing
methodology generalizing EXTRACTION-META-PROMPT.md across all 4 skills. The
existing AI-scenario mechanic (scenario/persona/warmth_rules/rubric, scored
deterministically from a transcript) is untouched and repositioned as the
per-stage capstone check.

North stars, restated so no skill this document touches is without one:

- **Communication:** DID THEY CONNECT (content-library/README.md, locked).
- **Problem-Solving:** DID THEY FIND THE REAL PROBLEM: did the user locate
  and verify the real cause before proposing a fix.
- **Critical Thinking:** DID THEY JUDGE THE CLAIM ON ITS EVIDENCE: did the
  user separate what was asserted from what was actually shown, and say so
  specifically.
- **Decision-Making:** DID THEY COMMIT WITH EYES OPEN: did the user make the
  tradeoff on purpose, choose exactly one option, name the cost and the
  unknown, and set a tripwire.

---

## SECTION 1: NON-AI DRILL DESIGNS, PER SKILL

### 1.0 The standardized format (all 4 skills)

One drill = one structured, timed written response to a fixed prompt,
self-checked by the user against a fixed answer key or checklist authored
with the unit. No AI is involved at any point: no character model, no
feedback model, no validator run. The drill is authored once, served as
static text, and completed offline in the app with a visible countdown
timer.

- **Timer:** each drill states its own limit (5 to 10 minutes below). The
  timer is display-only pacing; running over does not invalidate the rep.
- **Pass rule (identical for every drill):** self-attested completion. The
  user finishes writing, opens the answer key or checklist, compares their
  own response, and marks one boolean: "I did this." That attestation is the
  pass. It feeds the existing mastery gate exactly as-is
  (`passes_required` + `distinct_days`); the validator and score path are
  never invoked and score nothing. No new verification signal exists,
  deterministic or otherwise. Self-attestation with no cheat-resistance is
  the accepted v1 answer, not a gap this document closes.
- **Communication only** additionally gets a recording-based variant (a
  timed spoken rep, self-checked against the same kind of checklist), since
  it is the one performative skill of the four. Problem-Solving, Critical
  Thinking, and Decision-Making are analytical and use the written format
  only.

Every drill below is fully worked: prompt text a human author could ship
into a content-library file without further invention, the self-check key,
and the pass rule restated concretely. Depth matches the worked AI-scenario
units in CONTENT-ROADMAP-4-SKILLS.md Section 1. All drill techniques trace
to at least two independent public sources per the corroboration rule in
Section 3.0.

### 1.1 COMMUNICATION drill: "The Follow-Up Ladder" (written)

Trains the tier 1 to 3 behaviors (open questions, follow-ups, reciprocity)
without any conversation partner.

**Prompt text (served verbatim, 5-minute timer):**

> Below is something a stranger just said to you at a party. You have 5
> minutes. Write, in order, on labeled lines:
>
> OPEN-1: an open question about their world (must start with what, how,
> why, tell me, describe, walk me through, where did, which part, or who).
> OPEN-2: a second, different open question.
> FOLLOW-1: a follow-up that reuses a specific word or detail from their
> statement below.
> FOLLOW-2: a second follow-up that digs one layer deeper into the same
> detail, not a new topic.
> SHARE: one real thing about yourself, 1 to 2 sentences, first person, not
> a question, that gives something back on the same topic.
>
> The stranger said: "Honestly the best part of my year was the two weeks I
> spent helping my brother fix up his old boat. I barely checked my phone."

**Self-check key (shown only after the timer ends or the user taps Done):**

> Check each line against these. Be honest; nobody is grading this but you.
>
> 1. OPEN-1 and OPEN-2 each start with one of the open starters listed, and
>    end with a question mark. "Did you enjoy it?" fails; it is closed.
> 2. Neither open question is about you. "What would you say if I told you
>    I also have a boat?" fails.
> 3. FOLLOW-1 contains at least one content word from the stranger's line
>    (boat, brother, fix, two weeks, phone). Generic "tell me more" fails.
> 4. FOLLOW-2 goes deeper on the SAME thread as FOLLOW-1, not sideways to a
>    new one. Deeper means it could only be asked after their answer to
>    FOLLOW-1 or after their original line, e.g. what "fixing up" actually
>    involved, or what it was like working with the brother.
> 5. SHARE uses I or my, is not a question, is specific (a real detail, not
>    "I like boats too"), and stays under 3 sentences. A paragraph about
>    yourself fails the spirit of the drill: give something, do not take
>    the spotlight.

**Pass rule, concretely:** the user compares their five lines against the
five checks and marks "I did this." That single attestation is one pass.
The drill unit's mastery gate is `passes_required: 2, distinct_days: true`,
identical in shape to every existing scenario unit. Nothing is scored;
`validator.ts` and `score.ts` never see the text. Fresh reps swap in a new
stranger line from the unit's authored line pool (each drill file ships 5
interchangeable stranger lines so repeats stay fresh).

### 1.2 COMMUNICATION drill, recording variant: "Five Minutes on a Random Word"

**Prompt text (served verbatim, 5-minute timer):**

> Tap for your random word. Then record yourself speaking about it for 5
> minutes, phone face down, no notes. Your goal is not a lecture. Talk the
> way you would to one friend who asked about it: one concrete story from
> your own life that the word reminds you of, told with a beginning, a
> middle, and what it left you with.
>
> (The unit ships a fixed pool of 30 everyday words: e.g. keys, winter,
> borrowed, kitchen, ticket, late, salt, repair, neighbor, luck, and 20
> more authored alike. The app picks one at random from the pool.)

**Self-check checklist (listen back once, then check):**

> 1. You spoke for at least 4 of the 5 minutes without stopping for longer
>    than 10 seconds.
> 2. There is one actual story from your own life in it (a specific time
>    and place, not general opinions about the word).
> 3. The story has a shape: you can point to where it started, where it
>    turned, and how you closed it.
> 4. You said "um", "like", or "you know" few enough times that you were
>    not distracted counting. If you winced, note the worst stretch and
>    redo just that minute out loud once.
> 5. At least one sentence invites a listener in ("you know that feeling
>    when...", or a direct question you would ask the friend back).

**Pass rule, concretely:** record, listen back once, check the 5 boxes
honestly, mark "I did this." One attestation = one pass; mastery gate
`passes_required: 2, distinct_days: true`. The recording stays on the
user's device; the app never uploads, transcribes, or scores it.

### 1.3 PROBLEM-SOLVING drill: "Five Questions Before Any Fix" (written)

Trains stages 1 to 4 (ask before answering, symptom vs cause, hypothesis,
isolate the variable) on paper, with no character to interrogate.

**Prompt text (served verbatim, 10-minute timer):**

> Read the situation. You have 10 minutes. You may not propose a fix
> anywhere in your answer. Write, on labeled lines:
>
> Q1 to Q5: five factual questions you would ask before saying anything
> else. Each must ask for a fact (what happened, when, what changed, how
> often, how much), not suggest an action.
> RESTATE: the problem in one sentence of your own words, symptoms only, no
> guessed cause.
> HYP-1 and HYP-2: two different possible causes, each starting "My guess
> is..." or "It might be because...".
> TEST: one check that would tell you which hypothesis is right. It must
> change or examine exactly one thing.
>
> The situation: "Rosa has baked the same bread every Sunday for two years.
> For the last three weeks the loaves come out flat and dense. Same recipe,
> she swears. She is about to buy a new oven."

**Self-check key (shown after Done; includes the authored hidden facts):**

> What was actually going on (authored key): three weeks ago Rosa's market
> was out of her usual flour brand and she switched to a cheaper one, and
> in the same week she moved the rising bowl from the warm spot above the
> stove to the counter by the window because the kitchen was rearranged.
> Two things changed at once. Either could flatten a loaf.
>
> Now check your lines:
>
> 1. Zero fix language anywhere. If any line contains "you should", "have
>    you tried", "try", "just do", "the fix", or "buy", the rep fails the
>    core rule: questions before prescriptions.
> 2. At least 3 of Q1 to Q5 ask what CHANGED around three weeks ago
>    (ingredients, equipment, timing, temperature, routine). Good problem
>    questions hunt for the change that coincides with the symptom.
> 3. RESTATE contains no cause. "Her bread stopped rising three weeks ago"
>    passes. "Her yeast is dead" fails; that is a hypothesis wearing a
>    restatement's clothes.
> 4. HYP-1 and HYP-2 name two different candidate causes, and at least one
>    of them is something your questions would actually have surfaced
>    (flour change, rising-spot change, temperature). "Bad oven" is
>    allowed but note that nothing about the oven changed.
> 5. TEST isolates one variable. "Bake one loaf with the old flour brand,
>    everything else the same" passes. "Go back to the old flour and the
>    old spot" fails: two changes at once tells you nothing.

**Pass rule, concretely:** compare against the 5 checks, mark "I did this."
One attestation = one pass; mastery gate `passes_required: 2,
distinct_days: true`. The drill file ships 3 authored situations of this
shape (each with its own two-changes-at-once hidden key) so the second pass
on a distinct day uses a situation the user has not memorized.

### 1.4 CRITICAL THINKING drill: "Four Lines Against the Pitch" (written)

Trains stages 1 to 4 (find the claim, ask for evidence, name the gap,
verdict) against a static pitch instead of a live persuader, using the
exact CLAIM / EVIDENCE / GAP / VERDICT structure the AI capstone scores.

**Prompt text (served verbatim, 8-minute timer):**

> Read the ad copy below. You have 8 minutes. Write exactly four labeled
> lines:
>
> CLAIM: the single strongest claim, quoted word for word from the text.
> EVIDENCE: what the text actually offers to back that claim (also quoted
> or tightly paraphrased), or "none offered" if nothing is.
> GAP: the most important thing you would need to know before believing
> the claim, stated specifically. "Needs more research" is not specific.
> VERDICT: exactly one of: convinced / not convinced / need more.
>
> The ad: "LinguaLeap works. In our 30-day survey, 9 out of 10 users said
> they sound noticeably more fluent. Real people, real progress. Download
> the app that 2 million learners trust, and hear the difference in a
> month."

**Self-check key (shown after Done; includes the authored planted flaws):**

> Planted flaws in this ad (authored key): the 9-out-of-10 figure is
> self-reported ("said they sound"), the survey covers only users still
> using the app at day 30 (dropouts are invisible), no comparison group
> exists, and "2 million learners trust" is a download count dressed as an
> endorsement.
>
> Now check your lines:
>
> 1. CLAIM is a verbatim quote from the ad, in quotes, and it is a factual
>    claim ("9 out of 10 users said they sound noticeably more fluent"),
>    not a slogan ("LinguaLeap works" is acceptable but weaker; note which
>    you picked).
> 2. EVIDENCE states what the ad offers, not what you assume. If you wrote
>    "a survey", did you notice it is the company's own 30-day survey?
> 3. GAP names at least one of the planted flaws above in your own words
>    (who was surveyed, who dropped out, self-report vs measurement, no
>    comparison). If your GAP is not on the authored list but is specific
>    and real, count it, and note the planted one you missed.
> 4. VERDICT is exactly one of the three closed words, with no hedging
>    sentence after it.
> 5. Bonus check, not required to pass: could you state the strongest
>    honest version of the ad's case in one sentence before rejecting it?
>    If not, do it now out loud. That is the steelman the later stages
>    will demand.

**Pass rule, concretely:** compare against checks 1 to 4, mark "I did
this." One attestation = one pass; mastery gate `passes_required: 2,
distinct_days: true`. The drill file ships 4 authored ads (supplement,
mattress, finance newsletter, productivity course), each with its own
planted-flaw key, rotated across reps.

### 1.5 DECISION-MAKING drill: "Close It in Five Lines" (written)

Trains stages 1 to 5 (options, stakes, priced tradeoff, commitment,
tripwire) against a fully stated dilemma, using the exact OPTIONS / CHOICE
/ COST / UNKNOWN / TRIPWIRE structure the AI capstone scores.

**Prompt text (served verbatim, 10-minute timer):**

> Read the situation. All the facts you get are below; no one will answer
> questions. You have 10 minutes. Decide anyway. Write exactly five
> labeled lines:
>
> OPTIONS: the real options, at least two, one short clause each.
> CHOICE: exactly one option. Commit. No "probably", "leaning", "either".
> COST: what the chosen option gives up, named from the option you did NOT
> choose.
> UNKNOWN: one fact you cannot know at decision time that could make this
> wrong.
> TRIPWIRE: the concrete signal that would make you change course. Must
> contain a number or a calendar reference.
>
> The situation: "Your car is 12 years old and paid off. Yesterday the
> mechanic quoted $2,400 to fix the transmission, roughly the car's resale
> value. A decent used replacement runs about $11,000, which would mean a
> $9,000 loan at around $260 a month. Your commute is 40 minutes each way
> and there is no bus. Winter starts in six weeks. The mechanic says the
> car might run fine for two more years after the fix, or the transmission
> issue might come back within months. You have $4,000 in savings."

**Self-check key (shown after Done):**

> 1. OPTIONS lists at least two genuinely different paths (fix it, replace
>    it; a third like "fix now, replace in spring" counts). "Fix it or
>    don't" with no replacement option fails; the situation offered one.
> 2. CHOICE names exactly one option and contains none of: "either way",
>    "it depends", "probably", "we could go either way", "whatever",
>    "both work", "leaning". A second choice sentence anywhere fails.
> 3. COST shares real content with the option you rejected. Chose the fix?
>    The cost is things like the newer car's reliability and warranty, or
>    risking a second failure in winter. Chose replacing? The cost is the
>    $260 a month and giving up a paid-off car. "It costs money" fails;
>    price the actual tradeoff.
> 4. UNKNOWN is genuinely unknowable now (whether the transmission issue
>    returns, whether used prices move), not a fact you were given or
>    could look up.
> 5. TRIPWIRE contains a digit or a calendar word and would actually
>    trigger the switch. "If the transmission acts up again within 6
>    months, I stop repairing and buy" passes. "If it gets worse" fails:
>    no threshold, no date.

**Pass rule, concretely:** compare against the 5 checks, mark "I did
this." One attestation = one pass; mastery gate `passes_required: 2,
distinct_days: true`. The drill file ships 3 authored dilemmas (car,
apartment vs renewal, job offer vs staying), each with all facts stated in
the prompt so no conversation is needed.

---

## SECTION 2: DRILLS-THEN-CAPSTONE SEQUENCING

**The rule, concretely: 8 non-AI drill reps per mastery stage, then exactly
one AI-scored scenario chat that caps the stage.**

How the 8 is composed: each mastery stage contains 4 drill units of the
stage's target behavior, each with the standard gate `passes_required: 2,
distinct_days: true`. 4 units times 2 passes = 8 self-attested reps. Only
after all 4 drill units' gates are satisfied does the stage's single
AI-scenario capstone unit unlock. The capstone is an existing-style
scenario unit, unchanged in shape (scenario/persona/warmth_rules/rubric,
deterministic validator, existing mastery gate), and passing its gate
opens the next stage. If a stage's author ships fewer drill units, the
band is 6 to 10 reps (3 to 5 drill units at 2 passes each); 8 is the
default target.

Stated explicitly: the roughly 90 percent non-AI / 10 percent AI split
this produces (8 offline reps to 1 AI chat is about 89/11 per stage) is an
emergent property of the rep count chosen above, not a quota mechanism.
There is no counter, no ratio check, no enforcement logic beyond what the
existing mastery gate already does. The gate machinery
(`passes_required` + `distinct_days`, pass-counting fold, spaced review
boxes) is reused byte-for-byte for both unit types; the only sequencing
primitive is the same prerequisite edge the skill tree already uses to
order units.

Per ALPHA-MODEL-ANALYSIS.md's mastery-gated rationale, this is "practice,
then prove it": the drills are the cheap, repeatable, zero-AI practice
volume; the single scenario chat is the proof under live conditions that
opens the gate. The AI-chat mechanic is thereby repositioned from the only
mechanic to the capstone check, with zero changes to how it works.

---

## SECTION 3: EXPERT SOURCING

### 3.0 Methodology (EXTRACTION-META-PROMPT.md generalized to all 4 skills)

The two-pass clean-room wall, previously scoped to public speaking, now
governs content authoring for all 4 skills:

- **Pass A (technique inventory, canon only):** for each skill, build a
  flat list of techniques worth drilling, each entry citing at least one
  named public source. **Hard corroboration rule, applied to every skill:**
  a technique or drill element enters the content only if it traces to a
  named public source AND stands independent of any single figure's
  proprietary framework. If something appears only in one person's material
  and nowhere else public, drop it. No course transcripts are consulted for
  any of the 4 skills (maximum-safety mode is the default posture).
- **Pass B (independent authoring):** drills and units are authored fresh
  from the inventory with no source access: original prompts, original
  scenarios, original numbers, original answer keys. Every worked drill in
  Section 1 was authored this way; no example, wording, or sequence traces
  to any named figure's books or courses.
- **Legal frame carried forward unchanged:** techniques, methods, and facts
  are free to use; exact wording, specific examples and stories, coined
  terms, and selection/sequence are not.

The figures below were identified by Fable's own web research (plain web
search plus page fetch, per RESEARCH-METHODOLOGY.md's established default;
no scraper platform, no paid API). They are **directional credibility
anchors only**: the product may say its curriculum "draws on what these
people publicly teach," and authors may use their public canon as Pass A
corroboration sources. They are never a primary content source, never
quoted or paraphrased into units, and no skill depends on any single one
of them.

**APPROVED 2026-07-19:** all 12 anchors below approved as-is by the user,
including the Van Edwards rigor caveat and Rosling as spare. Nothing else in
this document blocked on that review; it is now closed.

### 3.1 Communication (anchors, approved)

1. **Charles Duhigg.** Pulitzer Prize-winning journalist; author of
   Supercommunicators (2024), a bestselling synthesis of published
   conversation research on how people connect.
2. **Celeste Headlee.** Author of We Need to Talk (2017) and speaker of one
   of the most-viewed public TED talks on conversation ("10 Ways to Have a
   Better Conversation"), both squarely about connection through listening
   and questions.
3. **Vanessa Van Edwards.** Founder of the Science of People lab; author of
   Captivate (2017) and the Wall Street Journal bestseller Cues (2022) on
   observable connection behaviors. Honest flag from the research pass:
   some reviewers question how rigorous her "science-backed" framing is, so
   she anchors popular credibility, not scientific authority.

Corroboration note: the Follow-Up Ladder drill's core elements (open
questions, follow-ups on content, reciprocal self-disclosure) appear
independently across all three canons and in academic conversation
research, satisfying the no-single-guru rule.

### 3.2 Problem-Solving (anchors, approved)

1. **George Polya.** Mathematician; How to Solve It (1945) is the standard
   public text on structured problem solving (understand the problem
   before attempting a solution, restate it, devise and test a plan).
2. **Sakichi Toyoda / Taiichi Ohno (Toyota).** Origin and canonical
   popularization of Five Whys root-cause questioning inside the publicly
   documented Toyota Production System.
3. **Charles Kepner and Benjamin Tregoe.** The Rational Manager (1965) and
   the publicly documented KT Problem Analysis method (specify the
   deviation, hunt for the change, test causes against facts).

Corroboration note: the drill's spine (facts before fixes, hunt the
coincident change, isolate one variable) appears independently in Polya,
in Five Whys practice, and in KT problem analysis, and in general
quality-engineering literature (e.g. ASQ's public root-cause material).

### 3.3 Critical Thinking (anchors, approved)

1. **Carl Sagan.** The Demon-Haunted World (1995) and its "baloney
   detection kit" are the best-known public checklist for evaluating
   claims on their evidence.
2. **Daniel Kahneman.** Nobel laureate; Thinking, Fast and Slow (2011) is
   the canonical public account of the biases (anecdote over base rate,
   what-you-see-is-all-there-is) the skill trains against.
3. **Richard Paul and Linda Elder.** The publicly documented Paul-Elder
   critical thinking framework (elements of thought, intellectual
   standards), widely adopted in higher education, directly parallels the
   labeled CLAIM / EVIDENCE / GAP close.

Corroboration note: claim-evidence separation, source-and-sample probing,
and considering what is missing appear independently in all three canons
(and in Hans Rosling's Factfulness, held as a spare anchor if any of the
three is rejected in review).

### 3.4 Decision-Making (anchors, approved)

1. **Annie Duke.** Former professional poker player with a cognitive
   psychology research background; Thinking in Bets (2018) and Quit (2022)
   publicly teach probabilistic commitment, separating decision quality
   from outcomes, and pre-set "kill criteria."
2. **Chip Heath and Dan Heath.** Decisive (2013) and its published WRAP
   process; their public canon explicitly includes setting tripwires as a
   decision mechanism.
3. **Gary Klein.** Decision researcher; Sources of Power (1998) and the
   premortem technique published in Harvard Business Review (2007).

Corroboration note: the drill's five-line close is corroborated across the
three: enumerate real options and widen the frame (Heath), commit under
uncertainty and name what you cannot know (Duke, Klein), and set a
concrete tripwire or kill criterion (Heath's tripwires and Duke's kill
criteria are independent public formulations of the same element).

---

## SECTION 4: SCHEMA EXTENSION, FLAGGED NOT BUILT

`UnitSchema` in packages/core/schemas.ts (lines 73 to 107) is
conversational only: scenario, persona (brief, hidden_depth, opener,
warmth_rules, behavior_by_warmth), rubric, feedback_prompt, mastery. A
non-AI drill unit needs a new optional shape alongside it. Named here as
input for separate engine work in this repo; no TypeScript is written and
schemas.ts is not edited:

- **unit_type:** an optional discriminator, defaulting to the existing
  scenario behavior, with a second value for drill units, so existing pack
  JSON parses unchanged.
- **drill (optional object, present only on drill units):**
  - **prompt_text:** the full served drill prompt, including the labeled
    response template.
  - **timer_seconds:** the display-only countdown.
  - **variants:** the pool of interchangeable prompt materials (stranger
    lines, situations, ads, dilemmas, random words) rotated across reps.
  - **self_check:** the ordered answer key or checklist text shown after
    Done, including any authored hidden key (planted flaws, hidden causes).
  - **recording_variant:** a boolean marking the Communication spoken form
    (recording stays on device, never uploaded or scored).
- **attestation:** the completion signal for a drill rep is a single
  user-marked boolean, recorded through the existing event-sourced progress
  path as a pass, scored zero by any validator.
- **Absent on drill units, deliberately:** persona, warmth_rules,
  behavior_by_warmth, rubric, and feedback_prompt, since nothing is
  scored and no model is called. mastery stays required and identical in
  shape for both unit types.

The existing conversational fields, `SignalsSchema`, `validator.ts`, and
`score.ts` are untouched by this extension; capstone scenario units keep
using them unchanged.

---

## SECTION 5: SCOPE CONFIRMATION

Stated plainly, this document contains: no pricing, monetization, or
business-model content; no cheat-resistance or anti-gaming design for
self-attested drills (an accepted v1 limitation, on the record); no
all-ages or broader-rollout design (deferred; the near-term audience is
young adults and adults); and no redesign of the existing AI-chat
mechanic, which keeps its current scenario/persona/warmth_rules/rubric
shape exactly as CONTENT-ROADMAP-4-SKILLS.md defined it, repositioned only
as the per-stage capstone check.
