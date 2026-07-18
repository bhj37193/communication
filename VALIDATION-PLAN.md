# VALIDATION-PLAN: B2B/SMB sales-coaching demand test (before building)

Rewritten 2026-07-03 after the go-to-market decision (see primer.md DECISION and
DECISION-BRIEF-FOR-FABLE.md). Supersedes the old consumer voice-demo plan.

Purpose: prove a budgeted buyer will commit BEFORE writing code. This is a 4-week
outbound intent-capture sprint run entirely through the founder's own selling, the one
growth channel fully under his control and the one that uses his actual edge. No dollars
taken (F-1 intent-capture mode). If it clears, build B2B. If not, fall back to the
battle-mode consumer smoke test, then decide. No em-dashes anywhere.

## Two gates before you start (non-negotiable)
1. **Immigration / F-1.** Confirm with immigration counsel that non-binding intent-capture
   OUTBOUND (selling a pilot, collecting LOIs, taking NO money) is permissible on F-1. Take
   zero dollars until CPT/OPT clears.
2. **Course TOS / IP.** Confirm the Matt Ryder + Vinh Giang purchase terms do not prohibit
   building a competing product. The corpus is clean on copyright (PEDAGOGY-IP-AUDIT.md);
   contract is the open risk.

## What you are testing
Not "is the tech possible" (it is). Not "does anyone want AI communication coaching" (B2B
buyers demonstrably pay: Hyperbound hit $1M ARR fast, Second Nature raised $38M). The one
unknown: **will SMB sales teams (5-30 reps) with a credit-card budget commit to a
self-serve-priced ($49-99/seat) AI cold-call sparring tool with verified scoring**, sitting
as a cheaper wedge under the enterprise incumbents.

## What you build (almost nothing)
No engine, no app. Just enough to sell the promise:
1. **A one-page site:** the promise ("AI cold-call sparring with verified, not vibes-based,
   scoring"), who it is for, a way to book a call.
2. **A short Loom demo** walking the existing spec/mockups (result card, deterministic
   score, resistant-prospect roleplay). A mock is fine; it is a sales aid, not a product.
3. **An LOI template:** non-binding, $49/seat, with named seat count + intended start date.

## The sprint (4 weeks)
- **Hand-target 300-500 sales leaders** at companies with 5-30 SDRs/AEs (agencies,
  insurance, SaaS SDR teams, recruiting/staffing firms). Personalized outbound, not a blast.
  (Note: 300-500, not 200. Booking 15 meetings needs volume; cold outbound books ~1-5%.)
- Offer a 20-minute look at "AI cold-call sparring with verified scoring."
- **Every discovery call has one goal:** a signed non-binding LOI at $49/seat for a pilot
  cohort, with named seat count and a start-date intent.
- **Log every objection verbatim.** The objection PATTERN is the most important output,
  more than the LOI count.

## Pre-registered thresholds (set NOW, do not move later)
- **Booking:** >= 15 discovery calls booked (from 300-500 emails). Below ~8, the wedge
  message is not landing: rewrite the message ONCE, then kill. Judge the wedge on meeting
  quality and objections, not booking rate alone.
- **Commitment:** >= 5 signed LOIs covering >= 40 total seats (~$2k/mo of committed intent).
  An LOI is a SOFT signal (people sign and do not honor, and F-1 blocks a binding deposit),
  so weight it as one, not as revenue.
- **Objection audit (the real verdict):** if > 50% of the no's are "we already do this"
  (Gong call reviews, manager ride-alongs, an existing tool), treat that as a MARKET
  verdict, not a copy problem. This is the true kill condition.

## Decision rule
- **PASS** (booking + commitment clear AND the objection audit is NOT dominated by
  incumbent-satisfaction): build the B2B product on work-authorization clearance; the LOI
  signers are your pilot cohort.
- **FAIL:** run the pre-registered battle-mode consumer smoke test (below) for 2 weeks
  before considering any build.
- Under **no** outcome build consumer individual coaching (Option C, dropped).

## The fallback: battle-mode consumer smoke test (only if B2B fails)
2 weeks, near-zero cash. A landing page + 3-5 short organic clips of the battle "reveal"
(the head-to-head result card), posted to the everyday/dating-adjacent social lanes.
Flip-to-consumer signal (the one thing B2B cannot offer: free distribution): clips
repeatedly clearing ~100k views with no paid spend, or ~2,000+ organic waitlist signups.
If that fires, reconsider the consumer battle game (BATTLE-MODE-CONCEPT.md). If not, the
honest read is that neither the consumer battle nor this B2B framing pulled; rethink the
wedge or the segment rather than build.

## Cost and time
- Cost: ~$100-300 (email tooling, domain, one-page site, Loom). No paid acquisition.
- Time: ~1 week to set up, 4 weeks to run. The selling IS the work, and it is the founder's
  edge, which is the whole reason this path was chosen.

## The founder-motivation gut-check (do this once, honestly)
The decision to sell "the boring thing" is right on the numbers, but sustained motivation
is a real execution input for a solo founder grinding 12+ months alone. Before committing:
can you run outbound sales of this for a year without burning out? If yes, B2B is
unambiguous. If the honest answer is no, run the battle smoke test in parallel during the
same 4 weeks and let BOTH the numbers and your energy inform the call. This is an input on
durability, not a license to run two products.

## Why this order
Building before a budgeted buyer commits is the single most expensive mistake available.
The design is done; spending months building for a buyer who coaches by ride-along is the
trap. Days of outbound now, months saved later. And unlike the old consumer demo, this test
runs on the founder's actual strength and produces a real willingness-to-pay signal, not a
curiosity signal.
