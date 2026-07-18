# PEDAGOGY.md: the coached progression (frozen spec)

Authored from the public speaking canon (Carnegie, Anderson/TED, Toastmasters competency areas, classical rhetoric, acting and voice pedagogy) and first principles of learning science. The quarantined source transcripts were NOT consulted. This document is the moat: the sequenced, stateful coaching loop that the MCP server enforces. Phase 3 implements tools directly against it, so it is written to be concrete and unambiguous. No em-dashes anywhere.

Scope of this document: the skill graph, the unit schema, the rubric-signal library, the gating algorithm, the mastery and review model, the scoring round-trip contract, and one fully worked skill. It does NOT contain all unit content. Authoring the full set of units against this spec is Phase 2 (see `EXTRACTION-META-PROMPT.md`).

## Section checklist
1. Skill tree
2. Unit schema
3. Rubric-signal library
4. Deterministic gating algorithm
5. Mastery and review model
6. Scoring round-trip contract
7. Worked example

---

## 0. Input model (read first, everything depends on it)

Live-voice is OUT of v1 (owner cost stays ~$0), so an attempt is submitted as TEXT: an **annotated transcript** the user pastes, using a small fixed markup that makes delivery measurable from text.

Markup:
- `(Ns)` a pause of N seconds, e.g. `and then (2s) everything changed`.
- `*word*` a stressed / emphasized word.
- `[loud]...[/loud]` a raised-volume span (optional).
- `//` a hard breath / reset (optional).

Plus an optional self-report block: `what I attempted`, `how it felt`. The user's own Claude (the client) does all coaching and scoring from this text. The server runs zero inference.

Honest limitation: pure acoustic qualities (true pitch, true volume, timbre) cannot be measured from a bare transcript. v1 measures them via the annotation (self-marked) and via text proxies (sentence rhythm, emphasis placement), and defers true acoustic scoring to a v2 audio path. Signals that are text-hard are labeled below.

---

## 1. Skill tree

Every node has `id`, `name`, `objective`, and `prerequisites`. Advancement is gated on mastery of prerequisites, not on time.

### Tier 0: Foundations
- `F1` Audience Contract. Objective: state your talk's single promise to the audience and honor it end to end. Prereqs: none.
- `F2` Nerve Regulation. Objective: run a pre-talk routine that brings arousal to a workable level. Prereqs: none.
- `F3` Presence and Stillness. Objective: hold a grounded, still base without fidget or pacing. Prereqs: none.

### Tier 1: Vocal delivery
- `V1` Pace and Rate. Objective: vary speaking rate deliberately (slow for weight, quick for energy). Prereqs: F1.
- `V2` Volume and Projection. Objective: project and vary volume for emphasis. Prereqs: F1.
- `V3` Pitch and Melody. Objective: vary pitch to break monotone. Prereqs: V1.
- `V4` Pause and Silence. Objective: use deliberate pauses for emphasis and control. Prereqs: V1.
- `V5` Emphasis and Tonality. Objective: stress the meaning-bearing words and match tone to content. Prereqs: V3, V4.

### Tier 2: Physical presence
- `P1` Stance and Grounding. Objective: a stable, rooted base. Prereqs: F3.
- `P2` Gesture. Objective: purposeful gestures that illustrate, not fidget. Prereqs: P1.
- `P3` Eye Contact. Objective: sustained connection with individuals, not scanning. Prereqs: F1.
- `P4` Motivated Movement. Objective: stage movement that serves the content, not pacing. Prereqs: P1, P2.

### Tier 3: Narrative
- `N1` Story Spine. Objective: structure a story as setup, turn, resolution. Prereqs: F1.
- `N2` Specificity. Objective: use concrete, named, sensory detail. Prereqs: N1.
- `N3` Tension and Stakes. Objective: make clear what is at risk. Prereqs: N1.
- `N4` Linking. Objective: transition between points and stories without seams. Prereqs: N1.

### Tier 4: Dynamic range (requires voice + body + a story with stakes)
- `D1` Delivery-to-Intent Matching. Objective: adapt delivery to the room and the moment. Prereqs: V5, P4, N3.
- `D2` Contrast. Objective: use contrast in pace, volume, and energy to create dynamism. Prereqs: V5.

### Tier 5: Integration
- `I1` Talk Assembly. Objective: assemble and deliver a full short talk applying the above. Prereqs: D1, N4.
- `I2` Self-Review. Objective: critique your own recorded talk against the rubric. Prereqs: I1.

### Explicit prerequisite edges
```
F1->V1, F1->V2, F1->P3, F1->N1
V1->V3, V1->V4
V3->V5, V4->V5
F3->P1, P1->P2, P1->P4, P2->P4
N1->N2, N1->N3, N1->N4
V5->D1, P4->D1, N3->D1, V5->D2
D1->I1, N4->I1, I1->I2
```

### Why this ordering (learning science, not the source course)
- **Isolate before integrate (cognitive load theory, Sweller).** Voice, body, and narrative are trained as separate channels first, because attending to all three at once overloads a beginner. Dynamic range and Integration only unlock after the single channels are automatic.
- **Scaffolding (Vygotsky, ZPD).** Foundations (contract, nerves, presence) lower extraneous load so the learner can attend to the skill itself.
- **Mastery learning (Bloom).** Each node gates on demonstrated mastery, targeting the 2-sigma effect, rather than exposure or time spent.
- **Deliberate practice (Ericsson).** Each unit isolates one measurable behavior with immediate, specific feedback.

---

## 2. Unit schema

A unit is the atomic thing `get_current_unit` returns. Exactly one is served at a time.

```
Unit {
  unit_id: string            // e.g. "V4.d1"
  skill_id: string           // FK to a skill-tree node, e.g. "V4"
  title: string
  principle: string          // 1 to 3 sentences, the technique in plain language
  why: string                // the payoff, for motivation
  exemplar: {
    strong: string           // short ORIGINAL example with the technique present
    weak: string             // the same idea with the technique absent
  }
  drill: {
    instructions: string
    input_format: "annotated_transcript"   // v1 default
    target_length: string    // e.g. "30 to 45 seconds"
  }
  rubric: {
    criteria: [ { signal_id: string, threshold: Threshold, must_pass: bool, weight: number } ]
    pass_rule: string        // deterministic, e.g. "all must_pass true AND weighted_score >= 0.7"
  }
  mastery: {
    passes_required: int     // default 2
    distinct_sessions: bool  // default true
    clean_pass_required: bool// at least one pass with all must_pass AND score >= 0.85
  }
  prerequisites: string[]    // from the skill tree
  estimated_minutes: int
}
Threshold = { op: "<"|"<="|">"|">="|"between", value: number | [number, number] }
```

Types: all strings are UTF-8; numbers are JSON numbers; `signal_id` references Section 3.

---

## 3. Rubric-signal library (the core asset)

Each signal is measurable by the client LLM from the annotated transcript. Columns: what it measures, how the client detects it from text, the default pass threshold (a unit may override), the most likely gaming vector, and the check that resists it. Signals are designed so that **the cheapest way to pass is to actually perform the skill**, and so that **overdoing a behavior fails as surely as underdoing it** (band thresholds).

### Design philosophy (this is the IP, not the list)
1. **Content-couple every signal.** A delivery marker only counts if it lands on meaning (a pause near a key line, emphasis on a content word). Faking then requires writing real content, at which point the skill is basically done.
2. **Band thresholds, not floors.** Too many pauses or emphases fails. Mindless stuffing cannot pass.
3. **Evidence is mandatory.** Every "pass" must quote the transcript span that earned it. This makes the verdict auditable and lets the server catch fabrication without any inference (Section 6).
4. **Coach, not certifier.** Perfect anti-gaming is impossible when the user annotates their own attempt and their own client judges it. The goal is to make honest practice the path of least resistance and to make lying visibly effortful, not to be un-gameable.

### Structural and verbal signals (robustly text-measurable)

| id | measures | detection | default threshold | gaming vector | resistance check |
|---|---|---|---|---|---|
| `SIG_FILLER_RATE` | filler density | count um/uh/like(filler)/you-know/so-opener per 100 words | `< 3 / 100` | user cleans fillers while transcribing | require verbatim transcript; a 45s+ attempt with exactly 0 fillers AND 0 self-corrections is flagged for an honesty confirmation, not auto-passed |
| `SIG_SPECIFICITY` | concrete detail | count load-bearing specifics (named person/place, number, date, sensory noun) tied to the claim | `>= 2 per 60s story` | stuff random numbers/names | each specific must be referenced by the surrounding sentence; decorative specifics do not count |
| `SIG_STORY_SPINE` | narrative structure | identify setup (normal), turn (disruption: "but/then/suddenly"), resolution | all three present and ordered | label sections without content | each beat must carry real content; the turn must change the situation, not just say "then" |
| `SIG_STAKES` | risk is legible | find an explicit stake ("if X then Y", a cost of failure) | present | vague "it mattered" | the stake must name a concrete consequence |
| `SIG_OPENING_HOOK` | strong open | classify sentence 1 as question / bold claim / concrete scene vs agenda opener | not an agenda/throat-clear | canned hook glued on | hook must connect to the content that follows |
| `SIG_SENTENCE_RHYTHM` | dynamism (pace proxy) | coefficient of variation of sentence word-counts; presence of a short punch sentence (<= 5 words) | `CV > 0.4` AND `>= 1` short sentence | chop randomly | the short sentence must sit on a key point, not mid-thought |
| `SIG_ACTIVE_VERBS` | vividness | ratio of be-verbs to total verbs | `be-ratio < 0.30` | swap trivially | flagged only alongside content coherence |
| `SIG_DEVICE` | rhetorical craft | detect tricolon, antithesis/contrast, deliberate repetition | `>= 1` in a persuasive unit | forced device | device must serve the point, not decorate |

### Delivery signals (via annotation; self-marked, cross-checked)

| id | measures | detection | default threshold | gaming vector | resistance check |
|---|---|---|---|---|---|
| `SIG_PAUSE_PLACEMENT` | strategic silence | find `(Ns)` markers with `N >= 1.5` adjacent to a key line (before a punchline, after a question) | `>= 1` well-placed pause; `<= 1 pause / 8s` overall | sprinkle pause markers | a pause mid-clause does not count; pause density above the band fails as noise |
| `SIG_EMPHASIS_PLACEMENT` | meaningful stress | check POS of `*marked*` tokens; measure share of words emphasized | majority on content words; `emphasized share between 0.05 and 0.25` | emphasize everything | if > 25% of words emphasized, fail (emphasis means nothing when everywhere) |
| `SIG_CONTRAST` | dynamic range | detect a shift in marked delivery (a loud span next to a pause, a fast run next to a held line) | `>= 1` deliberate contrast | mark noise | the contrast must bracket a meaning shift |
| `SIG_MONOTONE_PROXY` | flatness (fail signal) | fires when `SIG_SENTENCE_RHYTHM` low AND emphasis count ~0 AND no pauses | must NOT fire | n/a | diagnostic only |

### Text-hard signals (proxied in v1, true scoring deferred to audio v2)
- `SIG_PITCH_VARIATION`: true pitch is not recoverable from text. v1 proxies it with `SIG_SENTENCE_RHYTHM` + `SIG_EMPHASIS_PLACEMENT` and labels the unit "acoustic, self-reported." Do not claim precise pitch scoring in v1.
- `SIG_TRUE_VOLUME`: same. Proxied by `[loud]` annotation only.

### Meta signal (anti-gaming, not a skill)
- `SIG_SELF_REPORT_CONSISTENCY`: the user's "what I attempted" note must be consistent with what the transcript shows. Used to weight coach trust, never as a skill pass on its own.

---

## 4. Deterministic gating algorithm

State per user: for each skill, `status in {locked, available, in_progress, mastered, due_review}`, plus per-unit pass records and per-skill review timers. `CANON_ORDER` is a fixed topological sort of the skill tree, ties broken by `skill_id` ascending:
```
F1,F2,F3,V1,V2,V3,V4,V5,P1,P2,P3,P4,N1,N2,N3,N4,D1,D2,I1,I2
```

```
function next_unit(user_state, now):
    # 1. Reviews first (protects retention)
    due = [s for s in skills if s.status == "due_review" and s.review_due_at <= now]
    if due:
        s = min(due, key = lambda s: (s.review_due_at, CANON_ORDER.index(s.id)))
        return review_unit_for(s)

    # 2. Finish what is started
    in_prog = [s for s in skills if s.status == "in_progress"]
    if in_prog:
        s = min(in_prog, key = lambda s: CANON_ORDER.index(s.id))
        return next_unpassed_unit(s)      # the unit whose mastery is not yet met

    # 3. Start the next available skill in canonical order
    for sid in CANON_ORDER:
        s = skills[sid]
        if s.status == "available":        # available == all prereqs mastered
            s.status = "in_progress"
            return first_unit(s)

    # 4. Nothing available, nothing due
    upcoming = earliest_review(skills)     # next scheduled review time or null
    return status_current(next_review_at = upcoming)
```
Determinism: no randomness anywhere; the same `user_state` and a monotonic clock yield the same unit. Availability is recomputed whenever a skill reaches `mastered`: any skill whose prereqs are all mastered flips `locked -> available`.

---

## 5. Mastery and review model

### Per-skill state machine
```
locked      --(all prereqs mastered)-->            available
available   --(first attempt submitted)-->         in_progress
in_progress --(mastery met)-->                     mastered
mastered    --(spaced interval elapsed)-->         due_review
due_review  --(review attempt passes)-->           mastered      (interval advances)
due_review  --(review attempt fails)-->            in_progress   (interval resets)
```

### Transition rules (concrete)
- **Pass** of an attempt = the unit's `pass_rule` evaluates true.
- **Mastery** of a skill = `passes_required` passing attempts (default 2), across `distinct_sessions` (default true, so no single-session double-tap), with at least one **clean pass** (all `must_pass` signals true AND `overall_score >= 0.85`). The server owns this counter, not the client.
- **Spaced review (Leitner-style):** after mastery, review is scheduled at `3d, 7d, 21d, 60d, 180d`. A passing review advances to the next interval; a failing review resets the skill to `in_progress` at the `3d` box.

### Motivation layer (retention is the existential risk, so it is designed in, not bolted on)
- **Streak:** consecutive calendar days with at least one attempt. Stored server-side, $0.
- **Session shaping:** the coach suggests 1 to 2 units per session to build a sustainable habit and avoid overload.
- **Pull-back:** `where_am_i` always surfaces the next due review and the streak, giving a concrete reason to return. This is the recurring-value engine: the state is what the user cannot get from a raw chat with their own Claude.

---

## 6. Scoring round-trip contract

The client (the user's Claude) coaches, then scores one attempt and calls `submit_attempt` with:
```
Verdict {
  unit_id: string
  attempt_id: string                 // client-generated unique id (replay guard)
  transcript_annotated: string       // exactly what the user submitted, stored for audit
  criteria: [
    {
      signal_id: string
      measured_value: number | string
      threshold: Threshold
      pass: bool
      evidence: string               // a VERBATIM span quoted from transcript_annotated
    }
  ]
  overall_pass: bool
  overall_score: number              // 0..1
  coach_notes: string
  client_meta: { model: string, timestamp: string }
}
```

### Server-side validation (NO inference; deterministic checks only)
The server cannot re-judge semantics, but it re-derives everything mechanical, which closes most gaming:
1. **Outstanding-unit match.** `unit_id` must equal the unit the server actually served this user and that is still open. Prevents verdicts for units not in progress.
2. **Coverage.** Every `must_pass` signal in the unit's rubric is present; no unknown `signal_id`s.
3. **Boolean recompute.** For numeric signals, the server recomputes `pass` from `measured_value` vs `threshold` (pure arithmetic). A client that reports `pass:true` with a failing value is rejected.
4. **Pass-rule recompute.** The server recomputes `overall_pass` by applying the unit's `pass_rule` to the criteria. The client cannot override the rule.
5. **Evidence existence.** Every passed criterion's `evidence` must be a substring of `transcript_annotated`. A fabricated pass with no real quoted span is rejected. This is the strongest no-inference anti-gaming check.
6. **Plausibility bounds.** `measured_value` within the signal's possible range (e.g. `SIG_FILLER_RATE` in `0..100`; pause count not exceeding what the transcript length allows).
7. **Mastery is server-owned.** The client judges a single attempt only. The server increments the pass counter, enforces `distinct_sessions`, and decides `mastered`. The client can never advance state.
8. **Replay and rate.** Reject duplicate `attempt_id`; enforce a minimum interval between attempts on the same unit.

### The trust split (why $0-cost scoring is defensible)
- **Server owns:** arithmetic, the pass rule, evidence-existence, mastery counting, scheduling. None require inference.
- **Client owns:** the genuinely semantic calls (is this specific load-bearing, does the pause sit on a key line). Here the coach-not-certifier stance applies, backed by mandatory quoted evidence so even semantic passes are auditable.

---

## 7. Worked example: `V4` Pause and Silence, unit `V4.d1`

### The unit
```
unit_id: "V4.d1"
skill_id: "V4"
title: "The pause before the turn"
principle: "A held silence right before your most important line makes the audience lean in and makes the line land. Silence is emphasis you do not have to earn with volume."
why: "Most speakers rush their best sentence. A single deliberate pause is the fastest upgrade to gravity."
exemplar:
  strong: "I opened the envelope. (2s) It was empty."
  weak: "I opened the envelope and it was empty."
drill:
  instructions: "Tell a true 30 to 45 second story that turns on one surprising line. Deliver it out loud, then paste an annotated transcript. Mark your pauses with (Ns) and your stressed words with *asterisks*."
  input_format: "annotated_transcript"
  target_length: "30 to 45 seconds"
rubric:
  criteria:
    - { signal_id: "SIG_PAUSE_PLACEMENT",   threshold: {op: ">=", value: 1}, must_pass: true,  weight: 0.5 }
    - { signal_id: "SIG_EMPHASIS_PLACEMENT",threshold: {op: "between", value: [0.05, 0.25]}, must_pass: false, weight: 0.25 }
    - { signal_id: "SIG_FILLER_RATE",        threshold: {op: "<", value: 4}, must_pass: false, weight: 0.25 }
  pass_rule: "all must_pass true AND weighted_score >= 0.7"
mastery: { passes_required: 2, distinct_sessions: true, clean_pass_required: true }
prerequisites: ["V1"]
estimated_minutes: 8
```

### A sample attempt (original content, invented for this spec)
```
When I was nineteen I sold my *car* to fly to a wedding I was not invited to.
I showed up in a borrowed suit, sat in the back, and waited for someone to ask me to leave.
Nobody did. The bride saw me from the altar and (2s) she *smiled*.
That smile cost me a *car*. // Cheapest thing I have ever bought.
```

### The client's verdict (what `submit_attempt` receives)
```
{
  "unit_id": "V4.d1",
  "attempt_id": "att_9f2a",
  "transcript_annotated": "<the text above>",
  "criteria": [
    { "signal_id": "SIG_PAUSE_PLACEMENT", "measured_value": 1, "threshold": {"op": ">=", "value": 1},
      "pass": true, "evidence": "from the altar and (2s) she *smiled*" },
    { "signal_id": "SIG_EMPHASIS_PLACEMENT", "measured_value": 0.09, "threshold": {"op":"between","value":[0.05,0.25]},
      "pass": true, "evidence": "*car* ... *smiled* ... *car*" },
    { "signal_id": "SIG_FILLER_RATE", "measured_value": 0, "threshold": {"op": "<", "value": 4},
      "pass": true, "evidence": "(no fillers present)" }
  ],
  "overall_pass": true,
  "overall_score": 0.92,
  "coach_notes": "The pause lands exactly on the turn, before 'she smiled'. Strong. Next time try one more beat of silence after 'Nobody did.'",
  "client_meta": { "model": "claude", "timestamp": "..." }
}
```

### Server processing (no inference)
1. Outstanding unit for this user is `V4.d1`, open. OK.
2. All `must_pass` signals present (`SIG_PAUSE_PLACEMENT`). OK.
3. Boolean recompute: `1 >= 1` true; `0.09 between [0.05,0.25]` true; `0 < 4` true. Matches client. OK.
4. Pass-rule recompute: must_pass (pause) true AND weighted_score `= 0.5*1 + 0.25*1 + 0.25*1 = 1.0 >= 0.7`. `overall_pass = true`. OK.
5. Evidence existence: each quoted span is a substring of the transcript. The pause evidence "from the altar and (2s) she *smiled*" appears verbatim. OK. (A fabricated quote would fail here.)
6. Plausibility: filler 0 in range, pause count 1 plausible for ~40s. OK.
7. Mastery: record pass 1 of 2. `distinct_sessions` requires the second pass in a later session, so the skill stays `in_progress`.
8. `attempt_id att_9f2a` not seen before. OK.

Server response: accept, `V4` remains `in_progress` (1/2 passes, clean pass achieved). `next_unit` returns the same skill's next attempt prompt in a later session, or a due review if one exists. When a second clean pass lands in a distinct session, `V4 -> mastered`, which flips `V5` from `locked` toward `available` once `V3` is also mastered.

---

## Freeze note
This spec is ready for Phase 3 to implement and for Phase 2 to author units against. The highest-value and most fragile part is Section 3; a Fable red-team pass should attack each signal's `gaming vector` and try to find a passing attempt that did not perform the skill. Any signal that falls to that attack needs a tighter `resistance check` before launch.
