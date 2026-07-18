# Research plan: make sure people actually transform

Two goals: (1) find the competitive white space, and (2) ground the pedagogy in what actually
changes behavior, so the app produces real transformation, not just in-app scores. No em-dashes.

## Part 1: Competitor review mining (top 15 apps)
Mine App Store + Google Play reviews for the top ~15 competitor apps to surface what users
hate (churn + gaps = our wedge), what they love (table stakes), and pricing gripes.
- **Tools: free only.** Apple customer-reviews RSS (curl, ~500 recent/app), google-play-
  scraper (free library) or gstack /scrape. Apify only if we later need scale; not for v1.
- **App set (buckets):** AI speaking coaches (Yoodli, Orai, Speeko, Poised, Ummo), speaking/
  English (Speak, ELSA), AI companions / conversation (Character.AI, Replika, Paradot),
  dating/rizz charisma (Rizz, YourMove, Plug AI), social-skills/confidence apps.
- **Extract + rank:** recurring pain points (weight 1 to 2 star reviews), stated churn/cancel
  reasons, most-loved features, pricing complaints, unmet needs. Rank themes by frequency
  across apps.
- **Output:** COMPETITOR-REVIEW-MINING.md (ranked pain table with example quotes, loved
  features, pricing signals, top white-space opportunities).
- **Pair with existing:** the Reddit pain-point method already used (`_painpoints_reddit.md`,
  158 scored posts) is the same engine on a different source.

## Part 2: Efficacy grounding (clean-room)
Make sure the pedagogy targets what actually drives transformation.
- **Private extraction:** read the guru material (Vinh STAGE, Matt Ryder) as REFERENCE ONLY to
  understand which drills, sequences, and concepts actually change behavior. This is research
  input, not shippable content.
- **The IP line (hard):** ideas and techniques are not copyrightable, expression is. Extract
  PRINCIPLES, never wording, branded framework names, structure, or the transcripts
  themselves. Shippable content stays in COMMUNICATION-PRINCIPLES.md, authored from public
  canon. Guru transcripts stay in SOURCE-DO-NOT-SHIP/ as reference. Respect the course TOS.
- **Validate:** cross-check that COMMUNICATION-PRINCIPLES.md's skills and band thresholds
  target the behaviors the proven teachers actually move, and fill gaps from public research.

## Part 3: Transformation measurement (prove it works)
Copying a guru does not prove transformation; real user results do.
- Design the app to measure REAL-WORLD improvement, not only in-app score: self-reported
  before/after on a concrete situation, specific-event outcomes ("how did the date/interview
  go"), longitudinal score trend, and optional real-world challenge check-ins.
- This is the 4 Room "validated transformations" model applied here: the honest proof, and
  the strongest retention and word-of-mouth driver. Weak transformation kills the funnel no
  matter how good conversion is.

## Sequence
Part 1 runs now (background job). Part 2 after, as a clean-room pass. Part 3 folds into the
PRD as measurement events once Parts 1 to 2 inform the metrics.
