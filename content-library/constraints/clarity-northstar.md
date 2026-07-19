# The second north star: the message actually landed

Connection is one half of communication (`connection-northstar.md`). The other half is
independent of it: did the message you meant to send survive contact with the other
person, or did it get lost along the way? Charm without a landed message is noise. The
only question this half answers: DID THE MESSAGE LAND?

## What a landed message is (encode this in every layer)

1. It is COMPLETE. Every core point the speaker meant to make actually reached the
   listener, not diluted into a vaguer nearby idea. Losing the specific number, the
   specific date, the specific ask is losing the message, even if the general vibe got
   through.
2. It is UNCLUTTERED. Filler, hedging, and throat-clearing are where messages go to die.
   The listener has to extract the point from the noise; every hedge is a chance for the
   point to get dropped.
3. It is PACED to be heard. A single 200-word run-on is as hard to absorb as a string of
   three-word fragments. Sentences sized for a listener to actually track, not too short to
   be choppy, not too long to lose the thread.
4. It STAYS ON THE POINT. A message that wanders into an unrelated tangent mid-delivery
   makes the listener do the work of finding the thread again, and often they don't.

## The paradox (the feedback must name it out loud when it happens)

Confidence is not volume or polish, it's economy. The person who says the hard thing in
one plain sentence reads as more capable than the person who circles it for a paragraph.
Over-qualifying a point to sound careful usually reads as sounding unsure of it.

## How this governs each layer

- SKILLS are framed as "did this land or get lost". Their failure modes are delivery
  failures: burying the point, hedging it away, rambling past it, drifting off it.
- SCENARIOS in this family are explaining or persuading, not rapport-building: there is a
  specific message to deliver, authored as `key_points`, and the scenario succeeds or
  fails on whether those points reached the listener, not on how the character felt.
- THE SCORE stays deterministic and server-side, same discipline as connection: no model
  ever grades whether a message landed. Countable proxies, recomputed by the validator:
  key_points_share, filler_ratio, avg_sentence_length, hedge_count, rambling, off_topic.
- THE FEEDBACK names which key point landed and which got lost, quoting the moment it
  either arrived clearly or got buried. The fix is always the single highest-leverage cut:
  the hedge to drop, the tangent to skip, the point to say first.
