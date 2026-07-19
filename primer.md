# Primer: Charisma Trainer -> 5-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19._

## STATUS
Working tree clean, all committed/pushed to origin/main. No code changes
yet. Autopilot is mid Phase 0 (Expansion) for "all-5-skills
implementation." Key discovery: PRD-CHARISMA-CHAT.md already contains a
full technical design at "SECTION 2: SHARED ENGINE, NOT 5 SEPARATE APPS"
(around line 895+) -- Phase 0/1 design work is largely already written,
not something to re-derive. A research agent was asked to confirm the
CURRENT code baseline (what schemas.ts/validator.ts/score.ts/sessions.ts
actually have today) and had not reported back before this context
rotation; treat as not received, re-ask if needed.

## COMPLETED THIS SESSION
Nothing written to disk yet.

## EXACT NEXT STEP
1. Read PRD-CHARISMA-CHAT.md lines ~895-993 ("SECTION 2: SHARED ENGINE,
   NOT 5 SEPARATE APPS") directly -- it specifies the diff precisely:
   - §2.1 reused UNCHANGED (zero code changes): server state machine,
     mastery gate logic, event-sourced progress, prompt assembly split,
     CharacterOutputSchema/FeedbackOutputSchema (byte-for-byte), warmth
     mechanism, evidence machinery (checkEvidence, normalizeWhitespace,
     contentWords), template-feedback fallback/streak/caps/circuit
     breakers.
   - §2.2 genuinely new, ALL ADDITIVE (new exports only, nothing
     rewritten): per-skill content-library files; new *SignalsSchema
     exports (ProblemSignalsSchema, CriticalSignalsSchema,
     DecisionSignalsSchema, BehaviorSignalsSchema) alongside unchanged
     SignalsSchema; UnitSchema.extend() per pack (base UnitSchema
     untouched); new validator-{problem,critical,decision,behavior}.ts
     files (each exports computeSignals/signalValue/own passes, reusing
     isQuestion/isFollowup/contentWords/normalizeWhitespace from
     validator.ts; validator.ts's passes() untouched); new *_WEIGHTS +
     score{Problem,Critical,Decision,Behavior} in score.ts (DEFAULT_
     WEIGHTS and score() untouched); new closed reason-code enums per
     pack + CharacterOutput variant by extension; new feedback prompt
     text per pack (same FeedbackOutputSchema).
2. Confirm current-code baseline against §2.1/§2.2 (read schemas.ts,
   validator.ts, score.ts, sessions.ts to verify what exists today vs
   what's new) -- should be fast now that the target diff is known.
3. Write `.omc/plans/autopilot-impl.md` (Phase 1), then implement in
   dependency order: schemas.ts additions -> 4 validator-*.ts files (can
   parallelize, all independent/additive) -> score.ts additions -> wire
   into sessions.ts/services as needed -> §2.3 mastery_level read-time
   function (per CONTENT-ROADMAP-4-SKILLS.md, verify not already done).
4. QA (build/test per project memory commands), then validation pass.

## LOCKED DECISIONS (do not re-litigate)
5-skill taxonomy (Communication, Problem-Solving, Critical Thinking,
Decision-Making, Behavior Science). Non-AI drill self-attested pass; 8
drill reps + 1 AI capstone/stage; expert anchors credibility-only; no
pricing content in curriculum; engine extends never redesigns (confirmed
again by PRD §2: additive-only, nothing rewritten); connection/clarity
north stars parallel. `prd.md` obsolete, PRD-CHARISMA-CHAT.md is source
of truth. mastery_level (§2.3 of CONTENT-ROADMAP-4-SKILLS.md) is
per-skill 0-10, computed not stored, caps at 6 until stage 7+ content
exists.

## OUTSTANDING OPS
App-store tasks #1 (name), #2 (icon/screenshots), #4 (Apple Developer
enrollment) remain user-blocked; #3 (privacy policy) done, live at
https://bhj37193.github.io/communication/. Repo `bhj37193/communication`
is PUBLIC (GitHub Pages). FABLE-PROMPT-PROVEN-PROGRESS.md deferred.

## DOC REFS
PRD-CHARISMA-CHAT.md (esp. SECTION 2, ~L895-993) |
CONTENT-ROADMAP-4-SKILLS.md §2.3 | ALPHA-MODEL-ANALYSIS.md |
packages/core/{schemas,validator,score}.ts | apps/server/src/routes/
sessions.ts | apps/server/src/services/{fold,router,profile,caps}.ts
