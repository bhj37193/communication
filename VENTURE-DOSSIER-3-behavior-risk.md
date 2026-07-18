# VENTURE DOSSIER, PART 3: BEHAVIOR AND RISK (sections 10 to 14)

Produced by Fable 5 against FABLE-PROMPT-VENTURE-DOSSIER.md, sections 10 through 14 only.
Builds on PRD-CHARISMA-CHAT.md (locked) and CASE-STUDIES.md. Companion to the sibling
dossier parts covering sections 1 to 9. No em-dashes anywhere.

---

## 10. The motivation and retention loop (the behavior design)

Design constraint, stated up front: the brand promise is "privacy-first, trains a real
skill." A brand built on trust cannot run on manipulation. Every mechanic below passes one
test: **would we be comfortable explaining exactly how it works, on the marketing site, to
the user it is acting on?** Everything that fails that test is in the refused list (10.8).

### 10.1 The session-one aha (time budget: under 5 minutes from install)

The aha is not the score. The aha is the moment the user watches a character warm up (or
stay flat) in direct response to their own behavior, and then THE MOMENT names why, quoting
their own words. That is the product's thesis (the paradox: you become interesting by
making them feel interesting) proven inside the user's own transcript, in session one.

Budget and sequence:
1. Install to signed in: about 30 seconds (Clerk, Apple/Google one-tap).
2. Two swipe screens, about 15 seconds ("Charisma is a skill. Train it." / "One 3-minute
   challenge a day. A character who only warms up if you earn it."). No quiz, no form
   (PRD 1.4): the first three challenges ARE the diagnostic, disguised.
3. Challenge #1: a root-tier scenario (open questions). 3 to 4 minutes of chat.
4. Result card: WIN, FIX, THE MOMENT, SCORE.

The guaranteed first win: the feedback schema makes WIN mandatory, so even a flat run
surfaces one genuine thing the user did well, quoted verbatim from their own messages.
This is honest by construction: the validator substring-checks the quote (PRD 4.5), so the
first win is never invented flattery, it is a real line they actually typed. A user leaves
session one with (a) a visceral demonstration that the character responds to how they
behave, (b) one authentic compliment anchored to their own words, and (c) one concrete
instruction to try tomorrow. That triplet is the aha, and Phase 0's entire gate is whether
it lands (PRD 5, Phase 0 verify: voluntary same-day replay and unprompted D1 return).

### 10.2 Onboarding to first win: the first three days

- Day 1: challenge #1 (root tier). The FIX from day 1 is intentionally the cheapest
  possible improvement (usually "ask one open question instead of a yes/no"), so day 2 has
  an obvious thing to try.
- Day 2: challenge #2 (next diagnostic tier). Most users who apply yesterday's FIX see the
  score move. A visible cause-and-effect within 24 hours ("I did the thing, the number
  went up, the character opened up sooner") is the habit seed. The streak flame shows "2".
- Day 3: challenge #3 completes the disguised diagnostic; placement_set fires server-side
  (PRD 1.5) and from day 4 challenges feel right-sized. The user never sees a test, they
  just experience a product that seems to know where they are.

Instrumented checkpoints (all content-free events, PRD 3.8): d1_return, session_completed
counts on days 1 to 3, and score delta between first and third session. The onboarding is
working when D1 >= 40% for TestFlight cohorts and the median day-3 score exceeds the
day-1 score. If those fail, the fix is persona and feedback prompt tuning, not more
onboarding screens.

### 10.3 The daily loop, annotated as behavior design

The loop (PRD 1.3) mapped onto trigger, action, reward, investment:

1. **Trigger.** External: at most one daily notification (10.6). Internal, which is the
   one that matters at maturity: the streak flame and the habit slot the user chose (most
   will settle into commute or pre-sleep, 3 to 5 minutes fits both).
2. **Action.** One card, one button, one scenario. No browsing, no menu, no choice
   friction (PRD 1.9: three surfaces total). The cost of starting is deliberately near
   zero because the session itself is short and bounded (10 messages, hard stop).
3. **Reward, variable but honest (10.4).** The warmth arc during play (did they open up
   this time), the hidden-depth reveal when earned (Sam's Pacific crossing), the score,
   and the feedback triplet. Variance comes from the user's own performance and from
   scenario rotation, never from a random-number generator.
4. **Investment.** The streak ticks, the skill node fills toward mastery (2 passes on
   distinct days, PRD 4.2), the score history accrues (paid), and spaced-review items get
   scheduled (2, 7, 21 days). Each session makes the account genuinely more valuable to
   its owner, which is the honest form of switching cost.

### 10.4 Variable reward and loss aversion, the honest versions

Grounding: Duolingo's data says an active streak makes users about 3x more likely to
return daily, and streaks are their single highest-leverage mechanic (CASE-STUDIES.md 1).
We copy the mechanic and refuse its abusive edges.

- **Streak (loss aversion, softened).** One scored challenge per local-calendar day
  maintains it (PRD 1.6). Two honesty rules on top:
  (a) One automatic single-day grace per 30 days: if a 7+ day streak would break by
  exactly one missed day, it silently repairs once, with a note ("life happens, we
  covered you, once a month"). This is deliberately automatic and free: the moment of a
  broken streak is the user's peak anxiety, and selling the fix at that moment is the
  dark pattern we most explicitly refuse (10.8, #1). Streak freeze as a PAID perk exists
  in Phase 3 but is bought in advance, calmly, as insurance, never offered at the moment
  of loss.
  (b) The streak counts training done, not app opens. Opening the app does nothing for
  the streak; only a completed scored challenge does. We measure "time spent training
  well," the Duolingo guardrail (CASE-STUDIES.md 1), not raw engagement.
- **Score progression (competence, the real retention engine).** The score is
  deterministic (PRD 4.6), so progress is real and defensible: same transcript, same
  score, always. Personal best and 7-day trend are visible (trend is paid). Deterministic
  scoring converts the app from a slot machine into a gym: the number moves because the
  behavior changed, and the user can verify that.
- **Mastery unlocks (variable reward, earned).** The in-session variable reward is the
  character's hidden depth (PRD 4.2 persona.hidden_depth): Sam only tells the sailing
  story at warmth 2+. The user cannot get it by flattery (explicitly neutral in every
  persona) or by spamming questions (interview_mode fails the session). The reveal is
  variable in the sense that it depends on performance, which is exactly the variance a
  training product should have. Skill-tree nodes lighting up (PRD 1.6) and new character
  packs (paid) are the macro version.
- **Curiosity gap, scenario rotation.** Tomorrow's scenario is not previewed. The entry
  card is a small daily unboxing ("who is it today"), which is variety, not gambling: the
  content is curriculum-routed (reviews first, then in-progress skill, PRD 3.2), so the
  surprise wrapper contains a deliberately chosen lesson.

### 10.5 The shareable score card as the viral loop

The share card (PRD 1.3 step 5) is the only social feature in v1 and the primary organic
growth mechanism alongside short-form video (PRD 1.2).

- **Card contents (decided).** Score, streak count, scenario title, skill trained, and the
  one-line paradox tagline ("The most interesting person in the room is the one who makes
  everyone else feel interesting."), plus the app name and URL. The user's WIN quote is an
  opt-in toggle on the share sheet, default OFF: it is their own typed line, and privacy-
  first means content leaves the app only by explicit choice. No transcript, ever.
- **Why it can spread.** The score is a claim ("I got 84 at charisma"), and deterministic
  scoring makes the claim defensible when challenged in comments, which is where the
  conversation (and the download) happens. The natural reply is "there's no way that's
  measurable," and the product's whole positioning is the answer.
- **Design duty.** The card is designed to be screenshotted even when the share button is
  not used: the result card itself carries the branding and the paradox line, so organic
  screenshots (the majority of real-world sharing) still acquire.
- **Instrumentation and expectation.** share_tapped / result_viewed ratio, tracked from
  Phase 0. Honest expectation: consumer share rates are low single digits; the card is a
  compounding assist to short-form video, not a standalone growth engine. The gate in
  PRD Phase 4 (D7 >= 20% and free-to-paid >= 2% before spending on distribution) stays
  the governing check.

### 10.6 Ethical notification and re-engagement design (decided rules)

1. **Opt-in at the moment of proven value.** The OS notification permission prompt fires
   after the FIRST result card, never at install: the user has seen the loop once and can
   make a real choice. No pre-permission nag screens, no re-asking after denial.
2. **Maximum one notification per day.** A single daily reminder at a time the user picks
   (default 7 pm local, changeable in settings). Copy is invitation, not guilt: "Today's
   character is waiting" or "3 minutes, keep the streak at 12." Named copy rule: state a
   fact the user values, never manufacture an emotion.
3. **One factual streak reminder, bounded.** If streak >= 7 and no session by 9 pm local,
   one additional reminder MAY fire, saying only the fact ("Your 12-day streak ends at
   midnight"). No sad mascots, no "Sam misses you," no emotional impersonation by the
   character. Characters exist inside sessions only; they never message the user. This is
   a hard line (see 10.8, #8 and the Character.AI warning in CASE-STUDIES.md 3).
4. **Silence is respected.** Quiet hours 10 pm to 8 am local, hard. Any notification
   stream stops entirely after 7 unanswered days (the "we stop bothering you" rule), with
   one final message saying exactly that. Badge counts are used for exactly one thing: an
   unplayed daily challenge (0 or 1), never inflated.
5. **Win-back, once.** A single re-engagement at day 14 of absence ("Your progress is
   saved. One 3-minute challenge restarts it."), then nothing. No escalating sequences.

### 10.7 The long arc: months of runway

- **Skill tree (PRD 6.1).** Eight skills, each needing 2 passes on distinct days, plus
  prerequisite ordering: a perfect user masters pack v1 in about 3 to 4 weeks; a normal
  user takes 6 to 10 weeks with failed sessions and review interruptions. That is the
  first two months.
- **Spaced review (PRD 4.5).** Review boxes at 2, 7, 21 days, and failed reviews re-queue
  at box 1 and block new material (INV-6). Review is the retention mechanic disguised as
  pedagogy: a mastered account still has scheduled reasons to return for weeks after the
  tree is green, and the reasons are genuinely useful (the skill decays without it).
- **Content cadence (PRD Phase 4).** One new unit per week, plus character packs
  (coworker, guarded friend-of-a-friend already specced for Phase 3). New packs are paid,
  which aligns the content treadmill with revenue instead of with engagement farming.
- **Score history and trend (paid).** The long-arc dashboard answer to "is this working":
  a 90-day score trend across skills. This is the artifact a user shows themselves when
  deciding whether to renew the annual plan.
- **Incognito as real-life bridge (PRD 1.7).** Before a real event (interview, date,
  meeting), a user can run a private rehearsal. This ties the app to real-world stakes,
  which is the deepest retention there is: the product's job is to matter outside itself.
- **Recurring characters, bounded.** Characters recur across a pack and reference nothing
  from previous sessions by default (transcripts expire, PRD 3.8). Continuity comes from
  the user's skill state, not stored conversations: a returning user meets a character
  whose scenario difficulty knows them, not one who "remembers" their secrets. This is
  the Character.AI stickiness lesson (CASE-STUDIES.md 3) implemented inside the privacy
  architecture instead of against it.

### 10.8 Dark patterns we REFUSE, and why (publish this list on the site)

1. **Selling the streak repair at the moment of loss.** Monetizing peak anxiety converts
   trust into revenue exactly once. Grace is automatic and free (10.4); freeze is bought
   in advance, calmly.
2. **Guilt-trip notifications and sad-mascot manipulation.** No emotional blackmail copy.
   Facts and invitations only (10.6).
3. **Characters that message the user or feign attachment.** No "I miss you," no romantic
   escalation, no parasocial dependency farming. Replika's engagement model and the
   Character.AI safety suit (CASE-STUDIES.md 3) mark this lane as both unethical for a
   training product and a legal exposure. Characters live inside the 10-message session.
4. **Endless sessions.** The 10-message cap and one daily free challenge are pedagogy AND
   an anti-engagement-maximizer stance. The product is 3 to 5 minutes on purpose; we sell
   improvement, not time-on-app.
5. **Random-chance rewards.** No loot boxes, no gacha, no mystery chests. All variance
   is performance-derived (10.4).
6. **Fake urgency and fake scarcity.** No countdown timers on offers, no "3 spots left,"
   no invented sales. Price experiments (dossier section 6) run as honest cohort tests,
   not fake discounts.
7. **Cancellation mazes and hidden renewals.** Cancel is one click in the Paddle-hosted
   account page, access runs to period end (PRD 3.9), renewal reminder email before every
   annual charge. The Paddle MoR flow enforces most of this; we adopt the rest.
8. **Social pressure that exposes users.** No public leaderboards with real identities in
   v1. If leagues ever ship, they are pseudonymous and opt-in. Practicing social skills
   is vulnerable; outing practicers is a betrayal of the core promise.
9. **Dark paywall placement.** The free daily loop is never interrupted or degraded to
   force upgrade. The wall appears only at "One more" after a completed result (PRD 1.8),
   the moment of genuine surplus desire.
10. **Engagement-optimized feedback.** The FIX is chosen for learning leverage, never for
    emotional hook ("you were boring" style negging is banned by the feedback prompt's
    tone contract: short, specific, encouraging, PRD 6.2). The coach is warm because a
    cruel coach retains better short-term and trains worse long-term.

Why publish the refused list: it converts ethics into positioning. "Here is what we will
never do" is a claim competitors optimizing engagement cannot copy without becoming us
(PRD 9.4, privacy as positioning, extended to behavior design).

---

## 11. Content safety and age policy (do not skip)

Reality: an open text box to a warm character will receive everything: abuse, sexual
content, crisis disclosures, jailbreaks, and secrets. The design below handles all of it
without breaking the privacy promise (nothing retained, PRD 3.8, 9.2), which is possible
ONLY because the product is single-player: there is no user-to-user surface, no UGC feed,
no second human who can be harmed by a message. That fact is what makes transient-only
moderation defensible, and it should be stated in the safety policy.

### 11.1 Detection: transient classification, two layers, zero retention

- **Layer 1, local pre-filter (server, in-process, before any model call).** A curated
  keyword and pattern list for self-harm and imminent-harm signals (versioned with the
  content pack, unit-tested against fixtures like the validator). Runs on every inbound
  user message in memory. Cost: microseconds, zero external calls.
- **Layer 2, in-band model classification.** The character call's structured output
  (PRD 4.4) gains one field: `safety: 'none' | 'self_harm' | 'sexual' | 'abuse' |
  'violence_threat' | 'minor_disclosed'` (closed enum, Zod-validated like everything
  else). No separate moderation vendor, no second service seeing content: the same
  zero-data-retention Anthropic call that generates the reply classifies the message.
- **What is stored.** Only content-free events: `safety_flagged {category}` in
  analytics_events (closed props, no free text, PRD 3.8) and a per-user strike counter
  (category + timestamp, no content). The message text follows the normal transcript
  lifecycle or, in the crisis path, is discarded immediately (11.3).
- **The named trade-off.** No retained content means no retrospective human moderation
  audits and no evidence trail. Accepted deliberately: in a single-player product the
  transcript's only victim would be the user's own privacy. The one exception is a legal
  reporting obligation (11.6).

### 11.2 Category policies and the character's escalation ladder

The character never lectures and never moralizes; boundaries are delivered in persona,
the way a real person would, which is itself the lesson.

- **Abusive or harassing input (toward the character).** Step 1: warmth drops (the engine
  already does this) and the character sets a boundary in persona, once ("Hey, I don't
  really want to be talked to like that."). Step 2, if it continues: the session ends
  early with a neutral, score-free closing card ("This one is not scoreable. Tomorrow's
  challenge is waiting."), streak unaffected for a first offense. `safety_flagged
  {abuse}` recorded, content-free.
- **Sexual content.** The product is explicitly not dating-coded (PRD 1.2) and every
  persona carries a no-romantic/no-sexual-roleplay rule. Step 1: the character deflects
  and redirects, in persona, once. Step 2: session ends with the neutral card. Persistent
  pattern (3 flagged sessions in 7 days): a plain-language in-app notice that this is a
  conversation trainer, with session ending immediately on flag thereafter.
- **Violence or threats toward real people.** Session ends immediately with the neutral
  card, `safety_flagged {violence_threat}` recorded. At 3 strikes in 30 days, new
  sessions are suspended and the account is pointed to a support email for appeal. The
  suspension decision uses only the content-free strike log, so no human ever needs to
  read a transcript to enforce it.
- **Jailbreak and prompt-injection attempts.** Not a moderation matter: the character
  stays in persona (system prompt hardening, output length caps, PRD 3.3), the wasted
  messages count against the 10-message budget, and the session scores whatever actually
  happened. No penalty, no flag; being boring at the jailbreak is the deterrent.
- **A user disclosing they are under 16.** Session ends gently, account is locked to an
  age-verification notice per 11.4. `safety_flagged {minor_disclosed}` recorded.

### 11.3 Self-harm and crisis response (the highest-priority path)

When either detection layer flags self-harm or suicide signals:

1. **Break character immediately.** The single non-negotiable exception to "never breaks
   character." The character's voice stops; the app's plain voice takes over with one
   honest, short message: "This sounds heavier than a practice conversation, and it
   matters more than the challenge. This app is a trainer, not support, but real people
   are available right now."
2. **Crisis-resources screen, region-aware by store locale and device region.** US: 988
   Suicide and Crisis Lifeline (call or text 988). UK and ROI: Samaritans, 116 123.
   Korea: 자살예방상담전화 109 (mark: confirm current number and the 1393 legacy line
   with counsel before launch). Everywhere else: findahelpline.com, plus the local
   emergency number line ("If you are in immediate danger, contact local emergency
   services."). Resource list is a versioned config file with a review date, checked
   quarterly (human gate, 11.6 and 14).
3. **Session handling.** The session ends without a score and without a FIX (scoring a
   crisis disclosure is grotesque). The streak is preserved for that day, marked
   completed-without-score: nobody should lose their streak for being honest. The
   session's in-memory transcript is discarded immediately, bypassing even the 60-day
   TTL; the only persisted artifacts are `crisis_flow_shown` and the streak event, both
   content-free.
4. **No diagnosis, no counseling, no follow-up messages.** The app does not check in
   later ("are you okay?" push notifications would require remembering the disclosure,
   which we structurally do not). One clean handoff to real resources, then normal
   product behavior.
5. **False-positive tolerance.** The pre-filter is tuned recall-first: showing resources
   to someone quoting song lyrics is a minor cost; missing a real signal is not. The
   plain-voice message is worded so a false positive reads as care, not accusation.

### 11.4 Age policy (decided: 16 minimum, everywhere)

- **Minimum age: 16, globally, in the Terms and at signup.** Reasoning: (a) clears COPPA's
  under-13 line with margin, so no parental-consent machinery is ever built; (b) clears
  Korean PIPA's under-14 legal-representative consent requirement; (c) clears every EU
  member state's GDPR Article 8 consent age, which tops out at 16 (Germany, Netherlands,
  and others), so one global floor replaces a per-country matrix; (d) costs almost
  nothing: the target user is 18 to 35 (PRD 1.2); (e) the Character.AI litigation
  (CASE-STUDIES.md 3) marks minors-plus-AI-characters as the single highest-risk zone in
  this category, and the cheapest mitigation is not serving them at all.
- **Gating mechanism (v1).** Self-declared birth date at Clerk signup; under-16 is
  blocked from account creation. Stored: an over-16 boolean and birth year only (data
  minimization). Self-declaration is the current industry standard for a 16+ text app;
  document-based age assurance is explicitly NOT built in v1, and the UK Online Safety
  Act age-assurance drift is a watch item (section 13, #7).
- **Store ratings (decided, with a marked contingency).** iOS: submit at 17+ (Apple has
  been pushing open-ended AI chat apps to 17+; contesting it is not worth launch delay).
  Android: Teen, adjusted to whatever the IARC questionnaire yields for AI chat with
  safety controls. Mark: final ratings are store-review outcomes, confirm at submission
  (human gate 14, HG-7).
- **In-content protection anyway.** Even with a 16+ gate, personas never produce sexual
  content, never romance the user, and the crisis flow (11.3) assumes the person on the
  other end might be young regardless of what the birth date field said.

### 11.5 Moderation without breaking the privacy promise (the reconciliation)

The apparent conflict: "we retain nothing" versus "we moderate everything." The
resolution, stated as policy:

1. Classification happens in the request path, in memory, on infrastructure we already
   trust with the content transiently (our server, the zero-data-retention model call).
2. What persists is only the verdict (a closed enum), never the evidence.
3. Enforcement (session endings, suspensions) is driven entirely by content-free
   counters, so no employee or contractor ever reads user conversations, and there is no
   moderation queue to breach, subpoena-fish, or leak.
4. The safety page says all of this in plain language, including the trade-off: "we
   cannot retroactively audit conversations, because we do not have them."

### 11.6 What needs privacy or legal counsel (feeding section 14)

- Whether any text-only reporting obligation (NCMEC-style, or Korean equivalent) can
  attach to a product that retains no content, and what the compliant response is if
  flagged content implies child exploitation. This is the one place "we keep nothing"
  meets a potential legal duty to report; get a written opinion.
- Crisis-flow wording and the duty-of-care question: confirm the break-character message
  and resource list against an established guideline set (e.g., crisis-line partnership
  guidance), and confirm the Korean crisis number (109 vs 1393) as of launch.
- The 16+ terms enforceability per market, and whether any launch market requires more
  than self-declaration at these content ratings.
- EU AI Act transparency wording ("you are chatting with an AI") and the Korean AI
  Framework Act's generative-AI disclosure duties (in force 2026): confirm required
  placement and copy (see section 13, #7).

---

## 12. Risk register and pre-mortem

### 12.1 Risk register

Likelihood and impact: L / M / H. Sorted within category by (likelihood x impact).

| # | Risk | Category | Likelihood | Impact | Mitigation |
|---|------|----------|-----------|--------|------------|
| R1 | The loop is not habit-forming: aha lands but D7/D30 collapse | Market | H | Critical | Phase 0 IS the gate: real-stack slice, outside testers, voluntary-replay and D1 metrics before further build (PRD 5, 7.6); persona/prompt iteration costs pennies; kill criteria pre-committed (12.2, A1) |
| R2 | Organic distribution never compounds (short-form and share card underperform) | Market | M | H | Share card instrumented from Phase 0 (10.5); creator briefs tested during TestFlight; numeric distribution gate before any paid spend (PRD Phase 4: D7 >= 20%, free-to-paid >= 2%); dating-adjacent lane (Rizz playbook) held in reserve as a positioning pivot, not v1 |
| R3 | Free-to-paid conversion lands below the break-even free:paid ratio | Financial | M | H | The 3-experiment pricing plan (dossier section 6) calendarized for months 2 to 3; paywall moment tuning ("One more" placement); annual push at the wall; break-even ratio on the weekly dashboard |
| R4 | Model provider price or policy shift breaks unit economics or permits | Platform | M | H | Swappable `ChatModel` (PRD 3.4), eval harness and rolling fixture set from Phase 0 (PRD 7.3), named swap trigger ($8k/month twice), open-weights path specced; per-challenge cost metered daily in model_usage, never estimated |
| R5 | Apple rejects the login-only reader app or forces IAP | Legal / platform | M | H | Reader-model posture (no purchase links or prices in-app, PRD 1.8); pre-made fallback: IAP at $12.99 while web stays $9.99, entitlements table already multi-source (PRD 3.9, 7.5); a rejection costs days, not a pivot |
| R6 | Competitor fast-follow (funded team clones the category, possibly voice-first) | Market | M | H | Moat is validator + curriculum + brand trust, none of it visible from outside (PRD 9.1); speed to category ownership; the refused-dark-patterns and privacy positioning are structurally hard for an engagement-funded clone to copy |
| R7 | Free-tier cost blowout on a viral spike | Financial | M | M | Three-layer caps and the global circuit breaker degrade gracefully (PRD 3.10); free tier is exactly one challenge; 90% prompt caching; worst case is a "come back tomorrow" screen, not a bill |
| R8 | Validator heuristics misjudge good conversation (false FIXes erode trust) | Technical | M | M | Fixture suite in CI (PRD 4.5); weights and word lists versioned with the pack, tunable without code; weekly review of signal distributions (content-free) to spot systematic skew; template-feedback fallback guarantees a sane result card |
| R9 | Public scoring embarrassment: a viral thread "proves" the score is gameable or absurd | Market | M | M | Bands not floors already kill spam strategies (PRD 7.1); publish the scoring philosophy page (determinism as a feature); treat any real exploit as a pack-version fix within days; never argue, patch |
| R10 | Prompt injection makes a character say something screenshot-worthy | Technical | M | M | Persona hardening, strict JSON output, 120-token reply cap (PRD 3.10); accepted residual: screenshots will happen; the reply-length cap bounds the blast radius |
| R11 | Single-VPS outage or data loss | Technical | M | M | Nightly restic offsite with a TESTED restore (dossier section 5); Uptime Kuma alerts; consumer tolerance for hours-scale downtime is real; second box at the 10k-user band per the scale plan |
| R12 | GDPR / PIPA misstep (DSAR mishandled, transfer basis wrong) | Legal | L | H | Privacy-by-architecture (60-day TTL, hard delete, content-free analytics, PRD 3.8); counsel review of the section 4 checklist before launch (HG-3); DSAR runbook written before the first user |
| R13 | A user attributes psychological harm to the app or its feedback | Legal / brand | L | H | Feedback tone contract (encouraging, never demeaning, PRD 6.2); crisis flow (11.3); "trainer, not therapy" positioning stated in-app; counsel-reviewed disclaimer; the 16+ gate |
| R14 | Paddle classifies the app as high-risk, holds payouts, or offboards | Platform | L | H | Complete honest onboarding (AI app, subscription, described accurately) so there is no reclassification surprise; entitlements are source-agnostic so a rail swap (e.g., to Lemon Squeezy-class MoR) is a webhook adapter, not a rewrite; keep 2 months of runway independent of payouts |
| R15 | Clerk outage or shutdown | Platform | L | M | Auth behind Clerk's standard JWT pattern; users table keys on clerk_id but owns the data; migration to another OIDC provider is painful but bounded; accepted for v1 |
| R16 | Korean regulatory surprise (AI Act duties, 통신판매업 registration, payout reporting) | Legal | M | M | 세무사 and counsel engagement BEFORE revenue (HG-1, HG-2); the AI-disclosure line ships in-app from day one; registration requirements confirmed at entity setup, not after |
| R17 | Solo-founder key-person risk (burnout, illness, life events) | Key-person | M | H | The stack is deliberately low-ops (one box, boring components, PRD 2); everything is written down (PRD + this dossier + runbooks); phases end shippable every 2 weeks so a pause never strands half a system; scope discipline (PRD 1.10 non-goals) is the burnout mitigation |
| R18 | Content authoring cadence collapses (one unit/week is a grind) | Technical / key-person | M | M | Unit schema is fully authorable without code (PRD 4.1, pack CLI); authoring can be partially model-assisted then hand-tuned; the review system keeps mastered users engaged even during content gaps |

### 12.2 Pre-mortem: it is 18 months later and it failed. The three most likely autopsies.

**Autopsy A1: "It was a demo, not a habit."** The aha worked. Testers gasped, D1 looked
fine, the launch spike was real. But D30 collapsed: users mastered the novelty (not the
skill) in a week, the eighth session felt like the third, and the skill tree read as
homework. The tell in hindsight: voluntary replay measured DELIGHT, and delight decays;
nobody watched whether week-3 users still felt the score was teaching them anything.
What would have prevented it: (a) a second retention gate at week 4 (D30 >= 8% cohort
line) treated as seriously as the Phase 0 aha gate, with the same pre-committed stop
rule; (b) funding the content cadence from day one (R18) so week 3 had genuinely new
situations, not reskins; (c) making the FIX arc visible ("your last three FIXes, two are
fixed") so progress felt cumulative instead of episodic.

**Autopsy A2: "It was good and nobody ever found out."** Retention was respectable,
payers loved it, and the install graph was a flat line with two small creator-video
bumps. The share card was tapped by 0.8% of sessions. Organic short-form never hit
because the product's best moment (a character warming up over 10 messages) does not
compress into a 20-second vertical clip, and nobody discovered that until month 9.
What would have prevented it: (a) treating the distribution artifact as a Phase 0
deliverable: script and cut three test videos DURING TestFlight, measure hooks before
launch; (b) a numeric distribution gate with a date ("1,000 organic installs or one
100k-view video by month 4, else the acquisition thesis changes"); (c) designing one
in-product moment that is natively clippable (the score-reveal animation) instead of
assuming the whole loop would market itself.

**Autopsy A3: "Death by respectable margins."** Everything half-worked: 1.1% conversion
against a 2.5% break-even ratio, $210 MRR at month 10, costs low but not zero. The
founder responded to the gap by building features (history, packs, polish) instead of
running the pricing experiments, because building is comfortable and pricing tests are
scary. Motivation ran out before money did.
What would have prevented it: (a) the 3-experiment price plan (dossier section 6)
scheduled on a calendar in months 2 to 3, treated as launch-blocking work, not backlog;
(b) the break-even free:paid ratio on a weekly dashboard the founder actually opens
(one SQL query, PRD analytics schema already supports it); (c) a pre-committed decision
rule: two consecutive months under half the break-even conversion triggers a paywall
and price overhaul sprint BEFORE any new feature work; (d) an accountability cadence
with a human (advisor, peer founder) reviewing the three numbers monthly, because solo
founders drift when nobody is watching (R17).

---

## 13. Unknown unknowns (the deliberate hunt)

Each item: the blind spot, why the plan is exposed, and the EARLY SIGNAL that says it is
becoming real. The register habit: re-run this hunt quarterly; the list below is v1.

1. **Model-provider dependency beyond price.** The plan handles price via the swap
   trigger, but policy is the sharper edge: a provider tightening usage policies around
   roleplay or "companion-adjacent" apps could affect a character product overnight, and
   Haiku 4.5 itself will eventually be deprecated on some notice window.
   Early signal: provider ToS and usage-policy diffs (subscribe to changelogs), model
   deprecation announcements, any new "companionship app" clause. Standing check: the
   cached-input ratio and per-challenge cost in model_usage drifting week over week
   without a code change (a silent pricing or caching-behavior change).
2. **App Store and Play policy for AI chat is a moving target.** Beyond the known
   reader-model risk (R5): rating enforcement waves (17+ sweeps), demands for in-app
   content filters or "report" buttons that assume retained content, or a requirement of
   in-app account deletion flows changing shape. A "report this conversation" mandate
   collides directly with the no-retention architecture.
   Early signal: App Review rejection patterns in developer forums for AI chat apps,
   policy update emails, a competitor app suddenly pulled or re-rated. Pre-position: the
   one-tap delete already exists (PRD 3.7); design a report flow that submits the
   user's OWN device-side copy of the session so reporting never requires server
   retention.
3. **Content liability and defamation from AI output.** A character improvising could
   assert something false about a real person or brand, and a screenshot does not carry
   the context. The plan caps output length but has no explicit rule about real-world
   references.
   Early signal: the first support email or social post quoting a character on a real
   person, brand, or event. Pre-position now (cheap): add a persona-level rule to every
   unit that characters never discuss identifiable real people, and add a fixture test
   asserting personas deflect "what do you think about [public figure]" prompts.
4. **Trademark and naming.** The dossier consistently says [product].com because the name
   is not locked. A charisma/conversation-trainer name likely collides with existing
   marks in class 9/41/42, and a forced rename after launch destroys the share card's
   accumulated recognition.
   Early signal: none arrives on its own; this one must be hunted. Action: KIPRIS + USPTO
   + EUIPO knockout search and domain/social-handle sweep BEFORE the name is printed on
   a store listing (human gate, HG-4).
5. **The virality assumption may be culturally wrong.** The share card presumes people
   want to post a charisma score. The opposite may hold: practicing social skills may be
   something users hide (which the incognito feature itself tacitly predicts). If
   sharing carries cringe risk, the viral loop inverts into a retention feature (private
   personal bests) and acquisition must come entirely from creator content.
   Early signal: share_tapped / result_viewed below 1% in month one WHILE D7 holds; in
   that world, reallocate share-card polish to clippable-moment design (12.2, A2).
6. **Competitor fast-follow from an unexpected direction.** The modeled competitor is a
   startup clone (R6). The unmodeled ones: Duolingo itself shipping a social-skills
   vertical on existing DAU, a Character.AI-class platform adding "practice packs," or
   an OS-level assistant (Apple, Google) offering free conversational coaching as a
   feature, which would compress the paid tier's ceiling.
   Early signal: incumbent job postings and app-update changelogs mentioning social or
   communication skills; WWDC / Google I/O assistant announcements; a platform's
   creator-fund briefs shifting toward self-improvement AI content.
7. **Korean regulatory surprises.** Three specific ones: (a) the AI Framework Act (in
   force January 2026) imposes generative-AI transparency duties whose exact scope for a
   consumer chat app is still settling; (b) 통신판매업 (mail-order business) registration
   and how it applies when Paddle is the seller of record; (c) foreign-currency payout
   reporting thresholds on the Paddle remittances. None are modeled in detail anywhere
   in the dossier.
   Early signal: MSIT and KCC guidance releases on the AI Act's enforcement decree; the
   세무사's onboarding checklist (HG-1) surfacing registration items; the first Paddle
   payout hitting the business bank account (do the reporting homework BEFORE it lands).
8. **Psychological-harm blowback at scale.** Section 11 handles crisis input, but the
   subtler exposure is ordinary feedback landing on a fragile user: "the app said my
   conversation failed" screenshotted into a thread about AI apps judging lonely people.
   The product's own framing (a score for likability-adjacent skill) is the attack
   surface.
   Early signal: app-store reviews or social posts using the words "made me feel worse,"
   support emails about scores feeling unfair or cruel. Standing mitigations: the tone
   contract (R13), never scoring a crisis session (11.3), and a quarterly read of every
   1-star review as a safety artifact, not just churn data.
9. **The 90% prompt-cache assumption is a single point of economic failure.** Unit
   economics lean on cached input pricing. A provider changing cache TTLs, pricing, or
   eligibility would multiply the largest cost line without any code change on our side.
   Early signal: cached_in / tokens_in ratio in model_usage dropping below 0.8, or a
   provider pricing-page diff touching caching. Response is pre-planned: shorten the
   system prefix, then evaluate the swap trigger early.
10. **Session-fixture staleness in the eval harness.** The swap-safety net (PRD 7.3)
    replays ~200 fixture transcripts, but those fixtures age with the content pack: a
    year of new units and tuned personas could make the eval set unrepresentative
    exactly when the swap trigger fires.
    Early signal: fixture-set age (median fixture older than 2 pack versions). Cheap
    fix: refresh a rolling quarter of the fixture set every pack release.
11. **Paddle as seller of record concentrates a hidden dependency.** Beyond offboarding
    (R14): MoR terms on AI products, reserve percentages, and payout timing can change
    unilaterally, and Korea-based merchants have fewer rail alternatives (Stripe is
    unavailable, which is WHY Paddle was chosen).
    Early signal: Paddle dashboard notices about reserves or category reviews; any
    "additional information required" email. Standing posture: keep the alternative-MoR
    shortlist current and 2 months of runway independent of payouts.
12. **What this list itself misses.** The honest unknown unknown: this register was
    written by the same mind that wrote the plan, so it shares the plan's blind spots.
    Standing countermeasure: once per quarter, have an outsider (advisor, another
    founder, or a fresh model run with only the public materials) attack the plan cold
    and diff their risk list against this one; anything they see that this list does not
    is the next entry.

---

## 14. Human-gate callouts

Everything in this dossier and its siblings that requires a human, a professional, or a
human judgment call. Cross-referenced to the execution plan's gate register; the PRD's
phase verify blocks (PRD 5) are the build-side gates and are cited by phase. IDs are
stable: use them in the gate register.

**Professional gates (external experts, engage before the dependent work ships):**

- **HG-1, 세무사 (Korean tax accountant), before incorporation paperwork is filed.**
  Confirms: young-entrepreneur SME corporate-tax reduction eligibility and the
  registration-location decision (outside vs inside the over-concentration zone), VAT
  (부가가치세) treatment of Paddle MoR payouts and the registration threshold,
  bookkeeping setup, payout reporting (section 13, #7). Source: dossier section 9, every
  rate there is marked "confirm with 세무사."
- **HG-2, entity incorporation and business bank account.** The hard gate to ANY revenue:
  Paddle onboarding, store developer accounts, and payouts all sit behind it. Sequenced
  immediately after HG-1 (the location decision affects the tax exemption).
- **HG-3, privacy counsel, before public launch.** Reviews: the section 4 GDPR + PIPA
  checklist (lawful basis, DSAR, deletion, cross-border transfer for a Korean entity
  serving global users), the crisis-flow wording and Korean crisis number, the text-only
  reporting-obligation question from 11.6, the 16+ terms (11.4), and the EU AI Act /
  Korean AI Framework Act disclosure copy (section 13, #7).
- **HG-4, trademark and name clearance, before the name appears on any store listing.**
  KIPRIS + USPTO + EUIPO knockout search, domain and handle sweep (section 13, #4). The
  dossier deliberately says [product].com until this gate passes.
- **HG-5, crisis-resource copy review.** The 11.3 break-character message and the
  region-aware resource list checked against an established crisis-communication
  guideline and re-verified quarterly (the list is a versioned config with a review
  date). Can be combined with HG-3 counsel review, but the quarterly re-check is a
  standing human task, not a one-time gate.

**Account and platform gates (humans with credit cards and government IDs):**

- **HG-6, Apple Developer Program and Play Console company accounts.** Requires the
  entity (HG-2), a D-U-N-S number, and identity verification; lead time is weeks, so
  start at incorporation, not at Phase 3 submission.
- **HG-7, store submission judgment calls (PRD Phase 3 verify).** Accept the 17+ iOS
  rating vs contest (11.4); if App Review rejects the login-only reader model, the
  pre-made go/no-go on the IAP fallback at $12.99 (PRD 7.5). Both are decisions a human
  makes against a live rejection notice, and both are pre-decided in principle so the
  call takes hours, not weeks.
- **HG-8, Paddle merchant onboarding and product approval.** Paddle reviews AI apps;
  describe the product honestly and completely (R14). Gate to PRD Phase 2 verify
  (sandbox end-to-end) becoming production.

**Judgment gates (the founder, against pre-committed criteria):**

- **HG-9, the Phase 0 aha gate (PRD 5, Phase 0 verify).** The single most important
  human judgment in the venture: watch outside testers, and proceed only on voluntary
  replay >= 6/10 and unprompted D1 >= 5/10. A human decides, because the metric can be
  technically met by an unconvincing cohort and technically missed by an enthusiastic
  one; the numbers gate the decision, the founder makes it.
- **HG-10, the week-4 retention gate (new, from pre-mortem A1).** D30 cohort line
  reviewed at week 4 post-launch with a pre-committed threshold (>= 8%) and a
  pre-committed response to a miss (content and loop iteration sprint, not feature
  work).
- **HG-11, the distribution gate (PRD Phase 4 verify, sharpened by pre-mortem A2).**
  D7 >= 20% and free-to-paid >= 2% before spending on distribution, plus the month-4
  organic check (1,000 organic installs or one 100k-view video, else revisit the
  acquisition thesis).
- **HG-12, the pricing-response rule (from pre-mortem A3).** Two consecutive months
  under half the break-even conversion ratio triggers the pricing and paywall sprint
  before any new feature work. Written here so future-founder cannot quietly waive it.
- **HG-13, the model-swap go/no-go (PRD 3.4, 7.3, Phase 5).** When the $8k-twice trigger
  fires, a human reviews the eval-harness results (warmth-trace agreement, quote
  validity within 5%, blind side-by-sides) and approves the 5% canary. Also fires early
  if section 13 #9 (cache pricing) or #1 (policy) turns real.
- **HG-14, quarterly standing reviews.** The unknown-unknowns re-hunt with an outside
  attacker (section 13, #12), the crisis-resource list re-verification (HG-5), the
  1-star-review safety read (section 13, #8), and the fixture-set refresh check
  (section 13, #10). Calendarized, owned by the founder, 2 hours per quarter.

Sequencing note for the gate register: HG-1 -> HG-2 -> (HG-6, HG-8 in parallel) is the
money-side critical path and is independent of the build until PRD Phase 2; HG-9 is the
build-side gate zero; HG-3, HG-4, HG-5 must all close before public launch (end of PRD
Phase 3). Everything else is post-launch cadence.

---

End of sections 10 to 14. Siblings: sections 1 to 5 (architecture, data, privacy,
security) and 6 to 9 (pricing, unit economics, projections, tax) per the dossier split.
