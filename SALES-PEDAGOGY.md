# SALES-PEDAGOGY: the sales skill pack (subject #1 on the engine)

The sales `SkillPack` for the constraint engine in `MCP-ENGINE-SPEC.md`, conforming to the unit schema and scoring contract in `PEDAGOGY.md`. Authored from the public sales canon (consultative and discovery-led selling: SPIN, Sandler, Challenger, Straight Line, solution selling) and first principles. The Matt Ryder course transcripts were NOT consulted; they remain quarantined (`SOURCE-DO-NOT-SHIP/README.md`). Sales is the recommended V1 beachhead: the operator has real expertise, ROI is measurable, and a call transcript is naturally text-scorable. No em-dashes anywhere.

```
subject_id: "sales"
version: "0.1"
```

## 0. Input model (hardened after red-team)

A red-team found the obvious hole: if the user pastes a transcript containing BOTH speakers, they can invent a compliant prospect and pass every discovery signal without performing the skill. The evidence-substring check does not help, because the evidence exists in the script the user wrote. So the input model is NOT "paste a two-sided transcript." It is two constrained modes:

**Mode A: AI-prospect roleplay (default, most units).** The unit ships a **prospect persona and a resistance brief** (the server returns it inside `get_current_unit`). The user's own Claude PLAYS that prospect, adversarially: it withholds the real why until genuinely probed, raises the scripted objection, and does not hand over cooperation. The user authors only the `REP:` turns; the `PROSPECT:` turns are generated live by the client acting under the server-supplied brief. The user cannot fabricate a compliant prospect because the user does not write the prospect. The submitted transcript is co-produced.

**Mode B: real-call transcript (higher mastery weight).** For advanced units, the user pastes a transcript from an actual recorded call (CRM, Gong, Otter, etc.). Real prospects are not compliant, so this is the strongest signal. The product cannot prove a transcript is real, and does not try: a seller practicing for real commission has no incentive to fake, because faking only lowers their own close rate. Mode B attempts carry more mastery weight than Mode A.

**Server-verified vs client-judged (removes trust where possible).** The server parses the labeled transcript and **recomputes the countable signals itself** (`SIG_TALK_LISTEN`, `SIG_OPEN_Q_RATE`, `SIG_MONOLOGUE`, `SIG_HOLD_SILENCE` turn order). This is parsing, not inference, so it stays $0 and cannot be talked out of by the client. Only the genuinely semantic signals (`SIG_REAL_WHY`, `SIG_COST_OF_INACTION`, `SIG_PROSPECT_VALUE`) remain client-judged, and for those the coach-not-certifier stance applies: the ultimate verifier is the user's real close rate.

Optional delivery annotation (`(Ns)`, `*emphasis*`) carries over from `PEDAGOGY.md`. The server runs zero inference throughout.

## 1. Skill tree

Ordered by the natural call flow and by dependency (you cannot present value you have not discovered, cannot handle objections without a pitch to object to). Nodes: `id`, `name`, `objective`, `prerequisites`.

### Tier 0: Foundations
- `SF1` Belief and Service Frame. Objective: hold conviction in the offer and a "diagnose to help" frame, not "convince to win." Prereqs: none.
- `SF2` Upfront Contract. Objective: open every call by setting the agenda and the possible outcomes (including "no"), so the call has a spine and a clear next step. Prereqs: none.
- `SF3` Rapport and Listening. Objective: build trust fast; listen more than you talk; reflect back. Prereqs: none.

### Tier 1: Discovery (the core of consultative selling)
- `SD1` Questioning Fundamentals. Objective: use open questions and a funnel from broad to specific. Prereqs: SF2.
- `SD2` Situation Mapping. Objective: understand the prospect's current state before problems. Prereqs: SD1.
- `SD3` Problem Discovery. Objective: surface real problems, not just stated wants. Prereqs: SD2.
- `SD4` The Real Why. Objective: dig past the surface problem to the underlying motivation (at least two levels deep on one thread). Prereqs: SD3.
- `SD5` Cost of Inaction. Objective: help the prospect quantify what not solving costs them. Prereqs: SD3.
- `SD6` Prospect-Stated Value. Objective: get the prospect to articulate the payoff of solving, in their own words. Prereqs: SD5.

### Tier 2: Presentation
- `SP1` Tailored Presentation. Objective: present only what maps to what was discovered. Prereqs: SD6.
- `SP2` Value and ROI Framing. Objective: frame price against the cost of inaction, not in a vacuum. Prereqs: SP1.
- `SP3` Trial Close. Objective: take temperature before the final ask. Prereqs: SP1.

### Tier 3: Objection handling
- `SO1` Objection Mindset. Objective: treat objections as requests for information, not rejection. Prereqs: SP1.
- `SO2` Clarify and Isolate. Objective: find the real objection before answering any objection. Prereqs: SO1.
- `SO3` Money Objections. Objective: handle price by returning to value and cost of inaction. Prereqs: SO2.
- `SO4` Logistical, Time, and Partner Objections. Objective: separate genuine logistics from stalls. Prereqs: SO2.
- `SO5` Fear and Trust Objections. Objective: surface and address the real fear under a stall. Prereqs: SO2.

### Tier 4: Closing
- `SC1` Ask for Commitment. Objective: make a clear, direct, unambiguous ask. Prereqs: SP3, SO2.
- `SC2` Hold the Silence. Objective: after the ask, stop talking and let the prospect answer. Prereqs: SC1.
- `SC3` Next-Step Discipline. Objective: never end a call without a concrete, scheduled next step. Prereqs: SC1.

### Tier 5: Integration
- `SI1` Full Call Assembly. Objective: run a complete call applying the above. Prereqs: SC1, SD6, SO2.
- `SI2` Call Self-Review. Objective: critique your own recorded call against the rubric. Prereqs: SI1.

### Prerequisite edges
```
SF2->SD1, SD1->SD2->SD3, SD3->SD4, SD3->SD5, SD5->SD6,
SD6->SP1, SP1->SP2, SP1->SP3, SP1->SO1, SO1->SO2,
SO2->SO3, SO2->SO4, SO2->SO5,
SP3->SC1, SO2->SC1, SC1->SC2, SC1->SC3,
SC1->SI1, SD6->SI1, SO2->SI1, SI1->SI2
```

### Why this ordering
Discovery before presentation before objections before close mirrors both the call's real sequence and the dependency chain (canon: SPIN's Situation to Problem to Implication to Need-payoff; Sandler's upfront contract and pain funnel). Foundations lower call anxiety and set control so the learner can attend to skill. Isolate before integrate: single moves are mastered before running a whole call (`SI1`).

## 2. Rubric-signal library (performance-observable from a labeled transcript)

Same philosophy as `PEDAGOGY.md` Section 3: content-couple every signal, use band thresholds, mandate quoted evidence the server substring-checks. Sales signals are strong because they measure what actually happened in the call, which a chatbot cannot fake into existence.

| id | measures | detection | default threshold | gaming vector | resistance check |
|---|---|---|---|---|---|
| `SIG_TALK_LISTEN` | rep dominance | rep words / total words (needs both labels) | rep talks `30 to 45%` in a discovery unit | edit prospect lines longer | both speakers must be present; a >80% rep transcript is flagged, not passed |
| `SIG_OPEN_Q_RATE` | quality of questioning | count REP open questions (what/how/why/tell me) before first pitch | `>= 4` open questions before any pitch | stuff questions | yes/no and leading questions do not count; must precede the pitch |
| `SIG_PREMATURE_PITCH` | pitching too early (FAIL) | solution/feature language appears before discovery threshold met | must NOT fire | n/a | diagnostic; fires if a pitch precedes `SIG_OPEN_Q_RATE` |
| `SIG_REAL_WHY` | depth of discovery | a probing chain of `>= 2` levels on one thread ("why does that matter" twice) | present | label a shallow exchange | each level must reference the prior answer, not a new topic |
| `SIG_COST_OF_INACTION` | implication surfaced | an exchange where the cost of not solving is stated | present, stronger if PROSPECT states it | rep asserts it | prospect-stated scores higher; rep-only is partial |
| `SIG_PROSPECT_VALUE` | need-payoff | PROSPECT articulates the value of solving in their words | `>= 1` prospect value statement | rep puts words in their mouth | must be a PROSPECT turn, quoted |
| `SIG_UPFRONT_CONTRACT` | call control | rep sets agenda and outcomes at the open | present in first ~5 turns | canned line | must name the next-step/outcome, not just greet |
| `SIG_ISOLATE_OBJECTION` | objection handling | after each objection, rep asks a clarifying question before answering | isolate-before-answer on every objection | answer then ask | the clarifying turn must precede the response turn |
| `SIG_TRIAL_CLOSE` | temperature check | a trial close before the final ask ("how does that sound so far") | `>= 1` before the ask | none needed | must be a real gauge, not a rhetorical filler |
| `SIG_CLEAR_ASK` | closing | a direct, unambiguous ask for commitment | present and unambiguous | vague "let me know" | must name the specific commitment |
| `SIG_HOLD_SILENCE` | discipline after the ask | rep does not add words after the ask before the prospect responds (annotated `(Ns)` or clean turn boundary) | no rep words between ask and prospect reply | delete the talk-past | turn order must show PROSPECT next after the ask |
| `SIG_NEXT_STEP` | never leave it open | a concrete scheduled next step at the end | present with a specific time/action | vague "follow up" | must name a specific action and time |
| `SIG_MONOLOGUE` | rep rambling (FAIL) | longest uninterrupted REP turn word count | `< 150 words` in discovery | none | diagnostic |

Signal trust (per §0): **server-verified** by parsing (no inference, no client trust): `SIG_TALK_LISTEN`, `SIG_OPEN_Q_RATE`, `SIG_MONOLOGUE`, `SIG_HOLD_SILENCE`, `SIG_PREMATURE_PITCH`. **Client-judged** (semantic, coach-not-certifier residual): `SIG_REAL_WHY`, `SIG_COST_OF_INACTION`, `SIG_PROSPECT_VALUE`, `SIG_ISOLATE_OBJECTION`, `SIG_TRIAL_CLOSE`, `SIG_CLEAR_ASK`, `SIG_NEXT_STEP`. The client-judged set is only trustworthy under Mode A roleplay or Mode B real calls, because both stop the user from authoring a compliant prospect.

Cross-subject reuse: `SIG_FILLER_RATE`, `SIG_PAUSE_PLACEMENT`, and `SIG_SPECIFICITY` from `PEDAGOGY.md` apply here too. Shared signals are one more reason the engine scales: signals are a library, not per-subject silos.

## 3. Diagnostic (placement probe)

A short adaptive probe that places the learner at the right node instead of forcing a pro through beginner units (engine `start_diagnostic`). Sketch:
1. Present a prospect opening line; ask the user to type their first three moves. Score against `SIG_UPFRONT_CONTRACT`, `SIG_OPEN_Q_RATE`. Weak here places at `SF2`/`SD1`.
2. Present a stated surface problem; ask the user to respond. Score `SIG_REAL_WHY`, `SIG_COST_OF_INACTION`. Weak here places at `SD3`/`SD4`.
3. Present a price objection; ask the user to handle it. Score `SIG_ISOLATE_OBJECTION`, `SIG_MONEY` behavior. Weak here places at `SO2`/`SO3`.
4. Present a "sounds good, let me think about it"; score `SIG_CLEAR_ASK`, `SIG_HOLD_SILENCE`. Weak here places at `SC1`.
Placement = the earliest tier with a failing probe. Everything before it is marked mastered-by-diagnostic (subject to a later review), so a strong seller starts near closing, not at hello.

## 4. Worked example: `SD4` The Real Why, unit `SD4.d1`

```
unit_id: "SD4.d1"
skill_id: "SD4"
title: "Two levels past the surface"
principle: "The first problem a prospect names is rarely the one that moves them. Ask what that problem costs them, then ask why that matters, until you reach a motivation with emotion behind it."
why: "People buy to resolve a felt consequence, not to fix a surface symptom. The real why is where the sale is actually made."
exemplar:
  strong: "PROSPECT: leads are slow. REP: what does a slow month cost you? PROSPECT: I miss payroll targets. REP: and when payroll is tight, what does that put at risk? PROSPECT: honestly, whether I can keep my two best people."
  weak: "PROSPECT: leads are slow. REP: great, our tool generates more leads."
drill:
  instructions: "Run or roleplay a 2 to 4 minute discovery exchange. Start from a surface problem the prospect names and probe at least two levels deeper on the same thread. Paste the labeled transcript."
  input_format: "labeled_transcript"
  target_length: "2 to 4 minutes"
rubric:
  criteria:
    - { signal_id: "SIG_REAL_WHY",     threshold: {op: ">=", value: 2}, must_pass: true,  weight: 0.5 }
    - { signal_id: "SIG_TALK_LISTEN",  threshold: {op: "between", value: [0.3, 0.45]}, must_pass: false, weight: 0.25 }
    - { signal_id: "SIG_PREMATURE_PITCH", threshold: {op: "==", value: 0}, must_pass: true, weight: 0.25 }
  pass_rule: "all must_pass true AND weighted_score >= 0.7"
mastery: { passes_required: 2, distinct_sessions: true, clean_pass_required: true }
prerequisites: ["SD3"]
estimated_minutes: 10
```

Sample attempt (original, invented):
```
PROSPECT: Our close rate just dropped this quarter.
REP: When it drops, what does that actually cost you?
PROSPECT: We miss the number, so marketing spend looks wasted.
REP: And if that keeps up, why does that matter to you personally?
PROSPECT: (2s) It is my name on the forecast. If I miss twice, I lose the board's trust.
```

Client verdict to `submit_attempt`:
```
{
  "unit_id": "SD4.d1", "attempt_id": "att_s1",
  "criteria": [
    { "signal_id": "SIG_REAL_WHY", "measured_value": 2, "threshold": {"op":">=","value":2},
      "pass": true, "evidence": "why does that matter to you personally? ... my name on the forecast" },
    { "signal_id": "SIG_TALK_LISTEN", "measured_value": 0.34, "threshold": {"op":"between","value":[0.3,0.45]},
      "pass": true, "evidence": "REP turns are short relative to PROSPECT" },
    { "signal_id": "SIG_PREMATURE_PITCH", "measured_value": 0, "threshold": {"op":"==","value":0},
      "pass": true, "evidence": "(no solution language present)" }
  ],
  "overall_pass": true, "overall_score": 0.94,
  "coach_notes": "Two clean levels, and you reached an emotional stake (board trust). Next time quantify the cost in dollars before going personal."
}
```

Server processing (no inference): outstanding unit matches; must_pass signals present; booleans recompute (`2>=2`, `0.34 in [0.3,0.45]`, `0==0`); pass_rule holds; each evidence span is a substring of the transcript; plausibility fine; record pass 1 of 2, `distinct_sessions` keeps `SD4` in_progress. A second clean pass in a later session masters `SD4` and flips `SD5`/`SD6` toward available.

## 5. Freeze and next steps
- This pack is ready to author full units against (Phase 2, max-safety mode) and to serve through the engine (Phase 3).
- Red-team applied (see §0): the fabricated-compliant-prospect attack defeated the discovery/close signals when the user pasted a two-sided transcript. Fixed by (1) AI-prospect roleplay as the default input model, (2) real-call transcripts for high mastery, (3) server-side recompute of the countable signals, (4) an explicit coach-not-certifier stance for the semantic residual. Remaining residual: `SIG_REAL_WHY` still rewards a 2-level form; under roleplay the persona brief must make the prospect withhold the real why until genuinely probed, so the form maps to substance. Next red-team target: write a roleplay persona brief that a mechanical two-why still cracks.
- Sourcing reminder: author full unit content from the public sales canon and the operator's own experience. The Matt Ryder transcripts stay quarantined, gap-check only.
