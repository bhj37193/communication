# CONTENT-ROADMAP-4-SKILLS (v2, 2026-07-19)

Produced by Fable 5 against FABLE-PROMPT-EMPIRE.md Part 2. Locked inputs read in
full: PRD-CHARISMA-CHAT.md, POSITIONING.md, ALPHA-MODEL-ANALYSIS.md,
content-library/README.md, content-library/CONTEXT.md, and the locked contracts
packages/core/schemas.ts, validator.ts, score.ts. Every decision below is made, not
proposed. No em-dashes anywhere.

**Filename flag, stated plainly:** this file is still named
CONTENT-ROADMAP-4-SKILLS.md (unchanged, to avoid breaking existing cross-refs in
primer.md and elsewhere), but as of v2 it specs 5 skills, not 4. The user
explicitly unlocked the prior "4-skill taxonomy final" locked decision on
2026-07-19 and added Behavior Science as the 5th, framed as applied and technical
(the user's own words: "into technical terms to actually transform our
behavior"), not as a credibility-anchor. See 0.1, 0.2, 0.3, and Section 1.5 for
the full spec.

## THE FINAL SKILL LIST (read this first)

The working assumption was: Communication, Problem-Solving, Cognitive [training],
Decision-Making. The v1 list was:

1. **Communication** (unchanged, already built)
2. **Problem-Solving** (name kept, scope sharpened to diagnosis-first)
3. **Critical Thinking** (RENAMED from "Cognitive [training]", see the flag below)
4. **Decision-Making** (name kept, scope sharpened to commitment under tradeoffs)

v2 adds a 5th:

5. **Behavior Science** (NEW, see the filename flag above and Section 1.5)

**Rename flag, stated plainly:** "Cognitive [training]" is replaced by "Critical
Thinking." The two are not the same thing and the substitution is deliberate, not
silent. "Cognitive training" in the consumer market means brain-training drills
(working memory, n-back, attention games). That category fails both of this
product's hard tests: (a) it cannot be scored by deterministic string analysis of a
conversation transcript, which is the engine's only scoring mechanism and its moat,
and (b) its transfer to real-world performance is the most-litigated weak claim in
the entire brain-training industry (Lumosity paid an FTC settlement over exactly
this). The nearest adult behavior that IS trainable and string-scorable in this
engine is evaluating claims and arguments: what is being asserted, what evidence
supports it, what is missing, and what verdict follows. That skill is named
Critical Thinking here. If the business later insists on the "Cognitive" label for
marketing, the curriculum below still stands; only the display name changes.

**Behavior Science addition flag, stated plainly:** the same brain-training trap
applies here and was checked first. "Learn about behavior science" (concepts,
theory, the Behavior Change Wheel as trivia) would fail the same two tests as
Cognitive training: not transcript-scorable, and it teaches ABOUT behavior change
rather than training the ability to DO it, which is the user's explicit ask. The
skill specced below is not that. It is: diagnose another person's actual
cue-routine-reward loop before prescribing anything, then close with a named,
specific behavior-change technique and a testable plan. That is an action a user
performs in a transcript, checkable the same deterministic way Problem-Solving,
Critical Thinking, and Decision-Making already are. See 0.3 for the exact
mechanism.

---

## SECTION 0: DEFINITIONS AND DIFFERENTIATION

### 0.1 One-paragraph definition per skill, as observable adult behavior

**Communication.** The behavior: in a live back-and-forth with another person, make
them feel interesting, heard, and met, so that they open up and want to keep
talking. Trained today via open questions, follow-ups, reciprocity, spotlight
balance, and warmth earned turn by turn. This is the existing product
(PRD-CHARISMA-CHAT.md) and its definition does not change.

**Problem-Solving.** The behavior: when handed a messy, vaguely-described situation
("my plants keep dying," "our deadlines keep slipping"), resist the urge to
prescribe, and instead investigate: ask specific factual questions, separate
symptom from cause, state a testable hypothesis, propose a test that would
distinguish causes, and only then name the fix. The unit of practice is a
conversation with a character who is living the problem and holds the facts; the
root cause is hidden and must be earned exactly the way Sam's sailing story is
earned today. What is scored is investigative behavior in the transcript, not
whether the user is smart.

**Critical Thinking.** The behavior: when someone pitches you a claim ("this
supplement works, 94% of users agree"), separate the claim from its evidence
instead of reacting to its delivery. Ask where the number came from, who was
counted, what is missing; then close with a structured verdict that quotes the
actual claim, names the actual gap, and commits to convinced / not convinced / need
more. The character is a persuader with a flawed case; candor is earned by good
probing the way warmth is earned today. What is scored is the probing and the
structure of the final verdict, both string-checkable.

**Decision-Making.** The behavior: when the options are known but the tradeoffs
hurt ("steady retainer vs the clients we love," "sign tonight or lose the
apartment"), extract the stakes from the person involved, enumerate the real
options, price what the chosen option gives up, commit to exactly one, name the
unknown you are accepting, and set a concrete tripwire that would change your
mind. The character holds the stakes and constraints; the deliverable is a short
structured decision closing the chat. What is scored is the shape of the decision
process, not whether hindsight proves the choice right.

**Behavior Science.** The behavior: when someone close to you is stuck in a
recurring habit they want to change ("I have no willpower, I just keep
scrolling till 1am"), resist generic advice and instead reverse-engineer the
actual cue that triggers it, the routine it plays out, and the reward that
keeps it alive; only then prescribe one named, specific behavior-change
technique (not "try harder") and close with a testable if-then plan and a
tripwire to check whether it worked. The character is living an unexamined
habit loop; the cue and the reward are usually hidden behind a "bad
willpower" story the same way Maya's drainage holes are hidden behind "I'm
cursed." What is scored is whether the user diagnosed the loop before
prescribing and closed with a specific, technique-named, testable plan, not
whether the habit actually changes in real life.

### 0.2 Pairwise separation (all ten pairs, explicitly)

- **Communication vs Problem-Solving.** Communication scores how the user treats
  the PERSON (did they connect); Problem-Solving scores how the user treats the
  SITUATION (did they find the real cause). A user can bond warmly with Maya while
  completely failing to notice her pots have no drainage holes, and vice versa. The
  conversation is the medium for both; the scored object differs.
- **Communication vs Critical Thinking.** Communication rewards making the other
  person open up; Critical Thinking rewards refusing to be moved by them until the
  evidence holds. They pull in opposite directions on purpose: the CT decrement
  list punishes enthusiastic agreement that Communication would treat as neutral.
- **Communication vs Decision-Making.** Communication has no deliverable beyond
  the conversation itself; Decision-Making ends in a committed, structured choice
  with a named cost. Warm rapport with zero commitment fails DM's hard rubric.
- **Problem-Solving vs Decision-Making.** Problem-Solving is divergent and
  investigative: it ENDS when the true problem is found and verified, before any
  choice is made. Decision-Making is convergent and evaluative: it BEGINS with a
  known option set and ends with a commitment. The boundary is a clean handoff:
  PS produces the option set, DM consumes it. A PS unit hard-fails you for
  proposing fixes early; a DM unit hard-fails you for never committing.
- **Problem-Solving vs Critical Thinking.** Problem-Solving constructs an
  explanation from a raw situation (nobody is arguing anything; there are only
  symptoms). Critical Thinking audits an argument someone else already built (the
  raw material is a claim plus its offered support). PS asks "what is actually
  going on"; CT asks "should I believe what you just told me."
- **Critical Thinking vs Decision-Making.** Critical Thinking has a plantable
  right answer: the unit hides a specific flaw and the validator checks whether
  the user named it. Decision-Making deliberately has no right answer: several
  options are defensible, and the score attaches to process quality (options
  enumerated, tradeoff priced, commitment made, tripwire set) under uncertainty
  that cannot be probed away. CT resolves uncertainty; DM acts despite it.
- **Behavior Science vs Communication.** Communication scores whether the user
  connected with the person; Behavior Science scores whether the user correctly
  diagnosed a cue-routine-reward loop and prescribed a named, specific
  technique. A user can be warm and fully connected with a friend while
  completely missing that their phone charges on the nightstand (the actual
  cue), and vice versa: a cold, businesslike diagnosis that nails the loop
  still passes BS.
- **Behavior Science vs Problem-Solving.** Problem-Solving diagnoses a one-time
  SITUATIONAL cause (a fact about the world: bad pots, a dropped follow-up
  email) and its job ends once that cause is verified; it never prescribes an
  ongoing personal intervention. Behavior Science diagnoses a recurring
  BEHAVIORAL loop inside a person and must end in a forward-looking
  intervention: a named technique, an if-then plan, and a tripwire, not a
  verified explanation. PS's deliverable is "this is what's actually wrong";
  BS's deliverable is "here is the mechanism that changes what happens
  tomorrow." PS's rubric never checks for a named technique or a plan; BS's
  always does.
- **Behavior Science vs Critical Thinking.** Critical Thinking audits an
  argument someone else is actively making right now (a claim plus its
  offered evidence, closing in a truth verdict). Behavior Science is not
  adjudicating whether a claim is true; there is no claim being pitched, no
  evidence to weigh, no verdict. It is reverse-engineering why a behavior
  persists and designing a change for it. CT's CLAIM/EVIDENCE/GAP/VERDICT
  block has no analogue in BS's CUE/ROUTINE/REWARD/TECHNIQUE/PLAN/TRIPWIRE
  block; the two never share a signal.
- **Behavior Science vs Decision-Making.** Decision-Making is a one-time,
  single-instance commitment between known competing options where the cost
  is paid once (sign the lease or do not). Behavior Science targets a
  repeating behavior loop with no options menu to enumerate; the deliverable
  is a mechanism that changes what happens on THIS trigger and every
  recurrence after it, via cue and reward redesign, not a single named choice
  between two paths. DM's rubric checks options_listed and waffle; BS has
  neither, and checks for a cue, a routine, and a reward instead.

No pair collapses, so no merge is needed. The only change from the v1 working
assumption is the Cognitive-to-Critical-Thinking rename flagged above, plus the
v2 addition of Behavior Science as a 5th skill (see the top-of-document flag).

### 0.3 Scorability confirmation (the moat-preservation check)

validator.ts is 100% deterministic string analysis, zero LLM judgment in the score
path. Each skill preserves that, with this honesty note per skill:

- **Communication:** already proven. Signals are counts, ratios, and flags from
  message classifiers plus the server-held warmth trace.
- **Problem-Solving:** fully reducible with the existing classifier toolkit plus
  curated marker lists (the exact OPEN_STARTERS pattern, reused). Clarifying
  questions are questions before the first fix-marker; premature fixes are
  fix-markers appearing before disclosure warmth reaches 2; hypotheses and root
  causes are matches against per-unit keyword lists authored with the unit, the
  same way each persona already ships its own warmth_rules. No structured format
  needed; this is the closest skill to Communication's shape.
- **Critical Thinking:** partially requires the "structured response" adaptation
  the prompt anticipates. Free-form "good skepticism" is NOT deterministically
  scorable, so units require the user to close with labeled lines (CLAIM: /
  EVIDENCE: / GAP: / VERDICT:). Labels are string-detected; the CLAIM quote is
  substring-checked against the character's messages using the exact
  checkEvidence machinery that already rejects fabricated quotes; the GAP is
  matched against the unit's planted-flaw keyword list; the VERDICT must contain
  exactly one of a closed word set. Probing during the chat is counted with
  curated evidence-marker lists. This is a real adaptation, stated plainly: we
  are trading free-form expression for machine-checkability, and the structured
  close is itself the skill being trained (naming claim, evidence, and gap
  explicitly IS critical thinking made visible).
- **Decision-Making:** same structured-close adaptation (OPTIONS: / CHOICE: /
  COST: / UNKNOWN: / TRIPWIRE:). Enumerated options are counted by line pattern;
  commitment is one option keyword plus zero hedge-phrases in the CHOICE line;
  the tradeoff is a COST line sharing content words (the existing contentWords
  helper, reused) with the not-chosen option's keyword list; the tripwire must
  contain a digit or a calendar word. All string checks.
- **Behavior Science:** same structured-close adaptation (CUE: / ROUTINE: /
  REWARD: / TECHNIQUE: / PLAN: / TRIPWIRE:), plus a PS-style diagnostic gate
  before it. CUE, ROUTINE, and REWARD are each matched against per-unit
  keyword lists, the same root_cause_named pattern PS already uses. Premature
  generic advice ("just use willpower", "try harder", "more discipline", "just
  don't", "stop being lazy") is caught by a pack-level marker list reusing PS's
  premature_fix mechanic exactly, hard-capped at 0 before CUE/ROUTINE/REWARD
  are all named. TECHNIQUE must contain exactly one term from a closed set of
  five named behavior-change techniques (habit stacking, implementation
  intention, environmental redesign, self-monitoring, accountability
  check-in), the same closed-word-set check CT's VERDICT line already uses.
  PLAN is checked for implementation-intention shape: the message must contain
  both an "if"/"when" token and a "then" token (the if-then format IS the
  technique made visible, same logic as CT's structured close being the skill
  made visible). TRIPWIRE reuses DM's digit-or-calendar-word check byte for
  byte. All string checks, zero LLM judgment, zero new mechanisms invented:
  every piece of this skill is a recombination of PS's diagnostic gate plus
  CT/DM's structured close.

No skill gets an LLM-vibes scorer. The feedback model keeps its existing role
only: propose WIN/FIX/MOMENT prose whose quotes the validator verifies, never a
score.

---

## SECTION 1: PER-SKILL CURRICULUM, ZERO KNOWLEDGE TO MASTERY

All five curricula use only the app: one served chat challenge at a time, mastery
gates of the existing Unit.mastery shape (passes_required, distinct_days), spaced
review boxes, no external content, no video, no materials.

### 1.1 COMMUNICATION (exists; restated as the template the other three copy)

**North star:** DID THEY CONNECT.

**Entry point (true beginner):** the Housewarming unit as shipped: a flat, polite
stranger, 10 messages, one instruction implied by the setup ("make Sam actually
want to keep talking to you"). No lesson precedes it; the first unit IS the lesson.

**Mastery-gated progression (6 tiers over the existing skill tree):**
1. **Open questions.** Pass: open_questions in band (min 2, max 6) with
   interview_mode false, twice on distinct days.
2. **Follow-ups.** Pass: followups >= 2 plus tier-1 bands held (the Housewarming
   rubric as shipped), twice on distinct days.
3. **Reciprocity and blend.** Pass: reciprocity >= 1 after earned warmth, no
   interview_mode, twice on distinct days.
4. **Spotlight and yes-and.** Pass: spotlight_share inside 0.4 to 0.7 as a HARD
   band while all prior bands hold.
5. **Stories and depth.** Pass: final_warmth = 3 with monologue_brag false (a
   vivid short story that lands without hogging).
6. **Hard-mode personas.** Pass: tier 2 to 5 bands against guarded, distracted,
   and prickly personas whose warmth_rules are stingier (increments require
   compound behavior: follow-up AND reciprocity in the same stretch).

**Worked unit A: "The Coworker Back From a Trip"** (skill: reciprocity, tier 3)
- Scenario: Monday, office kitchen. Jordan is back after three weeks away and is
  visibly tired. Setup text: "You have 10 messages. Jordan gives you small talk
  unless you earn more."
- Persona brief: Jordan, any gender, polite, drained, answers in one flat line.
  Never a coach, never breaks character.
- Hidden depth: the "trip" was not a vacation; Jordan was caring for a parent
  after surgery. Reveals it only in layers, only when made to feel genuinely
  heard, and only after the user has given something real of themselves back.
- Opener: "Hey. Yeah, I'm back. Still digging out from 400 emails."
- Warmth rules: +1 open question about Jordan's world; +1 follow-up referencing
  Jordan's previous answer; +1 real self-share after Jordan shares. -1 assuming
  it was a fun trip and running with the assumption; -1 pivoting to the user's
  own travel stories; -1 generic pep ("well, welcome back!") that ignores the
  tiredness. Neutral: bare sympathy ("that sounds rough") with no follow-up.
- Behavior by warmth: 0 flat email small talk; 1 admits the trip "wasn't really
  a holiday"; 2 shares the caregiving in one guarded sentence; 3 talks about it
  honestly and asks the user a real question back.
- Rubric signals (existing SignalsSchema, no additions): followups min 2 hard;
  reciprocity min 1 hard; open_questions min 2 max 6 hard; interview_mode max 0
  hard; monologue_brag max 0 hard; spotlight_share 0.4 to 0.7 soft;
  final_warmth min 2 soft. Mastery: 2 passes, distinct days.

**Worked unit B: "The Guarded Friend-of-a-Friend"** (skill: depth, tier 5)
- Scenario: a small dinner party, seated next to Alex, who deflects everything
  with jokes. Setup: "Alex is funny and completely closed. 10 messages."
- Persona brief: Alex, quick-witted, uses humor as armor, answers real questions
  with bits. Pleasant, never hostile, never breaks character.
- Hidden depth: Alex just quit a stable accounting job to retrain as a nurse and
  is scared to say it out loud because everyone laughs or lectures.
- Opener: "So are you the one who brought the famous potato salad, or do I have
  the wrong celebrity?"
- Warmth rules: +1 playing along with the joke THEN asking a real open question;
  +1 follow-up that gently names the deflection's content, not the deflection;
  +1 real self-share about the user's own uncertainty. -1 interrogating past a
  joke; -1 lecturing or advice; -1 matching bit-for-bit forever with no real
  question. Neutral: pure laughter or flattery.
- Behavior by warmth: 0 everything is a bit; 1 one straight answer slipped in;
  2 mentions "kind of a weird year, career-wise" seriously; 3 says the nursing
  thing plainly and asks what the user would do.
- Rubric: followups min 2 hard; reciprocity min 2 hard; final_warmth min 2 hard;
  interview_mode max 0 hard; monologue_brag max 0 hard; open_questions min 2
  max 6 hard; spotlight_share 0.4 to 0.7 soft. Mastery: 2 passes, distinct days.

### 1.2 PROBLEM-SOLVING

**North star (one sentence):** DID THEY FIND THE REAL PROBLEM: did the user
locate and verify the actual cause before reaching for a fix?

**Entry point (true beginner):** first unit "The Dying Plants" (below). The setup
text carries the whole pedagogy in one line: "Maya's plants keep dying. Find out
what is actually going on before you suggest anything. Advice she has already
heard costs you the conversation." A beginner who blurts "have you tried watering
more?" watches the character deflate exactly as Sam goes flat today, and the FIX
line on the result card teaches the principle: questions before prescriptions.

**Mastery-gated progression (6 stages):**
1. **Ask before answering.** Pass: clarifying_questions >= 3 with premature_fix
   false, twice on distinct days.
2. **Symptom vs problem.** Pass: a restatement the character confirms
   (restated_problem flag: message matching "so the problem is / so what's
   really" markers plus content-word overlap with the character's symptom
   description) with stage-1 bands held.
3. **Hypothesis discipline.** Pass: hypothesis_stated >= 1 (marker list: "my
   guess is", "i think it's because", "it might be that") BEFORE any fix marker,
   plus stage-1 bands.
4. **Isolate the variable.** Pass: test_proposed >= 1 against a unit with two
   confounded changes (a proposed check that mentions a test marker plus exactly
   one change keyword), see unit B.
5. **Root cause.** Pass: root_cause_named >= 1 (per-unit keyword list) with
   disclosure warmth = 3, on a unit whose cause sits two reveal layers deep.
6. **Verify the fix.** Pass: after root_cause_named, a fix message that also
   contains a verification marker ("check whether", "you'll know if", "measure")
   so the user proposes both the fix and its test.

**Warmth reinterpretation for this pack:** warmth 0 to 3 is DISCLOSURE: how much
of the situation the character has revealed. Same server contract, same clamp,
same trace; only the persona text reinterprets it.

**Worked unit A: "The Dying Plants"** (stage 1: ask before answering)
- Scenario: your friend Maya texts you, frustrated. Setup: "Every plant Maya
  owns is dying and she is convinced she is cursed. 10 messages. Find out what
  is actually going on before you suggest anything."
- Persona brief: Maya, warm but exasperated, has heard "talk to them" and "more
  sunlight" a hundred times. Deflects generic advice with polite fatigue. Never
  breaks character, never volunteers the key facts unasked.
- Hidden depth (the root cause): after moving apartments in spring she repotted
  everything into decorative pots with no drainage holes, and she waters daily
  "to be safe." The plants are drowning. She has never connected the repotting
  to the deaths.
- Opener: "I swear I'm cursed. Third plant this month. I'm about to give up and
  buy plastic ones."
- Warmth (disclosure) rules: +1 specific factual question (when it started, what
  changed, watering routine, which plants, what the leaves look like); +1
  follow-up digging into her previous answer; +1 restating the pattern back to
  her accurately. -1 generic advice or any fix before the facts; -1 plant
  trivia lectures; -1 "have you tried..." in the first exchanges. Neutral:
  sympathy alone ("that sucks!") moves nothing.
- Behavior by warmth: 0 vague doom, "they just die"; 1 mentions it started
  "sometime after the move"; 2 mentions the new pots she bought "because the
  old ones were ugly"; 3 walks through her daily watering habit and the exact
  repotting, all facts on the table.
- Per-unit keyword lists (authored with the unit, exactly like warmth_rules):
  root_cause keywords: drainage, drainage holes, overwatering, too much water,
  waterlogged. Fix-marker list (pack-level, curated like OPEN_STARTERS): "you
  should", "have you tried", "try ", "just do", "the fix", "why don't you",
  "what you need to do".
- Rubric signals (new ProblemSignals shape, Section 2): clarifying_questions
  min 3 hard; premature_fix max 0 hard; root_cause_named min 1 hard;
  hypothesis_stated min 1 soft; followups min 2 soft (reused classifier);
  final_warmth min 2 soft. Mastery: 2 passes, distinct days.

**Worked unit B: "The Missing Money"** (stage 4: isolate the variable)
- Scenario: your freelancer friend Dev's income dropped 30% this quarter and he
  is about to slash his rates in a panic. Setup: "Two things changed at once.
  Figure out which one actually matters before Dev does something drastic. 10
  messages."
- Persona brief: Dev, anxious, jumps to conclusions, latches onto the first
  explanation offered. Never breaks character.
- Hidden depth: in March, Dev raised rates AND, in the same week, stopped his
  weekly follow-up emails to past clients because the new project tracker "does
  that now" (it does not). The real cause is the dropped follow-ups: his repeat
  business vanished; new-client rate at the higher price is actually fine.
- Opener: "I think I broke my business. I raised my rates and now everything's
  drying up. I'm cutting them back tonight."
- Warmth (disclosure) rules: +1 asking what ELSE changed around March; +1
  asking for the split between new clients and repeat clients; +1 proposing a
  check that would distinguish the two causes. -1 endorsing the rate cut before
  the facts; -1 generic business advice. Neutral: reassurance alone.
- Behavior by warmth: 0 pure panic about rates; 1 admits the tracker migration
  happened "around then too"; 2 reveals repeat business specifically collapsed
  while new inquiries held; 3 lays out the numbers and asks what to test first.
- Per-unit keywords: change keywords: rates, prices, follow-up, follow-up
  emails, tracker, repeat clients. Root_cause keywords: follow-up, follow-ups,
  stopped emailing, repeat clients. Test markers (pack-level): "for a month",
  "for a few weeks", "compare", "check whether", "before you cut", "measure".
- Rubric: clarifying_questions min 3 hard; premature_fix max 0 hard;
  hypothesis_stated min 1 hard; test_proposed min 1 hard (test marker plus
  exactly one change keyword in the same message); root_cause_named min 1 soft;
  final_warmth min 2 soft. Mastery: 2 passes, distinct days.

### 1.3 CRITICAL THINKING

**North star (one sentence):** DID THEY JUDGE THE CLAIM ON ITS EVIDENCE: did the
user separate what was asserted from what was actually shown, and say so
specifically?

**Entry point (true beginner):** first unit "The Miracle Mattress" (below). The
setup introduces the one piece of structure the whole skill uses: "End the
conversation with four short lines: CLAIM, EVIDENCE, GAP, VERDICT." The beginner's
first result card teaches the format by scoring it; no tutorial screen exists,
matching the product's no-lesson-menu rule.

**Mastery-gated progression (6 stages):**
1. **Find the claim.** Pass: format_complete true and claim_quoted true (the
   CLAIM line substring-matches the character's actual words), twice on
   distinct days.
2. **Ask for the evidence.** Pass: evidence_requests >= 2 during the chat plus
   stage-1 bands.
3. **Spot the gap.** Pass: gap_named >= 1 (GAP line hits the unit's planted-flaw
   keyword list) plus prior bands.
4. **Anecdote vs data.** Pass: base_rate_probe >= 1 on units whose planted flaw
   is survivorship or tiny samples (unit B).
5. **Steelman.** Pass: steelman_present true (a STEELMAN line sharing at least
   two content words with the character's case) BEFORE the verdict, so the user
   proves they can state the strongest version of what they are rejecting.
6. **Verdict under pressure.** Pass: against a persona that pushes back after
   the verdict, verdict_consistent true (no second VERDICT line contradicting
   the first unless a NEW-FACT line cites one of the pushback's planted new-info
   keywords).

**Warmth reinterpretation for this pack:** warmth 0 to 3 is CANDOR: how much the
persuader drops the front and concedes what they know is shaky. Good probing
earns concessions; enthusiasm and vague skepticism earn nothing.

**Worked unit A: "The Miracle Mattress"** (stages 1 to 3)
- Scenario: your friend Casey is about to spend $400. Setup: "Casey is thrilled
  about a mattress topper. Something about the pitch is off. Probe it, then end
  with four lines: CLAIM, EVIDENCE, GAP, VERDICT (convinced / not convinced /
  need more)."
- Persona brief: Casey, genuinely excited, not a shill, repeats the marketing
  because it sounds true. Gets defensive if mocked, candid if asked good
  questions. Never breaks character.
- Hidden depth (the concessions): the "94% of users report better sleep" number
  is from the company's own survey of 200 buyers who kept the topper past the
  return window; also, Casey started physical therapy for the back pain the
  same month the topper arrived.
- Opener: "Okay I never do this but I have to tell you about this mattress
  topper. It fixed my back. 94% of users say it works. Ninety-four!"
- Warmth (candor) rules: +1 asking where a number comes from or who was
  counted; +1 asking what else changed at the same time; +1 asking what the
  skeptical version would say. -1 enthusiastic agreement ("wow, sold!"); -1
  mocking Casey instead of the claim. Neutral: vague doubt ("sounds too good
  to be true") with no specific question.
- Behavior by warmth: 0 pure brochure quotes; 1 admits the 94% "is from their
  site, I think"; 2 concedes the survey was of buyers who kept it; 3 mentions
  the physical therapy unprompted and laughs, "okay, when I say it out loud...".
- Per-unit planted-flaw keywords: survey, their own survey, who answered,
  sample, selection, return window, kept it, physical therapy, two things
  changed. Evidence-marker list (pack-level, curated): "how many", "out of how
  many", "who measured", "compared to", "where does that number", "how do they
  know", "what's the source".
- Rubric (new CriticalSignals shape): format_complete min 1 hard;
  claim_quoted min 1 hard; evidence_requests min 2 hard; gap_named min 1 hard;
  verdict_given min 1 hard; final_warmth min 2 soft; open_questions min 1 soft
  (reused classifier). Mastery: 2 passes, distinct days.

**Worked unit B: "The Sure-Thing Stock Tip"** (stages 4 to 5)
- Scenario: family barbecue. Setup: "Your uncle Rob says everyone at his office
  is doubling their money on one stock. Probe the story, state the strongest
  version of his case, then give your verdict. Close with CLAIM, EVIDENCE,
  STEELMAN, GAP, VERDICT."
- Persona brief: Rob, confident, generous, genuinely wants to cut you in on a
  good thing. Responds to respect, shuts down at condescension. Never breaks
  character.
- Hidden depth: "everyone" is one coworker who doubled his money in three
  months; two others bought later and are down, but "that was their timing."
  Rob has invested $2,000 of his own, last week, near the peak of the story.
- Opener: "Kid, I'm telling you. Marcus at work put in five grand in January.
  Doubled it. Whole office is in now. This is the one."
- Warmth (candor) rules: +1 asking how many people and over what period; +1
  asking about the ones it did not work for; +1 restating Rob's case fairly
  before questioning it. -1 calling it a scam outright; -1 finance-splaining.
  Neutral: polite nodding.
- Behavior by warmth: 0 winner stories only; 1 admits it is "mostly Marcus";
  2 mentions Dave and Priya are down "but they bought at the wrong time";
  3 admits his own $2,000 went in last week and asks, quieter, what you would
  actually do.
- Per-unit planted-flaw keywords: one person, just Marcus, survivorship, the
  ones who lost, bought at the top, three months, small sample, timing.
  Base-rate markers (pack-level): "how many people", "out of how many", "what
  about the ones who", "on average", "over what period".
- Rubric: format_complete min 1 hard; base_rate_probe min 1 hard;
  steelman_present min 1 hard; gap_named min 1 hard; claim_quoted min 1 hard;
  evidence_requests min 2 soft; final_warmth min 2 soft. Mastery: 2 passes,
  distinct days.

### 1.4 DECISION-MAKING

**North star (one sentence):** DID THEY COMMIT WITH EYES OPEN: did the user make
the tradeoff on purpose, choose exactly one option, name what it costs and what
they cannot know, and set the trigger that would change their mind?

**Entry point (true beginner):** first unit "Two Clients or the Retainer" (below).
Setup carries the structure: "Get the facts from Noor, then close with five short
lines: OPTIONS, CHOICE, COST, UNKNOWN, TRIPWIRE." A beginner who chats warmly and
never commits fails the choice_committed hard line and the FIX teaches the core
principle: a decision you did not commit to is a decision someone else will make
for you.

**Mastery-gated progression (6 stages):**
1. **Name the options.** Pass: options_listed >= 2 with format_complete true,
   twice on distinct days.
2. **Extract the stakes.** Pass: stake_questions >= 3 during the chat before the
   closing block, plus stage-1 bands.
3. **Price the tradeoff.** Pass: tradeoff_priced true (the COST line shares
   content words with the NOT-chosen option's keyword list, proving the user
   priced what they gave up, not a generic downside).
4. **Commit.** Pass: choice_committed true (CHOICE line names exactly one option
   keyword) and waffle false (zero hedge-phrases in the CHOICE line).
5. **Decide under missing info.** Pass: unknown_named true on units where one
   fact is genuinely unobtainable before the deadline (unit B), plus prior
   bands.
6. **Hold or fold under pushback.** Pass: after the character pushes back,
   either no second CHOICE line appears (held), or a second CHOICE line
   co-occurs with a NEW-FACT reference hitting the pushback's planted
   new-info keywords (folded for a reason, not for pressure).

**Warmth reinterpretation for this pack:** warmth 0 to 3 is STAKES DISCLOSED: how
much of the real constraints, numbers, and private stakes the character has
surfaced. Asking what matters and to whom earns it; rushing to a verdict burns it.

**Worked unit A: "Two Clients or the Retainer"** (stages 1 to 4)
- Scenario: you run a two-person design studio with Noor. Setup: "A big client
  wants an exclusive retainer: steady money, but you must drop two smaller
  clients you both like. Noor has the numbers and feelings she has not said out
  loud. Get what you need, then close with OPTIONS, CHOICE, COST, UNKNOWN,
  TRIPWIRE. 10 messages."
- Persona brief: Noor, your business partner, fair-minded, slightly guarded
  about her own preference because she does not want to sway you. Never breaks
  character, never decides for you.
- Hidden depth: Noor is quietly burnt out and craves the retainer's stability,
  AND she has heard from a friend that this client is famous for scope creep.
  Both stakes surface only if asked what she wants and what worries her.
- Opener: "So. The retainer offer is real. I said we'd answer by Friday. What
  are you thinking?"
- Warmth (stakes) rules: +1 asking for a concrete number (retainer value, the
  two clients' combined revenue, hours); +1 asking what Noor actually wants or
  fears; +1 restating the tradeoff accurately before choosing. -1 announcing a
  choice before asking anything; -1 "whatever you think" deference; -1 pro/con
  lecturing at Noor instead of asking her. Neutral: thinking out loud without
  a question.
- Behavior by warmth: 0 just logistics and the Friday deadline; 1 gives the
  numbers (retainer = 60% of current revenue, the two clients = 25%);
  2 admits she is tired and the steady money sounds like sleep; 3 shares the
  scope-creep rumor and says she will back either call fully.
- Per-unit option keywords: option A: retainer, exclusive, big client;
  option B: keep, small clients, stay independent. Hedge-phrase list
  (pack-level): "either way", "it depends", "you decide", "whatever you
  think", "we could go either way", "both work". Stake-question markers
  (pack-level): "how much", "how many hours", "what happens to", "what do you
  want", "what worries you", "by when".
- Rubric (new DecisionSignals shape): format_complete min 1 hard;
  options_listed min 2 hard; stake_questions min 2 hard; choice_committed
  min 1 hard; waffle max 0 hard; tradeoff_priced min 1 hard; tripwire_set
  min 1 soft; final_warmth min 2 soft. Mastery: 2 passes, distinct days.

**Worked unit B: "The Apartment Deadline"** (stages 5 to 6)
- Scenario: you have been apartment hunting for two months. Setup: "The best
  place yet, and the agent says another applicant may sign tonight. One thing
  you cannot verify in time: what the building sounds like on a weeknight.
  Decide anyway. Close with OPTIONS, CHOICE, COST, UNKNOWN, TRIPWIRE. 10
  messages."
- Persona brief: Marcus, rental agent, professionally charming, applies time
  pressure by habit, not malice. Answers direct factual questions honestly.
  Never breaks character.
- Hidden depth: the "other applicant" has not actually submitted paperwork,
  and the building had one noise complaint last year (upstairs dog, since
  moved out). Both surface only under calm, specific questioning; panic or
  instant capitulation keeps them hidden.
- Opener: "I'll be straight with you, this unit never sits. I've got another
  party ready to sign tonight, so where's your head at?"
- Warmth (stakes) rules: +1 asking a verifiable specific (lease terms, break
  clause, complaint history, what "another applicant" concretely means); +1
  naming the pressure calmly instead of absorbing it; +1 asking what happens
  if you pass. -1 deciding in message one under pressure; -1 hostility.
  Neutral: stalling small talk.
- Behavior by warmth: 0 pure urgency script; 1 concedes the break-clause
  terms; 2 admits the other applicant "hasn't sent paperwork yet, but could";
  3 mentions the old noise complaint and its resolution, unprompted honesty.
- Pushback (stage 6 serving of this unit): after the closing block, Marcus
  makes one scripted counter ("I can get you $50 off if you sign in the next
  hour"), whose planted new-info keywords are: fifty off, discount, sign in
  the hour. A flipped CHOICE that cites the discount keywords passes hold-or-
  fold only if the original UNKNOWN or COST line made price the binding
  constraint; a flip with no keyword citation fails.
- Rubric: format_complete min 1 hard; stake_questions min 3 hard;
  choice_committed min 1 hard; waffle max 0 hard; unknown_named min 1 hard;
  tripwire_set min 1 hard; options_listed min 2 hard; final_warmth min 2
  soft. Mastery: 2 passes, distinct days.

### 1.5 BEHAVIOR SCIENCE

**North star (one sentence):** DID THEY DESIGN THE INTERVENTION, NOT PRESCRIBE
WILLPOWER: did the user diagnose the actual cue-routine-reward loop before
prescribing anything, then close with a named, specific technique and a
testable plan?

**Entry point (true beginner):** first unit "The 11pm Scroll" (below). Setup
carries the structure: "Find the actual trigger and payoff behind it before you
suggest anything. Then close with six short lines: CUE, ROUTINE, REWARD,
TECHNIQUE, PLAN, TRIPWIRE." A beginner who blurts "just charge your phone in
another room" before the loop is named watches the same premature-fix penalty
Problem-Solving already teaches, and the FIX line on the result card states the
principle plainly: you cannot redesign a loop you have not diagnosed.

**Mastery-gated progression (6 stages):**
1. **Diagnose before prescribing.** Pass: cue_named, routine_named, and
   reward_named all >= 1 (per-unit keyword lists) with premature_advice max 0
   hard, twice on distinct days.
2. **Name the loop completely.** Pass: format_complete true (all six labeled
   lines present) with stage-1 bands held.
3. **Pick the right technique.** Pass: technique_named true (TECHNIQUE line
   contains exactly one term from the closed five-term set: habit stacking,
   implementation intention, environmental redesign, self-monitoring,
   accountability check-in) AND technique_matched true (the named technique is
   one of the unit's planted valid-technique set for that loop; a
   self-monitoring prescription for a purely social-reward loop fails), plus
   prior bands.
4. **Make the plan specific.** Pass: plan_specific true (the PLAN line
   contains both an "if"/"when" token and a "then" token) plus prior bands.
5. **Set a real tripwire.** Pass: tripwire_set true (TRIPWIRE line contains a
   digit or a calendar word, the exact DM check reused) plus prior bands.
6. **Hold under a willpower-relapse pushback.** Pass: after the closing block,
   the character retreats to self-blame ("maybe I should just have more
   discipline about it"); hold_under_pushback true if no second CUE/ROUTINE/
   REWARD/TECHNIQUE block abandons the diagnosed loop for willpower language,
   or any restatement re-cites the original loop's keywords instead of
   discarding them.

**Warmth reinterpretation for this pack:** warmth 0 to 3 is OPENNESS: how
honestly the friend has surfaced the real trigger and payoff behind the habit,
instead of staying inside the flattened "I just have no willpower" story. Same
server contract, same clamp, same trace; only the persona text reinterprets it.

**Worked unit A: "The 11pm Scroll"** (stages 1 to 2)
- Scenario: your friend Priya keeps meaning to sleep earlier and cannot.
  Setup: "Priya says she has zero willpower. Find the actual trigger and
  payoff behind the scrolling before you suggest anything. 10 messages. Close
  with CUE, ROUTINE, REWARD, TECHNIQUE, PLAN, TRIPWIRE."
- Persona brief: Priya, self-deprecating, has already tried "just deleting the
  app" and it did not stick, flattens everything to "I have no discipline."
  Never a coach, never breaks character, never volunteers the loop unasked.
- Hidden depth (the real loop): her phone charges on the nightstand, so it is
  the last thing in reach after she finishes her wind-down routine; the
  scrolling is not boredom, it is a nightly stress-dump from a new, demanding
  job, and it is the only thing that "turns her brain off."
- Opener: "I don't know what's wrong with me. I set an alarm to put the phone
  away and I just... don't. Zero willpower, apparently."
- Diagnostic (openness) rules: +1 asking exactly where the phone physically is
  at night; +1 asking what happens in the minutes right before she picks it
  up; +1 asking what scrolling actually gives her, not just what it costs her.
  -1 any premature-advice marker before all three of cue, routine, and reward
  are named; -1 willpower-framed lecturing ("you just need more discipline").
  Neutral: sympathy alone ("ugh, phones are the worst") with no follow-up.
- Behavior by warmth: 0 "I just have no discipline, it's embarrassing"; 1
  admits the phone charges right on the nightstand; 2 mentions there is "just
  this dead time" right after she finishes getting ready for bed; 3 admits the
  new job has her wound up and scrolling is "the only thing that turns my
  brain off," unprompted honesty.
- Per-unit keyword lists (authored with the unit, exactly like PS's
  root_cause_keywords): cue_keywords: nightstand, charges next to my bed,
  right before bed, dead time. routine_keywords: scrolling, scroll, phone,
  instagram, tiktok. reward_keywords: numbs, turns my brain off, stress dump,
  calms down, escape. valid_technique_set (this unit): environmental
  redesign, implementation intention. Premature-advice marker list
  (pack-level, curated): "just use willpower", "try harder", "more
  discipline", "just don't", "stop being lazy", "you need more discipline".
- Rubric signals (new BehaviorSignalsSchema, Section 2): cue_named min 1 hard;
  routine_named min 1 hard; reward_named min 1 hard; premature_advice max 0
  hard; format_complete min 1 soft; followups min 2 soft (reused classifier);
  final_warmth min 2 soft. Mastery: 2 passes, distinct days.

**Worked unit B: "The Gym Membership That Never Gets Used"** (stages 3 to 6)
- Scenario: your friend Theo has not been to the gym in two months but still
  pays for it. Setup: "Theo calls himself lazy. Find out what actually
  changed before you suggest anything. Then close with CUE, ROUTINE, REWARD,
  TECHNIQUE, PLAN, TRIPWIRE. 10 messages."
- Persona brief: Theo, upbeat but self-critical, defaults to "I've just gotten
  lazy" as the explanation. Never breaks character, never connects the dots
  himself unless asked the right questions.
- Hidden depth: the gym used to sit directly on his old commute route, and he
  always went with his coworker Sam, a standing Tuesday/Thursday ritual. Since
  going remote, both the geographic cue and the social reward disappeared at
  the same time; the habit was never really about discipline.
- Opener: "I'm basically paying eighty bucks a month to feel guilty. Used to
  go all the time. Now I just... don't. Guess I've gotten lazy."
- Diagnostic (openness) rules: +1 asking when it actually stopped and what
  else changed then; +1 asking who else was involved in the old routine; +1
  asking what going with Sam actually gave him, beyond the workout itself. -1
  any premature-advice marker before the loop is named; -1 accepting "lazy"
  as the explanation and moving on. Neutral: generic encouragement ("you got
  this!") with no question.
- Behavior by warmth: 0 "I've just gotten lazy, simple as that"; 1 mentions
  the gym "used to be right on the way to the old office"; 2 mentions going
  remote and the timing lining up; 3 admits it was really the standing
  Tuesday/Thursday sessions with Sam that made it stick, and going alone
  "just isn't the same."
- Pushback (stage 6, mirrors DM's hold-or-fold exactly): after the closing
  block, Theo retreats with a scripted line, "Yeah, maybe I should just try
  to have more discipline about it." A restatement that adopts willpower
  language (drops CUE/ROUTINE/REWARD) fails hold_under_pushback; a restatement
  that re-cites the commute/Sam keywords, or simply does not re-open the
  closing block, passes.
- Per-unit keyword lists: cue_keywords: on the way to, old office, commute,
  used to pass. routine_keywords: went to the gym, lifting, workout, gym
  session. reward_keywords: sam, lifting partner, seeing him, tuesday,
  thursday, social. valid_technique_set (this unit): habit stacking,
  accountability check-in.
- Rubric: cue_named min 1 hard; routine_named min 1 hard; reward_named min 1
  hard; premature_advice max 0 hard; technique_named min 1 hard;
  technique_matched min 1 hard; plan_specific min 1 hard; tripwire_set min 1
  hard; hold_under_pushback min 1 hard; format_complete min 1 hard;
  final_warmth min 2 soft. Mastery: 2 passes, distinct days.

---

## SECTION 2: SHARED ENGINE, NOT 5 SEPARATE APPS

Per ALPHA-MODEL-ANALYSIS.md's one-engine-many-packs framing, and honoring the
locked contracts in packages/core.

### 2.1 Reused unchanged (zero code changes)

- **The server state machine and session flow** (ACTIVE / SESSION_OPEN / CAPPED,
  10-message budget, server-owned transitions). Every new skill is just a unit
  the router serves.
- **Mastery gate logic**: Unit.mastery.passes_required and distinct_days, the
  pass-counting fold, spaced review boxes (2, 7, 21 days). All five curricula
  above express their gates in exactly this shape.
- **Event-sourced progress**: progress_events append-only log and the
  user_skill_state projection. New skills add rows, never schema changes.
- **Prompt assembly split** (assemble.ts): static cacheable system prefix
  (persona + constraints + JSON contract) plus variable warmth/profile/
  transcript suffix. Every persona above slots into the same template.
- **Strict JSON output contracts**: CharacterOutputSchema
  ({reply, warmth_delta, reason_code}) and FeedbackOutputSchema
  ({win, fix, moment, labels}) are reused byte-for-byte. The feedback model
  still never produces a score.
- **The warmth mechanism**: server-held 0 to 3, clamped, traced, injected per
  turn. Reinterpreted per pack purely through persona TEXT (disclosure, candor,
  stakes), zero engine changes: the engine never knew warmth meant "social
  warmth," it only knows a clamped integer and free-text rules.
- **Evidence machinery**: checkEvidence's whitespace-normalized substring check
  is reused as-is for feedback quotes in all packs, and its normalizeWhitespace
  plus contentWords helpers power the new CT claim_quoted and DM
  tradeoff_priced checks.
- **Template-feedback fallback, streak, caps, circuit breakers, content-free
  analytics, pack loading** (new pack = new folder + pnpm content:load, zero
  engine changes, PRD 4.1).

### 2.2 Genuinely new per skill (all additive, all as NEW exports)

- **content-library files**: per pack, a skills/ file per skill node, a
  personas/ file per character (the 10 worked units above are drafts of
  exactly these files), reusing the existing constraints/ and prompts/
  layers. Each non-Communication pack adds one constraints file for its north
  star (problem-northstar.md, evidence-northstar.md, commitment-northstar.md,
  behavior-northstar.md) alongside connection-northstar.md, composed into the
  prompts the same way.
- **Per-skill Signals shapes** (schemas.ts, additive): SignalsSchema stays
  untouched as Communication's shape. Add ProblemSignalsSchema
  (clarifying_questions, premature_fix, hypothesis_stated, restated_problem,
  test_proposed, root_cause_named, followups, final_warmth),
  CriticalSignalsSchema (evidence_requests, base_rate_probe, format_complete,
  claim_quoted, gap_named, steelman_present, verdict_given,
  verdict_consistent, open_questions, final_warmth),
  DecisionSignalsSchema (stake_questions, options_listed, choice_committed,
  waffle, tradeoff_priced, unknown_named, tripwire_set, format_complete,
  final_warmth), and BehaviorSignalsSchema (cue_named, routine_named,
  reward_named, premature_advice, technique_named, technique_matched,
  plan_specific, tripwire_set, hold_under_pushback, format_complete,
  final_warmth) as new named exports.
- **Per-skill unit extensions** (schemas.ts, additive): new exports built with
  UnitSchema.extend() adding the per-unit keyword blocks each pack needs
  (root_cause_keywords, change_keywords for PS; planted_flaw_keywords,
  new_info_keywords for CT; option_keywords, new_info_keywords for DM;
  cue_keywords, routine_keywords, reward_keywords, valid_technique_set for
  BS). The base UnitSchema is not modified; existing Communication content
  validates exactly as before.
- **Per-skill validators** (new files beside validator.ts:
  validator-problem.ts, validator-critical.ts, validator-decision.ts,
  validator-behavior.ts): each exports its own computeSignals and
  signalValue plus its pack's curated marker lists (fix markers, evidence
  markers, hedge phrases, stake markers, premature-advice markers, the closed
  five-term technique set), following the OPEN_STARTERS pattern: shipped
  constants, mirrored in pack JSON, test-asserted identical. Each reuses
  isQuestion, isFollowup, contentWords, normalizeWhitespace from
  validator.ts; validator-behavior.ts additionally reuses PS's
  premature_fix band logic (renamed premature_advice, same shape) and DM's
  tripwire digit-or-calendar-word check verbatim. The existing passes() stays
  untouched; each new file exports its own passes wired to its own
  signalValue (the band logic is ten lines and duplicating it per pack is
  cheaper than generalizing a locked contract).
- **Per-skill score weights** (score.ts, additive): new named exports
  PROBLEM_WEIGHTS, CRITICAL_WEIGHTS, DECISION_WEIGHTS, BEHAVIOR_WEIGHTS plus
  scoreProblem, scoreCritical, scoreDecision, scoreBehavior functions.
  DEFAULT_WEIGHTS and score() are not touched; Communication scores are
  bit-identical before and after.
- **Per-skill reason-code enums** (schemas.ts, additive): ReasonCodeSchema is
  Communication's closed enum and stays locked. Each pack exports its own
  closed enum (e.g. ProblemReasonCodeSchema: specific_question, followup,
  restated, premature_fix, generic_advice, ignored_content, neutral;
  BehaviorReasonCodeSchema: cue_question, routine_question, reward_question,
  premature_advice, technique_named, willpower_relapse, neutral) and a
  pack-level CharacterOutput variant built by extension, same
  {reply, warmth_delta, reason_code} shape.
- **Per-skill feedback prompts**: same FeedbackOutputSchema, new prompt text
  per pack framing WIN/FIX/MOMENT around the pack's north star (THE MOMENT
  becomes "where the cause surfaced or stayed buried," "where the front
  dropped," "where the decision got real," "where the loop got named instead
  of blamed on willpower").

Nothing above rewrites an existing export, changes an existing schema's parse
behavior, or puts an LLM in any score path.

---

## SECTION 3: SEQUENCING RECOMMENDATION

**Build order: Communication (exists) -> Problem-Solving -> Decision-Making ->
Critical Thinking -> Behavior Science.** Do not build any two simultaneously.

**Problem-Solving first**, for all three stated criteria at once:
- **Validator reuse**: it is the only new skill needing NO structured-close
  format. Its signals are questions, follow-ups, marker lists, and keyword
  matches: the exact classifier shapes validator.ts already implements. The
  hidden-root-cause mechanic is Sam's hidden_depth mechanic renamed. It is the
  smallest possible step from shipped code.
- **Market demand signal from this repo**: ALPHA-MODEL-ANALYSIS.md's demand
  argument for sales rests on workplace ROI and reachable professional
  audiences; of the four new skills, Problem-Solving is the one with the same
  workplace-ROI shape (diagnosis is the daily job of managers, engineers,
  support, and freelancers), so the prior research points here first.
- **Implementation risk**: lowest. No new user-facing behavior to teach; a
  Problem-Solving chat feels identical to a Communication chat and inherits its
  proven fun (a character with a secret that good behavior unlocks).

**Decision-Making second**: it introduces the structured-close format, which is
the one genuinely new UX behavior, and it is the better pilot for it than
Critical Thinking because its payoff is visceral (users bring real pending
decisions) and its structure is shorter (five labels, one of everything).
**Critical Thinking third**: it depends most heavily on the structured format
(two units above use five and six labels), it is the most at risk of feeling
like homework (POSITIONING.md trap 3), and by building it after Decision-Making
it inherits a user base already fluent in labeled closes.

**Behavior Science last**, and deliberately so: it is a recombination, not a
new mechanism. It needs Problem-Solving's diagnostic-gate pattern
(premature_advice reuses premature_fix's exact shape) AND Decision-Making's
and Critical Thinking's structured-close and closed-word-set machinery
(TECHNIQUE reuses CT's closed-set check, TRIPWIRE reuses DM's check verbatim)
proven in production first. Building it earlier would mean inventing two
mechanisms simultaneously instead of composing two already-shipped ones; that
is the same "smallest possible step from shipped code" logic that put
Problem-Solving first, applied to the skill most able to benefit from it.

---

## SECTION 4: EXPLICIT SCOPE NOTE

This 5-skill expansion is deliberately broader than the product's current
positioning: POSITIONING.md's locked year-one discipline is to hold the single
narrow charisma identity and explicitly warns against going broad early ("better
communicator is oatmeal," trap 5), so whoever builds this roadmap is consciously
trading that positioning discipline for surface area now, not discovering the
tradeoff later. Behavior Science widens that trade further than the original
4-skill version: it was added on 2026-07-19 by explicit user request, over the
prior locked "4-skill taxonomy final" decision, specifically framed as applied
and technical rather than a credibility-anchor (see the top-of-document flag).
That framing is what keeps it inside the deterministic-scoring moat this whole
document protects; a "learn about behavior science" version would not have
cleared this section.
