# BATTLE MODE CONCEPT (product direction note)

Status: proposed 2026-07-03. A consumer-first reshaping of Cadence. Does NOT replace
prd.md's engine; it wraps it. Pairs with PRICING-AND-ECONOMICS.md. Still gated behind
the same open items (F-1, delete transcripts, validation) before any build/revenue.

No em-dashes anywhere (owner rule).

## The core idea (corrected)

NOT human-to-human. Every player talks only to an AI. A "battle" is a SCORE RACE:
two players get the SAME scenario, each has their own private ~5-min call with the AI
partner, the deterministic validator scores each, higher score wins. The "versus" is
on the scoreboard, not in the room. Think chess.com against a ghost, or a Tetris
score battle, not Omegle.

## Why this shape is strong

- **No safety/moderation problem.** No human ever hears another human. The single
  scariest liability of multiplayer voice disappears entirely.
- **The pedagogy moat survives intact.** Each call is still a controlled AI drill
  scored by the deterministic validator (countable signals + evidence-checked judge).
  The battle just compares two validator outputs. Curriculum, anti-gaming, mastery
  engine all keep working. Competition is a thin shell on the existing engine.
- **Fairness is nearly free.** Same scenario, same persona, same rubric. The validator
  already scores the USER's own behavior (did you ask 5 open questions, keep talk ratio
  down), not "did you beat the AI," so divergent conversations still compare
  apples-to-apples on objective signals. Hard to cry "the AI was biased" when the score
  is mostly arithmetic on your own transcript.
- **Async, so liquidity is easy.** Play now, get matched against someone who played this
  scenario earlier, or a stored "ghost" run. No need for two people online at once. The
  classic multiplayer cold-start problem mostly dissolves.
- **Cheap.** A battle is just two normal ~$0.15-0.18 drills compared. No new engine, no
  extra spend, no TTS-heavy human-vs-human plumbing.
- **Small build.** Matchmaking + score comparison + win/loss + ELO on top of the
  existing single-player loop. Weeks, not months, over the core.

## Two-track architecture

| Track | Purpose | Scenario source | Feel |
|---|---|---|---|
| **Training (vs AI)** | Personalized coaching; the mastery engine picks your next drill | `next_unit(user_state, mode)` (prd.md §5.3) | Safe, private, no pressure |
| **Ranked arena (battle)** | Competition, virality, retention | Shared rotating battle scenario, same for both players | Competitive, shareable, ELO ladder |

Training makes you better; the arena is where you prove it and where growth comes from.
The two tracks share one engine but run on separate scenario logic (arena scenarios
rotate on their own ladder, not off your personal progression).

## The battle loop

1. Player taps Battle. Matched (by ELO) against an opponent who played the current
   battle scenario, or a stored ghost run at similar rank.
2. Both get the SAME scenario brief and AI persona.
3. Each plays their own private ~5-min call (hard cap at 5:00), barge-in on.
4. Validator scores each call identically (per-speaker countables + evidence-checked
   judged signals).
5. **The reveal** (see below): head-to-head result, winner declared, ELO moves.
6. Paywall / rematch / share prompts land here at peak desire.

## The reveal (the #1 virality lever)

A score race is more abstract than a face-off, so the reveal is where this lives or
dies. It must be juicy and clippable, not "87 vs 62" on a plain card. Show:
- Your best line vs their best line (verbatim quotes from each transcript).
- Signal-by-signal head-to-head bars ("you: 6 open questions / them: 3").
- A clear WIN/LOSS animation + ELO delta.
- A one-tap share of the head-to-head card / clip.
This is now the top design problem. It is UX, not unsolved science.

## Scoring and fairness

- Reuse the deterministic validator unchanged. Each player scored on their own
  countable signals; the LLM judge only breaks ties / scores the holistic signal, with
  evidence quotes verified as today.
- Wrap in ELO/ranked so fairness is felt over many games, not one.
- Result card must FRAME the verdict as "we scored your skills," leading with the
  countable comparison, to pre-empt "we didn't play the same game" complaints.

## Async matchmaking and cold-start

- Ghost pool per scenario: store completed runs (transcript-light score profiles) and
  match against them when no live opponent fits.
- Seed the early pool with founder/beta runs and AI-generated benchmark performances at
  several skill tiers (disclose as bots at low ranks).
- ELO matching so players face similar-skill opponents from the first battle.

## Free-to-try and the paywall (decided)

Decision: **one full free battle**, not a hard paywall and not a 1-minute sliver.

- Hard-gating a viral product at $15 before anyone plays kills the viral loop (trying
  IS the viral act; cold conversion is ~0.1-1%). Do not do it.
- One minute is too short: it ends before the battle reveal, which is the actual hook.
- Give the complete first battle (call + result + win/loss reveal + share moment), then
  paywall at the point of maximum desire (right after the result).

**The free battle is CAC, not a leak.** At ~$0.15/battle vs $40-80 paid consumer CAC,
break-even conversion is under 1% over an LTV of ~$55. Illustrative:

| Step | Rate | Result |
|---|---|---|
| Views | - | 1,000,000 |
| View -> play | ~8% | 80,000 free battles = ~$12k cost |
| Play -> pay | ~3% | 2,400 subscribers |
| Monthly profit (at ~$8.22/user) | - | ~$20k/mo, pays back the $12k in < 1 month |

Even at 2% conversion this is strongly profitable. The number to validate is play->pay
staying above ~1-2%.

**Guard cashflow, not the loop.** If it spikes faster than revenue lands (1M plays =
~$150k up front), bound exposure without touching virality:
- Require email/phone signup (kills infinite free replays).
- Cap at one free battle per account.
- Daily free-battle spend ceiling that sheds load gracefully ("battles are full, back
  in an hour") on a spike.

This moves the model from paid-only (primer) to **freemium**. Paying-user economics in
PRICING-AND-ECONOMICS.md are unchanged; this only adds a bounded free-acquisition
funnel on top. Optional later: a small ongoing free tier (e.g., 1 free battle/day) if
the viral/habit loop needs feeding; monetize ranked/unlimited/coaching.

## Cost

- Per battle ~$0.15-0.18 (two 5-min AI drills compared; scoring is cheap).
- Paying-user cap (40 min/week, PRICING-AND-ECONOMICS.md) still bounds heavy users.
- Free battles are a bounded CAC line, not uncapped COGS.

## Revised validation test

The question changes from "will people practice with an AI daily" to a sharper,
falsifiable one: **will people play a battle, share the result, and come back to climb
rank.** Test the cheap way first:
- Single-player prototype (one AI scenario, 5-min cap, real result card).
- A manual/fake scoreboard reveal (you can hand-match against a stored run).
- Measure: play -> share rate, play -> replay rate, and the free -> pay conversion at
  the post-battle paywall.
Only build real ELO/matchmaking if the reveal makes people want to run it again and
post it. If they shrug at the reveal, better to know before building the ladder.

## Open questions / risks

1. Reveal design is unproven; it is the whole virality bet. Prototype it first.
2. Ghost-pool seeding needs enough runs per scenario; bootstrap carefully.
3. Freemium shifts the business model; revisit the paid-only assumptions in primer.md.
4. Moderation is gone, but abuse of the free tier (bot signups farming free battles)
   still needs signup friction + rate limits.
5. Privacy: battle result cards store opponent quotes; check this against the
   zero-retention posture (transcripts are already 60-day TTL, so likely fine, but
   confirm ghost runs are stored content-light).
