# Avatar tier: pricing, cost, and free trial

Premium tier of the charisma communication app: a live, lip-synced avatar you talk to
(push-to-talk, interruptable). This sits ABOVE the free/cheap text-chat core (PRD-CHARISMA-
CHAT.md), which stays fixed-cost and privacy-first. This tier is deliberately variable-cost
(managed per-minute vendors), covered by its price. No em-dashes.

## 1. Interaction and latency (from the spec)
- Push-to-talk; pressing to talk instantly cancels the avatar's current speech (barge-in via
  the press, so no open-mic echo cancellation needed).
- Target feel ~500 to 800ms voice-to-voice. 170ms is the avatar-render slice, not the round
  trip. Sub-200ms end-to-end is not physically possible over the internet.
- Scoring is unchanged: the deterministic validator runs on the transcribed text per turn, so
  the moat is untouched.

## 2. Cost basis (cheap rendering-only path)
To have a defensible minimum price, take the rendering-only vendor path (render the face,
bring your own voice + LLM). Bundled vendors (HeyGen Full, Tavus) run ~$0.10 to $0.21/min,
about 10x more, and are out of scope for the minimum.

| Component | Per connected minute |
|---|---|
| Avatar render (Simli-class, continuous) | ~$0.009 |
| TTS (avatar speaking ~half the time) | ~$0.010 |
| STT (user speaking ~40%) | ~$0.002 |
| LLM (Haiku, 1 to 2 turns) | ~$0.003 |
| **All-in** | **~$0.024, use ~$0.03/min for safety** |

Sources: Simli/HeyGen/Tavus per-minute comparisons (2026). Confirm live vendor rates before
launch; they move.

## 3. The cap principle (non-negotiable)
Per-minute cost means an uncapped tier has unbounded cost: one daily-10-minute user costs
~$9 to $10/month. **There is no minimum price without a minute cap.** The price is a function
of the cap.

At ~$0.03/min all-in, including Paddle fees (~5% + $0.50) and a ~4% refund reserve:

| Monthly cap | COGS/mo | Breakeven (zero profit) | Sane price (~70% margin) |
|---|---|---|---|
| 30 min | $0.90 | ~$1.70 | ~$5 |
| 60 min | $1.80 | ~$2.70 | ~$6 to $7 |
| 120 min | $3.60 | ~$4.70 | ~$12 |
| 300 min | $9.00 | ~$10.60 | ~$30 |

## 4. Decision: price and cap
- **Price: $14.99/month, cap 120 minutes/month** (about 4 minutes/day). Annual $119/year
  (about 2 months free).
- At 120 min the all-in COGS is ~$3.60, so margin is ~76% at $14.99. A heavy user who maxes
  the cap still nets positive.
- The cap is surfaced to the user as "avatar minutes left this month", not raw seconds, to
  keep it feeling generous. Text chat stays unlimited-and-free underneath; the cap is only on
  avatar minutes.
- Absolute floor if you ever want the cheapest possible tier: ~$5/month at a 60 to 90 minute
  cap. Do not go below that, and never offer an uncapped avatar tier.
- **Billing trust (from competitive research, the #1 category complaint):** lead with monthly,
  do NOT force an annual upsell during onboarding, show a visible in-app cancel (<=2 taps), and
  send a pre-charge reminder before the trial converts or the sub renews. The $60 to $100/year
  band is where competitor reviews concentrate "scam/refund" language; our annual $119 sits
  above it, so it is only defensible with transparent billing and an avatar that delivers.
  See PRD section 11.1.

## 5. The 15-minute free trial
- **Every new user gets 15 avatar-minutes free, once.** Enough to feel the live-conversation
  aha; small enough to bound cost.
- **Trial cost:** 15 min x ~$0.03 = **~$0.45 per trial user**, including those who never
  convert. That is the customer-acquisition cost of this tier. At even a 15% trial-to-paid
  conversion, that is ~$3 per acquired subscriber, which is excellent for a $14.99 product.
- **Hard stops (required, or the trial is farmable):**
  1. One trial per verified account (Clerk identity), not per anonymous session.
  2. Device + payment fingerprint to block trial farming across throwaway accounts.
  3. A hard 15:00 minute meter with a server-side circuit breaker: at 0:00 remaining, the
     avatar stream ends mid-session with a clean "trial over" state, it does not overrun.
  4. No repeat trials, no trial reset. Expired trial routes to the paywall.
- **At trial end:** show the paywall in context ("your 15 minutes are up, keep going for
  $14.99/month"), and drop the user back to the free text chat so they are not shut out of the
  product, only out of the avatar.

## 6. Cost levers (drive the floor lower later)
- **Render the avatar only while it speaks**, not during the user's turn or thinking. With
  push-to-talk this is natural and cuts avatar minutes ~40 to 50%, dropping COGS toward
  ~$0.015 to $0.02/min. Apply this before considering any price cut.
- **Self-host voice later** (Parakeet STT + Kokoro TTS at a scale trigger) removes the
  ~$0.012/min voice portion, leaving mostly the ~$0.009/min avatar render.
- **Self-host the avatar** is the endgame for true fixed cost, but real-time lip-sync on
  owned GPUs is hard and high-latency today. Stay on the managed vendor until volume clearly
  justifies the GPU build, same discipline as the LLM swap.

## 7. Guardrails (build these with the tier, not after)
- Per-user hard minute cap enforced server-side, metered from a usage table (not client).
- A global daily avatar-spend circuit breaker, so a bug or abuse cannot run up an unbounded
  vendor bill.
- The avatar vendor sits behind a provider interface (like ChatModel), so you can switch
  vendor or self-host without touching call sites, and the interface must expose a fast
  interrupt/cancel call (<200ms) for the barge-in to feel instant.
- Honest privacy copy for this tier: avatar video streams through a third-party vendor, so it
  cannot make the text core's "retained nowhere" claim. Say so plainly.
