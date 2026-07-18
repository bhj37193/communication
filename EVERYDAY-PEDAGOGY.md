# EVERYDAY-PEDAGOGY: the everyday-conversation skill pack (mode #3)

The everyday-conversation `SkillPack` for the constraint engine in `MCP-ENGINE-SPEC.md`, conforming to the unit schema and scoring contract in `PEDAGOGY.md`. This mode teaches you to make any conversation better: ask the right questions, listen so people feel heard, and make the other person feel interesting so they want to keep talking to you.

Authored from the public canon of connection and conversation (Carnegie's "How to Win Friends," active-listening research, Gottman's "bids for connection," improv's "yes-and," and the question-asking research on follow-ups and self-disclosure) plus first principles. It **borrows two existing packs**: the interactive/questioning signals from `SALES-PEDAGOGY.md` and the storytelling/delivery signals from `PEDAGOGY.md` (public speaking). Quarantined course transcripts were not consulted. No em-dashes anywhere.

```
subject_id: "everyday"
version: "0.1"
```

## 0. Input model (and the one thing that makes this mode different)

An attempt is a **labeled roleplay transcript** with `YOU:` and `PARTNER:` turns. The user's own Claude plays the PARTNER: a real person in a normal setting (a stranger at a party, a coworker in the kitchen, a new acquaintance, a first date). The partner is **pleasant but not effusive**: they open up and get warmer when the user shows genuine interest and reciprocates, and they stay surface-level or drift when the user interrogates them or makes it about themselves. Because the client plays the partner (roleplay mode, per `SALES-PEDAGOGY.md` §0), the user cannot fabricate a compliant partner. Real-call mode (paste a transcript of an actual conversation) is available for higher mastery.

**The defining difference from sales:** everyday conversation is a **balance**, roughly 50/50. In sales, the rep should talk *less* than the prospect. In everyday conversation, asking too much is an interrogation and sharing too much is self-absorption. The magic is making the other person feel interesting *while also* being interesting yourself. Almost every signal below is a **band**, not a floor.

## 1. Skill tree

Nodes: `id`, `name`, `objective`, `prerequisites`. Tags mark reuse: [S] = shares DNA with sales, [PS] = borrows from public speaking, [E] = new to everyday.

### Tier 0: Foundations
- `EF1` Presence and Warmth [E]. Objective: show up open, warm, and unhurried, with genuine interest visible. Prereqs: none.
- `EF2` Openers [E]. Objective: start a conversation naturally and low-pressure. Prereqs: none.
- `EF3` Social Ease [E]. Objective: manage social anxiety so you are easy to talk to. Prereqs: none.

### Tier 1: Curiosity (asking) [mostly S]
- `EC1` Open Questions [S]. Objective: ask open questions, not yes/no. Prereqs: EF2.
- `EC2` Follow-Up Depth [S]. Objective: build on their answer and go a level deeper on the same thread instead of topic-hopping. Prereqs: EC1.
- `EC3` Spotlight on Them [E]. Objective: make it about them; show genuine curiosity so they feel interesting. Prereqs: EC1.
- `EC4` Escape Interview Mode [E]. Objective: blend questions with sharing so it never feels like an interrogation. Prereqs: EC1.

### Tier 2: Listening
- `EL1` Active Listening [E]. Objective: show you heard them; reflect or acknowledge before you add. Prereqs: EC1.
- `EL2` Build On It [S]. Objective: take what they said and add to it ("yes-and"), connecting rather than resetting. Prereqs: EL1.
- `EL3` Reading the Room [E, text-hard]. Objective: notice interest, energy, and disengagement, and adjust. Prereqs: EL1.

### Tier 3: Being interesting (when you do talk) [mostly PS]
- `EB1` Specific Stories [PS]. Objective: tell concrete, vivid, short stories instead of vague summaries. Prereqs: EF1.
- `EB2` Reciprocity and Openness [E]. Objective: share something real about yourself so it is a two-way exchange, not an interview. Prereqs: EC4.
- `EB3` Playfulness [E]. Objective: use lightness and playful banter. Prereqs: EF1.
- `EB4` Warmth in Voice [PS]. Objective: warm, varied tone (not monotone, not flat). Prereqs: EF1.

### Tier 4: Flow
- `ED1` Balance and Turn-Taking [S]. Objective: keep talk time roughly even; neither dominate nor go silent. Prereqs: EC4, EB2.
- `ED2` Threading and Callbacks [E]. Objective: pick up earlier threads and call back to them. Prereqs: EL2.
- `ED3` Small Talk to Real Talk [E]. Objective: move gracefully from surface to something that matters. Prereqs: EC2, EB2.

### Tier 5: Integration
- `EI1` Full Conversation [E]. Objective: hold a genuine, flowing conversation with a new person for several minutes. Prereqs: ED1, ED3.
- `EI2` Self-Review [E]. Objective: critique your own recorded conversation against the rubric. Prereqs: EI1.

### Prerequisite edges
```
EF2->EC1, EC1->EC2, EC1->EC3, EC1->EC4, EC1->EL1,
EL1->EL2, EL1->EL3,
EF1->EB1, EC4->EB2, EF1->EB3, EF1->EB4,
EC4->ED1, EB2->ED1, EL2->ED2, EC2->ED3, EB2->ED3,
ED1->EI1, ED3->EI1, EI1->EI2
```

### Why this ordering
Curiosity and listening come before "being interesting," because people feel connection first from being *heard*, not from being impressed (Carnegie's core claim, and the question-asking research showing follow-up questions raise likability). Reciprocity is gated after curiosity so learners do not skip straight to talking about themselves. Balance and flow integrate the halves last.

## 2. Rubric-signal library

Same philosophy as the other packs: content-couple every signal, use **band** thresholds (this mode is almost all bands), and mandate quoted evidence. Tags show origin.

### Reused from sales [S] (recontextualized for conversation)
| id | measures | detection | threshold | notes |
|---|---|---|---|---|
| `SIG_OPEN_Q_RATE` | quality of curiosity | count YOU open questions (what/how/why/tell me) | `>= 3` per conversation, but see interview cap | quality over count here |
| `SIG_FOLLOWUP_DEPTH` | going deeper | a probing chain of `>= 2` levels on one thread (reuse of sales SIG_REAL_WHY) | present | each level references their prior answer |
| `SIG_TALK_LISTEN` | balance | YOU words / total | **`between 0.40 and 0.60`** | the band is the point; sales was 0.30-0.45 |
| `SIG_MONOLOGUE` | not rambling (FAIL) | longest YOU turn word count | `< 120` | diagnostic |

### Reused from public speaking [PS]
| id | measures | detection | threshold | notes |
|---|---|---|---|---|
| `SIG_SPECIFICITY` | vivid sharing | concrete named detail when YOU tell a story | `>= 1` per story you tell | makes you interesting |
| `SIG_STORY_SPINE` | a real story | setup, turn, resolution when YOU share an anecdote | present when a story is attempted | short is fine |
| `SIG_FILLER_RATE` | ease | fillers per 100 words | `< 5 / 100` | looser than speaking; conversation is relaxed |
| `SIG_WARMTH` | tone (annotated, text-hard) | warm markers, varied delivery, not flat | present | self-marked; proxied by variety |

### New to everyday [E] (the reciprocity and connection layer)
| id | measures | detection | threshold | gaming vector | resistance check |
|---|---|---|---|---|---|
| `SIG_SPOTLIGHT` | making it about them | share of YOU turns that engage the PARTNER's world (their answer, their story) vs about yourself | **`between 0.40 and 0.70`** | ask endless questions | above 0.70 trips `SIG_INTERVIEW_MODE`; below 0.40 is self-absorbed |
| `SIG_INTERVIEW_MODE` | interrogation (FAIL) | `>= 3` consecutive YOU turns that are questions with zero self-disclosure | must NOT fire | n/a | diagnostic; this is the classic beginner failure |
| `SIG_BUILD_ON` | connective listening | YOU turn references a specific detail from the PARTNER's immediately prior turn (not a topic switch) | majority of turns build on | generic "nice, and..." | must quote the specific detail carried forward |
| `SIG_RECIPROCITY` | two-way exchange | at least one genuine self-disclosure by YOU (a real share, not a question) | `>= 1` | a throwaway "me too" | must be a substantive share, quoted |
| `SIG_LISTENING_MARKER` | showing you heard | YOU acknowledge or reflect the PARTNER's point before adding | present on `>= 2` turns | robotic "I hear you" | must reference their actual content |
| `SIG_WARM_OPEN` | strong opener | YOU start with a natural, warm opener (not a canned line or an immediate ask) | present | canned line | must connect to context |

**Signal trust (per §0):** server-verified by parsing (no inference): `SIG_TALK_LISTEN`, `SIG_OPEN_Q_RATE`, `SIG_MONOLOGUE`, `SIG_INTERVIEW_MODE`, `SIG_FILLER_RATE`. Client-judged (semantic, coach-not-certifier, trustworthy only under roleplay or real-conversation mode): `SIG_FOLLOWUP_DEPTH`, `SIG_SPOTLIGHT`, `SIG_BUILD_ON`, `SIG_RECIPROCITY`, `SIG_LISTENING_MARKER`, `SIG_SPECIFICITY`, `SIG_STORY_SPINE`.

## 3. Diagnostic (placement)

A short probe that places the learner (engine `start_diagnostic`):
1. The partner gives a one-line opener ("Ugh, what a week"). Score `SIG_WARM_OPEN`, `SIG_OPEN_Q_RATE`. Weak here places at `EF2`/`EC1`.
2. The partner mentions a surface fact ("I just got back from Japan"). Score `SIG_FOLLOWUP_DEPTH`, `SIG_SPOTLIGHT`, `SIG_BUILD_ON`. Weak places at `EC2`/`EC3`.
3. A stretch of pure Q&A. Score `SIG_INTERVIEW_MODE`, `SIG_RECIPROCITY`. Firing/absent places at `EC4`/`EB2`.
4. An opening for a story from YOU. Score `SIG_SPECIFICITY`, `SIG_STORY_SPINE`. Weak places at `EB1`.
Placement = earliest tier with a failing probe; strong conversationalists start near flow, not at hello.

## 4. Worked example: `EC3` Spotlight on Them, unit `EC3.d1`

```
unit_id: "EC3.d1"
skill_id: "EC3"
title: "Make them the interesting one"
principle: "People do not remember the person who was interesting. They remember the person who made THEM feel interesting. When they hand you a surface fact, go one level into what it meant to them, not to a new topic."
why: "One good follow-up that makes it about them beats ten facts about you. It is the fastest way to be someone people want to keep talking to."
exemplar:
  strong: "PARTNER: I just got back from Japan. YOU: What made you pick Japan? PARTNER: honestly I needed to disappear for a bit. YOU: that sounds like it was about more than the trip. What were you disappearing from?"
  weak: "PARTNER: I just got back from Japan. YOU: Nice, I went to Thailand last year, the beaches were incredible."
drill:
  instructions: "Roleplay a 2 to 3 minute conversation with someone you just met. When they hand you a surface fact, follow up to make it about them, twice, before you share anything about yourself."
  input_format: "labeled_transcript"
  target_length: "2 to 3 minutes"
rubric:
  criteria:
    - { signal_id: "SIG_FOLLOWUP_DEPTH", threshold: {op: ">=", value: 2}, must_pass: true,  weight: 0.4 }
    - { signal_id: "SIG_SPOTLIGHT",      threshold: {op: "between", value: [0.4, 0.7]}, must_pass: true, weight: 0.3 }
    - { signal_id: "SIG_INTERVIEW_MODE", threshold: {op: "==", value: 0}, must_pass: true, weight: 0.3 }
  pass_rule: "all must_pass true AND weighted_score >= 0.7"
mastery: { passes_required: 2, distinct_sessions: true, clean_pass_required: true }
prerequisites: ["EC1"]
estimated_minutes: 8
```

Sample attempt (roleplay; PARTNER lines generated by the client, YOU by the user):
```
PARTNER: I just moved here from Denver, actually.
YOU: Oh nice. What pulled you out of Denver?
PARTNER: honestly a breakup. Needed a clean slate.
YOU: that takes guts, moving cities for a reset. What has surprised you most about starting over here?
PARTNER: how much lighter I feel, weirdly.
YOU: I get that. I did a smaller version of it a couple years ago and the lightness was the part nobody warned me about.
```

Client verdict to `submit_attempt`:
```
{
  "unit_id": "EC3.d1", "attempt_id": "att_e1",
  "criteria": [
    { "signal_id": "SIG_FOLLOWUP_DEPTH", "measured_value": 2, "threshold": {"op":">=","value":2},
      "pass": true, "evidence": "What pulled you out of Denver? ... What has surprised you most about starting over" },
    { "signal_id": "SIG_SPOTLIGHT", "measured_value": 0.66, "threshold": {"op":"between","value":[0.4,0.7]},
      "pass": true, "evidence": "3 of the first 4 YOU turns are about the partner" },
    { "signal_id": "SIG_INTERVIEW_MODE", "measured_value": 0, "threshold": {"op":"==","value":0},
      "pass": true, "evidence": "the final YOU turn reciprocates with a share, breaking the question chain" }
  ],
  "overall_pass": true, "overall_score": 0.93,
  "coach_notes": "Two clean follow-ups that went into meaning, not new topics, and you reciprocated at exactly the right moment instead of interviewing. Next time, one playful line would lift it further."
}
```

Server processing (no inference): outstanding unit matches; must_pass signals present; server recomputes `SIG_INTERVIEW_MODE` and `SIG_TALK_LISTEN` by parsing turns; evidence spans are substrings of the transcript; record pass 1 of 2, `distinct_sessions` keeps `EC3` in_progress. A second clean pass masters `EC3` and moves the learner toward `EC4` and the reciprocity tier.

## 5. What carries over (answer to "can we reuse public speaking?")
- **From public speaking:** `SIG_SPECIFICITY`, `SIG_STORY_SPINE`, `SIG_FILLER_RATE`, and warmth/delivery. These power Tier 3 ("being interesting when you talk"), roughly a third of the mode.
- **From sales:** `SIG_OPEN_Q_RATE`, the follow-up-depth chain (sales `SIG_REAL_WHY`), `SIG_TALK_LISTEN`, `SIG_MONOLOGUE`. These power the questioning and listening core, the larger share.
- **New to everyday:** the reciprocity/balance/spotlight layer (`SIG_SPOTLIGHT`, `SIG_INTERVIEW_MODE`, `SIG_BUILD_ON`, `SIG_RECIPROCITY`, `SIG_LISTENING_MARKER`), which is exactly what neither other mode has and what Yoodli does not do at all.

## 6. Freeze and next steps
- Ready to author full units against (Phase 2) and serve through the engine (Phase 3). Three skill packs now share one engine: sales, public speaking, everyday.
- Highest-value red-team target: `SIG_SPOTLIGHT` and `SIG_INTERVIEW_MODE` bands (a user could game "about them" with shallow questions). The roleplay persona brief must make the partner disengage under interrogation so the band maps to real connection.
- Sourcing reminder: author full content from the public canon and first principles; quarantined transcripts stay out of it.
