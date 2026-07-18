# PRICING AND ECONOMICS (decision note)

Status: decided 2026-07-03. Supersedes the $12 assumptions in primer.md and prd.md
§1.6 / §11 for pricing and usage-cap purposes. Unit economics only; does NOT decide
whether the demand exists (that is VALIDATION-PLAN.md, still the gating next step).

No em-dashes anywhere (owner rule).

## Locked configuration

| Decision | Value | Rationale |
|---|---|---|
| Price | $15/mo (or annual = 2 months free = $150/yr, ~$12.50/mo effective) | Under Yoodli's $20 unlimited tier and Poised's ~$19; level-plus vs Orai $12; 3 modes + live adversarial roleplay + curriculum justify the premium |
| Usage cap | 40 voice-minutes per week (hard cost ceiling) | Cost scales with minutes, not calls; a weekly bucket bounds monthly COGS while feeling generous. 40 min/wk approx 173 min/mo |
| Daily rhythm | One-call nudge + streak (soft, not a wall) | Protects the daily-habit retention thesis (the #1 business risk). Weekly cap protects the wallet; daily nudge protects retention |
| Drill length | 5-min target `max_seconds` | Biggest single cost lever; cutting 8 to 5 min moves a heavy user ~$9/mo, more than a $12 to $19 price jump |
| Surface to user | "calls left this week", not raw minutes | Keeps the abundance / one-button feel; avoids anxious minute-rationing |

Cap comparison anchor: Yoodli's entry paid tier is 10 roleplays/week for $8
(approx 50 min/wk). 40 min/wk at $15 is competitive and healthier on margin.

## Cost basis

- AI all-in approx **$0.036 / voice-minute**: Deepgram Nova STT + Aura TTS + Haiku
  partner turns + amortized judge call, self-hosted LiveKit, 90% prompt-cache hit.
  (Derived from prd.md §11's $0.21-0.34 per 8-min call.)
- 5-min drill approx $0.18; realistic average usage approx 130 min/mo; power user at
  the 40-min/wk cap approx 173 min/mo.
- Blended gross ARPU **$14.25** (70% monthly $15 / 30% annual $12.50-equivalent).
- Stripe blended approx $0.63/mo. Refund + failed-payment reserve approx 4% (primer
  notes ~20% month-1 refunds; amortized over a ~7-month lifetime this is a ~3-4%
  revenue haircut).

## Per-user monthly profit

| Line | Realistic avg user | Power user (maxes 40 min/wk) |
|---|---|---|
| Gross blended ARPU | $14.25 | $14.25 |
| - Refund / failed-payment reserve (~4%) | -$0.57 | -$0.57 |
| = Net realized revenue | $13.68 | $13.68 |
| - Stripe fees (blended) | -$0.63 | -$0.63 |
| - AI / voice COGS | -$4.68 (130 min) | -$6.24 (173 min) |
| - Infra allocation (at scale) | -$0.15 | -$0.15 |
| **= Net profit per user / month** | **~$8.22** | **~$6.66** |
| **Margin (on gross ARPU)** | **~58%** | **~47%** |

Key result: with the 40-min weekly cap there is **no user who loses money**. The
worst case still nets ~$6.66 at ~47% margin. LTV per user approx $55-60 after ~13%/mo
consumer churn (~7-month lifetime).

## Bull / bear / realistic (monthly, steady-state snapshot)

Margin is structurally ~55-61% in all three. The only variable that moves is
subscriber count, which is the unvalidated distribution question.

| | Paying subs | Gross revenue/mo | AI+Stripe+infra | Net profit/mo | Margin | Annualized |
|---|---|---|---|---|---|---|
| BEAR | 4,000 | $57,000 | ~$23,400 | **~$31,300** | ~55% | ~$375k/yr |
| REALISTIC | 32,000 | $456,000 | ~$174,000 | **~$264,000** | ~58% | ~$3.2M/yr |
| BULL | 300,000 | $4,275,000 | ~$1,484,000 | **~$2,620,000** | ~61% | ~$31M/yr |

Bull is pre-headcount (300k subs implies hiring, not modeled). Bear uses slightly
worse cache efficiency + heavier per-user infra; bull uses better scale economics.

Excluded from these snapshots: CAC / marketing spend, and bull-case salaries. These
are operating margins on an existing subscriber, not a full company P&L.

## Marketing budget

Governing constraint: at $15 ARPU with LTV approx $55-60, the maximum sustainable CAC
for a healthy 1:3 LTV:CAC ratio is approx **$18-20**, payback approx 2.4 months at
$8.22/mo profit. Consumer paid acquisition typically runs $40-80+ per *retained*
subscriber, so **paid ads are almost certainly unprofitable at this price.** This is
the audit's core point: $15 cannot fund paid CAC; organic is the only affordable
channel and it is a 6-12 month grind.

Staged budget:

1. **Validation phase (now, pre-build):** approx **$0 paid.** Budget is the <$300
   validation infra (VALIDATION-PLAN.md) plus founder *time* posting daily content.
   Do NOT buy ads during validation: paid traffic contaminates the organic-pull
   signal you are trying to measure. The 30-day daily-posting test IS the marketing
   experiment.
2. **Early growth (post-validation, if it clears):** small experimental budget,
   approx **$500-2,000/mo**, used only to test whether ANY paid channel can hit
   CAC < $20-25. Expect most to fail at consumer price. Reinvest ~20-30% of
   contribution into growth experiments, capped by what organic + cheap paid absorb.
3. **The real "budget" is a distribution strategy, not a cash line:** short shareable
   clips (TikTok / Reels / Shorts), niche communities (r/sales, SDR groups,
   social-skills communities), and founder-led outreach. Founder-fit favors SALES
   outreach over consumer ad-buying, which again points at the SMB-seat option below.

## Escape hatch if per-user or absolute earnings feel too thin

The unit economics are sound (~58% margin); absolute earnings are 100% a function of
subscriber count. If bear (~$31k/mo) is the likely landing zone and that is too little,
the fix is NOT a tighter cap (a cap only prevents losses, it cannot create earnings).
The fix is the audit's SMB pivot: same product sold as seats at $49-99, same ~$5 COGS,
approx $44 contribution per seat (5-9x consumer), lower churn, and it fits the founder's
sales ability. 4,000 SMB seats at $49 approx $170k/mo vs $31k/mo consumer.

## Open dependencies (unchanged)

These numbers assume the business runs; they do not clear the gates:
1. F-1 / immigration authorization before any revenue (intent-capture until cleared).
2. Delete quarantined transcripts in SOURCE-DO-NOT-SHIP/.
3. VALIDATION-PLAN.md demand test decides whether to build at all.
