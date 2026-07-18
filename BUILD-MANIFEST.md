# BUILD-MANIFEST: what to build, and when

The architecture simplified when we went own-app + own-Haiku: there is no MCP server anymore (MCP was only for a third-party AI connecting to our data). The engine is now just a normal backend API our app calls. Same logic (gating, mastery, state), less plumbing. No em-dashes.

## Buy vs build vs write

**BUY (rent, do not build):**
- Real-time voice (barge-in, echo cancel, turn-taking): Vapi or Retell early; move to LiveKit / Pipecat self-hosted at scale to drop the per-minute markup.
- STT + TTS: Deepgram (Nova + Aura).
- The reasoning "brain" (plays partner, coaches, scores): Claude Haiku via a prompt. Not a trained model.
- Payments: Stripe.

**BUILD (the code you write, all tractable):**
1. Mobile app (thin, Expo/React Native): ~5 screens: onboarding, home (Call button + mode pill + incognito toggle + streak), call screen, result card, settings/history.
2. Backend engine (the moat): state machine, next_unit gating router, mastery counting, spaced-review scheduler, per-user event-sourced state (Postgres), deterministic scoring validator. Spec = MCP-ENGINE-SPEC.md.
3. Auth + Stripe web billing + subscription gating + data-retention/incognito rules.
4. Analytics (content-free retention/conversion).
5. Landing page + web checkout. Deploy (VPS + Postgres).

**WRITE (content, the long pole, the moat):**
6. The three skill packs authored into real units: drills + AI-partner personas/resistance briefs + rubric signals/thresholds + coaching prompts + diagnostics. Blueprints = SALES/PEDAGOGY/EVERYDAY-PEDAGOGY.md.

## The seven pieces

| # | Piece | Buy/Build/Write | Hard? |
|---|---|---|---|
| 1 | Mobile app (thin, one-button) | build | no |
| 2 | Real-time voice loop | buy (Vapi/Retell -> LiveKit at scale) | rented |
| 3 | Backend engine (gating/mastery/state/scoring) | build | medium, specced |
| 4 | Content: 3 skill packs authored | write | yes, long pole |
| 5 | Auth + Stripe web billing | build | no |
| 6 | Analytics + retention/incognito plumbing | build | no |
| 7 | Landing + deploy (VPS + Postgres) | build | no |

## Timeline (solo, AI-assisted, ~full-time; part-time ~1.5-2x)

| Phase | Work | Duration | Cumulative | Milestone |
|---|---|---|---|---|
| Pre-flight | Immigration check (counsel) · delete transcripts · draft roleplay+scoring prompt | ~1-2 wks (parallel) | wk 0-2 | revenue gated on immigration |
| 0. Validate | Prototype (Vapi + prompt + landing, 3-7d) + 30-day distribution test | ~6 wks | wk 6 | GO / NO-GO decision |
| 1. One-mode MVP | Engine + thin app + voice wiring + auth/billing/analytics + 1 pack content + deploy | ~6-8 wks | wk 12-14 | soft-launchable one-mode app |
| 2. Full product | Author 2 more packs + incognito + polish + App Store | ~6-10 wks | wk 18-24 | 3-mode public launch |

**Headline: ~6 weeks to know if you should build. ~3 months to a chargeable one-mode app. ~5-6 months to the full three-mode product.** Only the week-6 gate is a real date now; everything after is conditional on validation clearing.

## Stage gates
- Do NOT build past Phase 0 until the validation thresholds clear (500 trials / 8% would-pay / 20% return).
- Immigration cleared before any revenue.
- Transcripts deleted before content authoring / public launch.
- The one-mode MVP is launchable on its own: soft-launch it and earn while building modes 2-3.
