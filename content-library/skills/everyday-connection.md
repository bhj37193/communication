# Skill: everyday-connection [FULL]

id: everyday-connection
status: FULL (the loop being tested now)
serves: unit `everyday.followups.housewarming-sam` (unit skill_id `followups` drills the
core move of this skill; the skill is the umbrella, the unit is one rep of it)

## Principle

People connect with the person who makes them feel heard, not the person who impresses
them. The follow-up question, not the first question, is what does it.

## WHY-IT-CONNECTS

A first question can be pulled from a list. A follow-up cannot: it only exists because
you listened to the answer. That is why it lands as proof of attention, and why the
question-asking research finds follow-ups specifically (not question count) raise how
much people like you. The follow-up says "what you just said mattered enough to stay on."

But questions alone are not connection. Connection is mutual: after they share something
real, you give one real thing back, then return the spotlight. Curiosity with no
self-disclosure is an interrogation. Self-disclosure with no curiosity is a monologue.
The skill is the braid: open question, follow-up on the actual answer, a short real
share, back to them.

Flattery is the counterfeit: "that's so cool!" costs nothing, proves no listening, and
does nothing. The character's warmth encodes this. So does the score.

## Observable signals (validator ids, band thresholds)

Bands, not floors: overdoing a behavior fails as surely as underdoing it.

| signal_id       | band            | hard | what it observes                                        |
| --------------- | --------------- | ---- | ------------------------------------------------------- |
| followups       | min 2           | yes  | messages that build on the character's previous answer  |
| open_questions  | min 2, max 6    | yes  | open questions (what/how/why...), capped so it never becomes a quiz |
| interview_mode  | max 0           | yes  | any run of 3+ consecutive questions with zero self-disclosure |
| monologue_brag  | max 0           | yes  | any message over 60 words, or an evidence-backed brag   |
| spotlight_share | 0.4 to 0.7      | soft | share of your messages about them; below 0.4 is self-focus, above 0.7 is interrogation drift |
| reciprocity     | min 1           | soft | a real self-share after they opened up (warmth >= 2)    |
| final_warmth    | scored, no band | -    | how heard they felt by the end, 0 to 3                  |

## What connection this skill produces

A guarded stranger becomes someone who wants to keep talking to you. They volunteer the
thing they never lead with, ask you a real question back, and leave the conversation
remembering how it felt to be listened to. That is the whole product in one rep.

## Failure modes

- INTERROGATION: stacked questions, zero self-disclosure. Feels like a job interview.
  Trips `interview_mode`, and the character starts answering shorter.
- MONOLOGUE: one message that takes the floor and keeps it (60+ words, or a brag with
  receipts in your own words). Trips `monologue_brag`; the character checks out.
- FLATTERY: compliments with no follow-up. Neutral by design: warmth does not move,
  which is its own feedback.

## Go deeper

library/talks.md: Headlee (10 ways), Huang et al. (follow-up likability), Aron (why
mutual escalation works and question banks do not).
