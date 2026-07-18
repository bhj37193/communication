# FABLE PROMPT: emit the moat as verified code (packages/core)

Paste into Fable 5 as a SEPARATE run from the execution-plan prompt. This one produces
actual, test-passing TypeScript for the irreplaceable pure-logic core (the deterministic
validator, the score, the schemas, the model interface, the Fake), so Sonnet agents build
plumbing around VERIFIED logic instead of re-deriving the moat. Design source is
PRD-CHARISMA-CHAT.md, Sections 3.4, 4.1 to 4.7, and 6.2 (restated inline where load-bearing).

---

You are Fable 5, principal engineer. Produce complete, compiling, test-passing TypeScript for
the `packages/core` package of a charisma chat trainer. This is pure, self-contained logic:
no network, no database, no framework, no external service. Output real code in clearly
labeled files, not prose descriptions. **Make every decision yourself. Do not ask questions.**
No em-dashes anywhere (commas, colons, periods, parentheses).

Target: Node 22, TypeScript strict, Zod, and a test runner (Vitest). Everything must
typecheck and every test must pass with `pnpm --filter core test`. If any rule below is
ambiguous, choose the stricter interpretation and note it in a one-line comment.

## Files to emit (real code)

1. **`schemas.ts`** Zod schemas for: `ChatMessage`, the character model output
   `{ reply, warmth_delta: -1|0|1, reason_code: enum }` (reason_code enum: open_question,
   followup, reciprocity, monologue, brag, ignored_content, neutral), the feedback model
   output `{ win:{text,quote}, fix:{text,anchor}, moment:{text,quote}, labels:string[] }`,
   the `Unit`, `Skill`, `SkillPack`, `SignalDef`, and `RubricLine` types, and the computed
   `Signals` object. Export inferred TS types.

2. **`model.ts`** the `ChatModel` interface exactly as in PRD Section 3.4 (`complete(req:
   { system, messages, maxTokens, json?, tag:'character'|'feedback' })`), plus a
   `TokenUsage` type. Interface only, no implementation.

3. **`fakes/FakeChatModel.ts`** a `FakeChatModel implements ChatModel` that replays scripted
   outputs so the whole loop is exercisable offline. It must support at least two scripted
   sessions against the Sam unit (Section 6.2): a GOOD run whose user messages ask open
   questions, follow up, and reciprocate, driving warmth 0 to 3 and passing; and a BAD run
   that monologues/brags/self-focuses, keeping warmth at 0 and failing. For `tag:'character'`
   it returns the next scripted `{reply, warmth_delta, reason_code}`; for `tag:'feedback'` it
   returns a valid feedback JSON that cites REAL quotes from the scripted transcript (so the
   evidence check passes) plus one variant that cites a FABRICATED quote (so a test can prove
   the validator rejects it).

4. **`validator.ts`** the deterministic validator from PRD Section 4.5, as pure functions,
   zero I/O, zero inference:
   - message classifiers on user messages: `is_question` (contains `?`), `is_open_question`
     (question AND matches the curated open-starter list AND not the closed-starter list;
     ship both lists as constants and unit-test them), `is_followup` (shares a stemmed,
     stopword-filtered content word >= 4 chars with the character's immediately previous
     message, or an explicit back-reference), `is_self_disclosure` (non-question, first
     person I/my/we, >= 6 words), and `word_count`.
   - recomputed signals exactly per the PRD: `open_questions`, `followups`, `reciprocity`
     (self-disclosure occurring AFTER the first character turn at warmth >= 2),
     `spotlight_share`, `interview_mode` (any run of 3+ consecutive user questions with zero
     self-disclosure), `monologue_brag` (any user message > 60 words, OR a model brag flag
     WHOSE quoted evidence substring-matches the transcript), `final_warmth`.
   - the evidence check: every quote in the feedback JSON must be an exact substring of the
     correct speaker's concatenated messages after whitespace normalization; one failure
     rejects the whole feedback object (the caller regenerates once, then falls back to
     template feedback; expose both the check and a `buildTemplateFeedback(signals)` helper).
   - the pass rule: every `hard` rubric line's signal must land inside its band (bands, not
     floors).

5. **`score.ts`** the exact deterministic score from PRD Section 4.6:
   `clamp(0,100, 40 + 8*min(open_questions,3) + 10*min(followups,2) + 10*min(reciprocity,1)
   + 10*(spotlight_share in [0.4,0.7] ? 1:0) + 5*final_warmth - 20*interview_mode
   - 20*monologue_brag)`. Weights sourced from the pack SignalDefs where the PRD says so, but
   default to these constants. Pure function `score(signals): number`.

6. **`content/everyday.housewarming-sam.json`** the Sam unit exactly as PRD Section 6.2, plus
   the everyday pack's SignalDefs and the open/closed starter word lists, all Zod-validated by
   a test.

7. **`validator.test.ts`, `score.test.ts`, `schemas.test.ts`** the fixture suite with
   KNOWN-ANSWER assertions: run the FakeChatModel GOOD run through the validator and assert
   every signal's exact value, the pass result true, and the exact score; do the same for the
   BAD run (fail, low score); assert `is_open_question` and `is_followup` against a table of
   hand-labeled fixture messages (include tricky cases: "do you sail?" is closed, "what's it
   like out there?" is open, a bare "that's so cool!" is neutral and moves nothing); assert
   the fabricated-quote feedback is rejected and the template fallback is produced; assert
   band edges (7 open questions fails the max, one 70-word message trips monologue_brag).

## Rules

- Real, complete, compiling code. No `// TODO` in the logic paths, no pseudocode, no omitted
  function bodies. If you must stub, stub only outside `packages/core`.
- Deterministic and pure: the same transcript yields the same signals and the same score,
  every time. No randomness, no clock dependence in the scored logic.
- The tests are the deliverable's proof. They must express the known-answer values explicitly
  so a human or agent can see the moat is correct by reading the assertions.
- Match the PRD's names and formulas exactly. If you improve a classifier, keep the PRD
  behavior as the default and note the change in a comment.

Output the files in dependency order (schemas, model, fakes, validator, score, content,
tests), each in its own labeled code block, ready to drop into `packages/core`.
