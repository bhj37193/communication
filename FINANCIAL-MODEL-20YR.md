# 20-Year Financial Model: 4-Skill Adult Training App

Produced by Fable 5 against FABLE-PROMPT-EMPIRE.md Part 1 (2026-07-19). Models the
4-skill pivot (Communication, Problem-Solving, Critical Thinking, Decision-Making,
final taxonomy per CONTENT-ROADMAP-4-SKILLS.md) of the existing charisma app: app-only,
mastery-gated, no physical location, no teachers, subscription SaaS. Unit economics
are inherited from AVATAR-TIER-PRICING.md and BUSINESS-MODEL-CONVERSION.md, not
re-derived. Every number in every output table traces to a named assumption in
Section 2 through the arithmetic in Sections 3 and 6. No em-dashes.

---

## 1. Inherited anchors (locked, not re-derived)

| Anchor | Value | Source |
|---|---|---|
| Text-chat core | Free, unlimited to users, abuse-capped | BUSINESS-MODEL-CONVERSION.md |
| Text COGS per challenge | ~$0.02 (Haiku, prompt-cached; PRD measures $0.012 to $0.020, $0.02 used for safety) | PRD-CHARISMA-CHAT.md 3.10 |
| Avatar tier price | $14.99/month, 120 avatar-minute cap | AVATAR-TIER-PRICING.md 4 |
| Annual plan | $119/year (about 2 months free) | AVATAR-TIER-PRICING.md 4 |
| Avatar COGS | ~$0.03/min all-in (render + TTS + STT + LLM) | AVATAR-TIER-PRICING.md 2 |
| Gross margin ceiling at cap | ~76% (user maxing all 120 minutes) | AVATAR-TIER-PRICING.md 4 |
| Free trial | 15 avatar-minutes once, ~$0.45 COGS per trial taker | AVATAR-TIER-PRICING.md 5 |
| Trial-to-paid conversion band | 10 to 15% (below ~10% acquisition underwaters) | BUSINESS-MODEL-CONVERSION.md, Trial economics |
| Payment processing | Paddle-class: ~5% + $0.50 per transaction | AVATAR-TIER-PRICING.md 3 |
| Refund reserve | ~4% of gross | AVATAR-TIER-PRICING.md 3 |

Conflict resolution (one line, as required): PRD-CHARISMA-CHAT.md 1.8 lists a
$9.99/month text subscription, but BUSINESS-MODEL-CONVERSION.md is the more recent
and more specific document and locks "text fully free, the avatar is the one
paywall," so this model has exactly one paid tier: the avatar at $14.99/$119.

Pricing held constant for all 20 years in all scenarios. No price increases are
modeled; this is a deliberate conservative simplification that roughly offsets the
equally unmodeled inflation in costs.

---

## 2. Assumption block (read this before any output table)

Three genuinely different worlds, not one curve with a multiplier. Bear is "the
product does not resonate and churn stays brutal." Conservative is "it works but
only at industry-median consumer-app funnel numbers." Realistic is "the 4-skill
breadth and the conversion moments in BUSINESS-MODEL-CONVERSION.md actually land."

### 2.1 Named assumptions, per scenario

| # | Assumption (name) | Bear | Conservative | Realistic | Basis |
|---|---|---|---|---|---|
| A1 | TAM (total addressable adults) | 40M | 60M | 100M | See derivation below |
| A2 | SIGNUP_M_Y1 (avg free signups/month, year 1) | 1,200 | 3,000 | 6,000 | Launch channel is organic short-form video plus the shareable score card (PRD 1.2), unfunded; 40 vs 100 vs 200 installs/day |
| A2b | INITIAL_SHARE (year-1 signups as share of TAM, the slice the launch channel actually reaches) | 14.4k/yr = 0.036% of 40M | 36k/yr = 0.060% of 60M | 72k/yr = 0.072% of 100M | Derived from A1 and A2; states plainly how thin the launch reach is |
| A3 | SIGNUP_GROWTH (YoY multiplier on monthly signup rate) | 1.3, 1.2, 1.1, 1.05, then flat years 6-10, then minus 3%/yr | 1.6, 1.45, 1.3, 1.2, then decaying 1.15 to 1.08 by year 10, 1.05 years 11-15, 1.02 years 16-20 | 1.8, 1.6, 1.4, 1.3, then decaying 1.25 to 1.10 by year 10, 1.06 years 11-15, 1.03 years 16-20 | Compounding word-of-mouth that decays toward saturation; checked against A1 in Section 7 |
| A4 | TRIAL_TAKE (share of signups who start the 15-min avatar trial) | 25% | 30% | 35% | The four conversion moments (BUSINESS-MODEL-CONVERSION.md) push trial starts after a win, not cold |
| A5 | TRIAL_TO_PAID | 10% | 12% | 15% | Locked 10-15% band from BUSINESS-MODEL-CONVERSION.md; realistic uses the top of the band on 4-skill breadth |
| A6 | CONV (signup to paying, = A4 x A5) | 2.5% | 3.6% | 5.25% | Derived, shown: 0.25x0.10, 0.30x0.12, 0.35x0.15 |
| A7 | CHURN_M (monthly paying churn) | 12% flat | 9% y1, 8% y2, 7% y3+ | 7% y1, 6% y2, 5% y3+ | Consumer subscription norms; improvement reflects 4-skill breadth and the retention levers in BUSINESS-MODEL-CONVERSION.md |
| A8 | MIX_MONTHLY (share of payers on monthly vs annual plan) | 80/20 | 65/35 | 70/30 | Monthly is led with by design (AVATAR-TIER-PRICING.md billing-trust rule); weak product = fewer annual commits |
| A9 | ARPU_NET (net revenue per payer per month, derived in 3.1) | $12.31 | $11.69 | $11.89 | Derived from price, mix, Paddle fees, refund reserve |
| A10 | FREE_LIFE (months an average free signup stays active) | 2.0 | 2.5 | 3.0 | Sets free MAU = FREE_LIFE x monthly signups |
| A11 | FREE_COGS (text COGS per active free user per month) | $0.24 y1, $0.28 y2, $0.32 y3+ | same | same | Skill rollout scaling, see 2.3 |
| A12 | PAYER_COGS (all-in COGS per payer per month) | $2.40 y1, $2.80 y2, $3.28 y3+ | same | same | Skill rollout scaling, see 2.3 |
| A13 | TRIAL_COGS | $0.45 per trial taker | same | same | Locked (AVATAR-TIER-PRICING.md 5) |
| A14 | PAID_SHARE (share of signups from paid ads) | 0% y1, 10% y2+ | 0% y1, 10% y2, 20% y3, 25% y4, 30% y5+ | same as conservative | Organic-first launch; paid layered in only after year 1 |
| A15 | CPI (cash cost per paid-channel signup) | $3.50 | $3.00 | $2.50 | Consumer-app install costs; worse product = worse ad efficiency |
| A16 | CAC_PAID (cash CAC per paying subscriber via paid channel, = A15/A6) | $140 | $83 | $48 | Derived, shown: 3.50/0.025, 3.00/0.036, 2.50/0.0525 |
| A17 | OPEX_FLOOR (fixed annual opex year 1, grows 3%/yr) | $100k | $120k | $150k | Founder pay + one Hetzner-class box + tools/legal + content contracting; you hire when revenue supports it, so there is no fantasy hiring schedule |
| A18 | OPEX_VAR (variable opex as % of revenue: support, content authoring, later hires) | 25% | 32% | 30% | Headcount scales with users through revenue, the honest proxy |
| A19 | TAX_RATE (effective, on positive EBIT only) | 25% | 25% | 25% | Placeholder blended corporate rate; confirm with a tax professional; no loss carryforward modeled (understates early after-tax recovery, i.e. conservative) |

### 2.2 TAM derivation (A1), method stated, not a bare guess

Estimation chain: roughly 1.5B adults are English-proficient worldwide (product is
English-first per PRD 1.2). Of those, the digitally active 18-45 core is roughly
800M. The share who currently use or would plausibly try a self-improvement or
skill-training app is anchored to observable comparables: Duolingo sustains 100M+
monthly actives for gamified skill training, and meditation/self-improvement apps
(Calm, Headspace class) hold tens of millions of actives combined.

- Realistic: 800M x ~12% self-improvement-app propensity = ~100M.
- Conservative: same base, stricter willing-to-engage filter (~7.5%) = 60M.
- Bear: English-first core markets only (US/UK/CA/AU, ~200M adults 18-45) x 20% = 40M.

These are order-of-magnitude planning numbers, not market-research citations; the
model's saturation check in Section 7 is what actually constrains growth.

### 2.3 COGS scaled to 4 skills, scaling assumption shown (A11, A12)

Skill rollout assumption (SKILL_ROLLOUT): year 1 ships Communication plus one new
skill; year 2 adds the third; year 3 completes all four. Usage scales with breadth:

- Free user text COGS: challenges/month x $0.02 per challenge.
  Year 1: 12 challenges x $0.02 = $0.24. Year 2: 14 x $0.02 = $0.28.
  Year 3+: 16 x $0.02 = $0.32 (more skills = more active days; the free cap stays
  one scored challenge per day, breadth raises days played, not challenges per day).
- Payer COGS: avatar minutes x $0.03 + their own text usage.
  Year 1: 72 min (60% of the 120-min cap) x $0.03 + $0.24 = $2.40.
  Year 2: 84 min (70%) x $0.03 + $0.28 = $2.80.
  Year 3+: 96 min (80%) x $0.03 + 20 challenges x $0.02 = $2.88 + $0.40 = $3.28.
  Utilization rises with breadth but never exceeds the cap, so per-payer COGS is
  bounded at $3.60 + text by construction (the cap principle, AVATAR-TIER-PRICING.md 3).
- Trial COGS: TRIAL_TAKE x signups x $0.45 every month, converters and
  non-converters alike.

---

## 3. Derived per-subscriber economics (arithmetic shown once, used everywhere)

### 3.1 Net ARPU per paying subscriber per month (A9)

Monthly plan, net of Paddle-class fees (5% + $0.50) and 4% refund reserve:

    $14.99 x (1 - 0.05 - 0.04) - $0.50 = $14.99 x 0.91 - $0.50
    = $13.64 - $0.50 = $13.14 net per month

Annual plan, one transaction per year, expressed per month:

    ($119 x 0.91 - $0.50) / 12 = ($108.29 - $0.50) / 12 = $107.79 / 12 = $8.98 net per month

Blended by plan mix (A8):

    Bear (80/20):         0.80 x 13.14 + 0.20 x 8.98 = 10.51 + 1.80 = $12.31
    Conservative (65/35): 0.65 x 13.14 + 0.35 x 8.98 =  8.54 + 3.14 = $11.69
    Realistic (70/30):    0.70 x 13.14 + 0.30 x 8.98 =  9.20 + 2.69 = $11.89

Note the honest quirk: bear has the HIGHEST per-month net ARPU because a
distrusted product gets fewer annual commitments and annual is discounted. Bear
still loses badly on lifetime value because churn dominates (Section 3.2).

Blended ARPU across ALL active users (free users contribute $0 by design, per
BUSINESS-MODEL-CONVERSION.md): revenue / total users. Realistic year 3 as the
reference point: $112,392 / 61,290 = $1.83 per active user per month. The free
tier is a cost center and a funnel, never a revenue line, and the model keeps
that explicit rather than hiding it inside an inflated blended number.

### 3.2 Unit economics at steady state (year 3+ COGS, mature churn)

    Payer gross profit/month = ARPU_NET - PAYER_COGS
    Expected paying lifetime = 1 / CHURN_M
    LTV (gross profit basis)  = gross profit x lifetime

| | Bear | Conservative | Realistic |
|---|---|---|---|
| Gross profit/payer/mo | 12.31 - 3.28 = $9.03 | 11.69 - 3.28 = $8.41 | 11.89 - 3.28 = $8.61 |
| Lifetime (months) | 1/0.12 = 8.3 | 1/0.07 = 14.3 | 1/0.05 = 20.0 |
| LTV | $75 | $120 | $172 |
| CAC_PAID (A16) | $140 | $83 | $48 |
| LTV / CAC | 0.5 | 1.4 | 3.6 |

Reading: paid acquisition is value-destroying in bear (a rational operator cuts it,
the model keeps the small spend to show the damage honestly), marginal in
conservative, and healthy in realistic. Organic acquisition costs ~$0.45 per trial
taker in COGS plus content-creation labor already inside opex, which is why every
scenario is organic-first.

### 3.3 Model mechanics (conventions, so the tables are reproducible)

- Monthly simulation for 240 months, reported annually. Within a year the monthly
  signup rate is constant at that year's value.
- Paying subscribers follow: P(next month) = P x (1 - CHURN_M) + signups x CONV.
- "Paying users" in tables is the average across the year's 12 months; year-end
  values appear in the worked example.
- "Total users" = free MAU (FREE_LIFE x monthly signups) + average paying users.
- Monthly revenue = average payers x ARPU_NET (fees and refunds already netted out).
- Monthly COGS = payers x PAYER_COGS + free MAU x FREE_COGS + trial takers x $0.45.
- Opex = OPEX_FLOOR (growing 3%/yr) + OPEX_VAR x revenue + paid marketing
  (PAID_SHARE x signups x CPI).
- Tax = 25% of EBIT when positive, zero otherwise, no carryforwards.
- All "monthly" columns are the average month of that year; "yearly" columns are
  the sum of the 12 simulated months.

---

## 4. Output tables

Prices in effect, all years, all scenarios: $14.99/month or $119/year (avatar
tier), text free. Monthly figures are average-month values for that year.

Note above the milestone rows, as required: years beyond 5 are directional
scenario illustrations built on compounding assumptions, not forecasts; no
assumption set survives 20 years of unmodeled market change untouched.

### 4.1 BEAR

| Year | Total users | Paying (avg) | Rev/mo | COGS/mo | GM$/mo | GM% | Opex/mo | EBIT/mo | After-tax/mo |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 2,530 | 130 | $1,602 | $1,023 | $579 | 36.1% | $8,734 | -$8,155 | -$8,155 |
| 2 | 3,383 | 263 | $3,240 | $1,786 | $1,454 | 44.9% | $9,939 | -$8,486 | -$8,486 |
| 3 | 4,090 | 346 | $4,253 | $2,542 | $1,711 | 40.2% | $10,559 | -$8,848 | -$8,848 |
| 4 | 4,519 | 401 | $4,932 | $2,864 | $2,069 | 41.9% | $11,060 | -$8,991 | -$8,991 |
| 5 | 4,758 | 434 | $5,343 | $3,051 | $2,292 | 42.9% | $11,472 | -$9,179 | -$9,179 |
| 10 | 4,775 | 450 | $5,545 | $3,104 | $2,440 | 44.0% | $13,016 | -$10,576 | -$10,576 |
| 15 | 4,108 | 394 | $4,852 | $2,690 | $2,162 | 44.6% | $14,468 | -$12,306 | -$12,306 |
| 20 | 3,527 | 339 | $4,167 | $2,310 | $1,857 | 44.6% | $16,212 | -$14,356 | -$14,356 |

Yearly rollups, bear:

| Year | Rev/yr | COGS/yr | GM$/yr | Opex/yr | EBIT/yr | Tax/yr | After-tax/yr |
|---|---|---|---|---|---|---|---|
| 1 | $19,228 | $12,281 | $6,947 | $104,807 | -$97,860 | $0 | -$97,860 |
| 2 | $38,879 | $21,433 | $17,446 | $119,272 | -$101,826 | $0 | -$101,826 |
| 3 | $51,037 | $30,504 | $20,533 | $126,712 | -$106,179 | $0 | -$106,179 |
| 4 | $59,190 | $34,367 | $24,823 | $132,719 | -$107,896 | $0 | -$107,896 |
| 5 | $64,116 | $36,609 | $27,507 | $137,661 | -$110,154 | $0 | -$110,154 |
| 10 | $66,535 | $37,254 | $29,281 | $156,192 | -$126,911 | $0 | -$126,911 |
| 15 | $58,226 | $32,281 | $25,944 | $173,614 | -$147,669 | $0 | -$147,669 |
| 20 | $50,001 | $27,721 | $22,280 | $194,547 | -$172,268 | $0 | -$172,268 |

Bear verdict: never covers even a $100k floor. Cumulative after-tax loss is about
$200k by end of year 2 and $524k by year 5. The 20-year rows exist to satisfy the
format; the rational read is: if measured churn is ~12%/month and signup-to-paid
is ~2.5% after 18 to 24 months of iteration, shut down or reposition. The table is
what happens if you refuse to.

### 4.2 CONSERVATIVE

| Year | Total users | Paying (avg) | Rev/mo | COGS/mo | GM$/mo | GM% | Opex/mo | EBIT/mo | After-tax/mo |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 8,015 | 515 | $6,017 | $3,441 | $2,577 | 42.8% | $11,926 | -$9,349 | -$9,349 |
| 2 | 13,344 | 1,344 | $15,702 | $7,771 | $7,932 | 50.5% | $16,765 | -$8,833 | -$8,833 |
| 3 | 19,747 | 2,347 | $27,425 | $14,206 | $13,220 | 48.2% | $23,561 | -$10,341 | -$10,341 |
| 4 | 26,066 | 3,446 | $40,270 | $19,763 | $20,506 | 50.9% | $30,600 | -$10,093 | -$10,093 |
| 5 | 31,624 | 4,480 | $52,346 | $24,845 | $27,501 | 52.5% | $37,778 | -$10,277 | -$10,277 |
| 10 | 53,326 | 8,469 | $98,964 | $44,555 | $54,409 | 55.0% | $60,865 | -$6,456 | -$6,456 |
| 15 | 68,423 | 11,173 | $130,563 | $58,059 | $72,504 | 55.5% | $77,516 | -$5,012 | -$5,012 |
| 20 | 75,929 | 12,720 | $148,640 | $65,362 | $83,278 | 56.0% | $87,855 | -$4,577 | -$4,577 |

Yearly rollups, conservative:

| Year | Rev/yr | COGS/yr | GM$/yr | Opex/yr | EBIT/yr | Tax/yr | After-tax/yr |
|---|---|---|---|---|---|---|---|
| 1 | $72,209 | $41,290 | $30,918 | $143,107 | -$112,189 | $0 | -$112,189 |
| 2 | $188,429 | $93,246 | $95,182 | $201,177 | -$105,995 | $0 | -$105,995 |
| 3 | $329,104 | $170,468 | $158,637 | $282,733 | -$124,097 | $0 | -$124,097 |
| 4 | $483,236 | $237,158 | $246,077 | $367,195 | -$121,117 | $0 | -$121,117 |
| 5 | $628,148 | $298,137 | $330,010 | $453,330 | -$123,320 | $0 | -$123,320 |
| 10 | $1,187,562 | $534,656 | $652,907 | $730,375 | -$77,468 | $0 | -$77,468 |
| 15 | $1,566,759 | $696,713 | $870,046 | $930,194 | -$60,148 | $0 | -$60,148 |
| 20 | $1,783,679 | $784,343 | $999,336 | $1,054,260 | -$54,924 | $0 | -$54,924 |

Conservative verdict: a real business that never quite clears its own cost
structure. Revenue grows to $1.8M/year but EBIT hovers a few thousand dollars per
month below zero indefinitely, because at 3.6% conversion and 7% churn the gross
margin engine (55%) cannot outrun OPEX_VAR at 32% plus marginal paid acquisition
(LTV/CAC 1.4). Two honest escape hatches, both inside the operator's control:
squeeze OPEX_VAR toward 25% (flips EBIT to roughly breakeven-positive) or kill
paid acquisition entirely (saves ~$194k/yr by year 10 against subscribers worth
~$37 contribution each over their lifetime, roughly a wash but simpler). This
scenario is survivable only as a lean lifestyle business, and only if the founder
draws pay from the floor, not from profit.

### 4.3 REALISTIC

| Year | Total users | Paying (avg) | Rev/mo | COGS/mo | GM$/mo | GM% | Opex/mo | EBIT/mo | After-tax/mo |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 19,603 | 1,603 | $19,069 | $9,113 | $9,956 | 52.2% | $18,221 | -$8,264 | -$8,264 |
| 2 | 37,174 | 4,774 | $56,782 | $24,141 | $32,641 | 57.5% | $32,610 | $32 | $24 |
| 3 | 61,290 | 9,450 | $112,392 | $50,306 | $62,085 | 55.2% | $55,619 | $6,467 | $4,850 |
| 4 | 87,998 | 15,422 | $183,418 | $77,618 | $105,800 | 57.7% | $83,804 | $21,995 | $16,496 |
| 5 | 116,432 | 22,084 | $262,648 | $107,579 | $155,069 | 59.0% | $116,450 | $38,618 | $28,964 |
| 10 | 259,814 | 59,304 | $705,330 | $269,208 | $436,121 | 61.8% | $278,036 | $158,085 | $118,564 |
| 15 | 354,121 | 85,794 | $1,020,377 | $381,355 | $639,021 | 62.6% | $392,102 | $246,919 | $185,189 |
| 20 | 414,902 | 103,837 | $1,234,974 | $456,457 | $778,516 | 63.0% | $470,177 | $308,339 | $231,254 |

Yearly rollups, realistic:

| Year | Rev/yr | COGS/yr | GM$/yr | Opex/yr | EBIT/yr | Tax/yr | After-tax/yr |
|---|---|---|---|---|---|---|---|
| 1 | $228,833 | $109,357 | $119,476 | $218,650 | -$99,174 | $0 | -$99,174 |
| 2 | $681,389 | $289,692 | $391,697 | $391,317 | $380 | $95 | $285 |
| 3 | $1,348,699 | $603,674 | $745,025 | $667,425 | $77,601 | $19,400 | $58,200 |
| 4 | $2,201,016 | $931,419 | $1,269,597 | $1,005,654 | $263,943 | $65,986 | $197,957 |
| 5 | $3,151,772 | $1,290,947 | $1,860,826 | $1,397,404 | $463,421 | $115,855 | $347,566 |
| 10 | $8,463,957 | $3,230,501 | $5,233,456 | $3,336,433 | $1,897,023 | $474,256 | $1,422,767 |
| 15 | $12,244,521 | $4,576,264 | $7,668,257 | $4,705,228 | $2,963,030 | $740,757 | $2,222,272 |
| 20 | $14,819,682 | $5,477,489 | $9,342,194 | $5,642,127 | $3,700,067 | $925,017 | $2,775,050 |

Realistic verdict: loses ~$99k in year 1, breaks even in year 2, and compounds to
roughly $14.8M revenue and $2.8M after-tax by year 20 with about 104,000 paying
subscribers. Cumulative after-tax turns positive during year 4 (cumulative: -$99k
year 1, -$99k year 2, -$41k year 3, +$157k year 4). Peak funding need is roughly
$130k of cumulative cash, i.e. the founder needs about $150k of runway or
equivalent side income to reach self-funding. This is a strong solo-to-small-team
business, not a venture-scale outcome, and the model says that plainly.

---

## 5. Worked example: realistic case, year 3, full arithmetic chain

Every intermediate number is labeled with the assumption that produced it.

1. Signups per month (A2, A3):
   6,000 x 1.8 (year 2 growth) x 1.6 (year 3 growth) = 17,280 signups/month.
2. Free MAU (A10): 3.0 x 17,280 = 51,840 active free users.
3. New paying subscribers per month (A6): 17,280 x 5.25% = 907.2.
4. Paying subscribers (recursion, Section 3.3; CHURN_M = 5%, A7):
   Start of year 3 (= end of year 2 from the simulation): 6,198.
   End of year 3 = 6,198 x 0.95^12 + 907.2 x (1 - 0.95^12) / 0.05
   = 6,198 x 0.5404 + 907.2 x 9.193 = 3,349 + 8,340 = 11,689.
   Average across the 12 simulated months: 9,450 paying.
5. Revenue (A9): 9,450 x $11.89 = $112,361/month average (simulation: $112,392,
   difference is rounding of the average). Yearly: $1,348,699.
6. COGS (A11, A12, A13), average month:
   Payers: 9,450 x $3.28 = $30,996.
   Free: 51,840 x $0.32 = $16,589.
   Trials: 35% x 17,280 = 6,048 trial takers x $0.45 = $2,722.
   Total: $50,307/month (simulation: $50,306). Yearly: $603,674.
7. Gross margin: $112,392 - $50,306 = $62,085/month, 55.2%. Yearly: $745,025.
8. Opex (A14, A15, A17, A18), yearly:
   Floor: $150,000 x 1.03^2 = $159,135.
   Variable: 30% x $1,348,699 = $404,610.
   Paid marketing: 20% x 17,280 x $2.50 x 12 = $103,680.
   Total: $667,425/year = $55,619/month.
9. EBIT: $745,025 - $667,425 = $77,601/year.
10. Tax (A19): 25% x $77,601 = $19,400.
11. After-tax profit: $77,601 - $19,400 = $58,200/year = $4,850/month.

Every row of every table above is produced by exactly this chain with that year's
assumption values.

---

## 6. Sanity checks

1. Is realistic year 1 achievable unfunded? 6,000 signups/month is 200 installs
   per day from organic short-form video and the shareable score card, sustained
   for a year, with zero paid spend. That is ambitious but within reach of a
   consumer app whose entire distribution design is the share card (PRD 1.2, 1.3);
   it does not require a viral outlier, it requires consistent content output that
   is already priced into OPEX_FLOOR. It implies 1,603 average (2,616 year-end)
   paying subscribers in year 1, i.e. about 10 new payers per day at steady state,
   consistent with the locked 10-15% trial conversion. Judged achievable, so the
   assumption stands; the conservative case (100 installs/day) is the fallback if
   it is not.
2. Gross margin vs the ~76% avatar ceiling: blended GM peaks at 63.0% (realistic,
   year 20) and never exceeds the ceiling. The gap is structural: free-tier text
   COGS and trial COGS carry zero revenue, and annual-plan discounting plus
   payment fees net ARPU down before margin is computed. No scenario silently
   assumes better margin than the locked unit economics support.
3. TAM saturation check (A1 vs A3): cumulative 20-year signups are 0.46M bear
   (1.1% of 40M), 4.0M conservative (6.7% of 60M), 15.0M realistic (15.0% of
   100M). Realistic's 15% cumulative-ever-tried is aggressive but not absurd for a
   20-year horizon in a category with Duolingo-scale precedent; it is the reason
   growth is forced to decay to 3%/year by year 16.
4. Single biggest sensitivity, one line as required: monthly churn is the lever
   the whole model swings on, because it sets paying lifetime (20 vs 14 vs 8
   months across scenarios) and therefore LTV, and moving realistic churn from 5%
   to 7% with nothing else changed converts the realistic case into roughly the
   conservative case's permanent near-breakeven.

---

## 7. What this model deliberately does not do

Stated so nobody mistakes precision for accuracy: no price increases, no inflation
on costs, no loss carryforwards, no financing or interest, no model-cost declines
(LLM prices have historically fallen, so COGS is likely overstated in later
years), no competitive response, no platform-policy shocks (the PRD's IAP
contingency would cut store-channel margin), and no second product line. Years 6
through 20 compound the year-5 assumption set and should be read as trajectories,
not commitments. The next numbers that should replace assumptions with
measurements, in order: trial-to-paid conversion (instrumented from day one per
BUSINESS-MODEL-CONVERSION.md), monthly churn, and organic signup rate.
