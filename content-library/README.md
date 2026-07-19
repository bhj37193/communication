# content-library

The human-editable source of everything the model ever sees: skills, personas, the two
system prompts, and the constraints that govern them. Plain text, layered, ICM-style. The
folder structure tells you what feeds what; CONTEXT.md gives the exact load order.

## The north star

The product exists to create a genuine connection between two people. The skills are the
means; connection is the end. Every file in this library answers one question: DID THEY
CONNECT? The full definition lives in `constraints/connection-northstar.md` and governs
every other file here.

## Author vs serve

This folder is the AUTHOR layer. Nothing in here is read by the server at runtime. The
SERVE layer is code and JSON that the runtime actually loads:

| author file (edit here)              | serve artifact (fold changes into)                      |
| ------------------------------------ | ------------------------------------------------------- |
| personas/sam-housewarming.md         | packages/core/content/everyday.housewarming-sam.json    |
| skills/everyday-connection.md        | same JSON: unit.principle, unit.rubric, pack.signals    |
| prompts/character-system-prompt.md   | packages/core/assemble.ts (characterSystem)             |
| prompts/feedback-prompt.md           | packages/core/assemble.ts (feedbackSystem)              |
| constraints/*.md                     | embedded in both prompt renderers in assemble.ts        |
| library/talks.md                     | never served; author-time reference only                |

Workflow: edit the md file, fold the change into the serve artifact on the right, run
`pnpm --filter @charisma/core test`. The tests assert the invariants that matter (strict
JSON contracts present, no em-dashes, static prefix stays static), so drift fails fast.

Why the duplication is deliberate: the runtime stays pure (no fs reads from packages/core,
no parsing md at request time), and the md stays readable by a human who has never seen
the code. The md is where you think; the JSON/TS is where it ships.

## Layout

```
constraints/   the rules that govern everything (north star, humanizer)
skills/        one file per skill; everyday-connection is FULL, the rest are stubs
personas/      one file per character; sam-housewarming is FULL, the rest are stubs
prompts/       the two system prompt templates, verbatim, with slot markers
library/       go-deeper references mapped to skills (reference only, clean-room)
```

## Runtime flow (so you know what your edits touch)

Every character turn: `assembleCharacterTurn({persona, unit, warmth, transcript,
userProfile})` renders a STATIC system prompt (persona + humanizer + north star + JSON
contract, cacheable, identical every turn) plus a VARIABLE first message carrying current
warmth and a compact user profile, then the transcript. The model returns strict
`{reply, warmth_delta, reason_code}` JSON; the server holds warmth and clamps it 0..3.

Session end: `assembleFeedback({unit, transcript, userProfile})` renders the feedback
system prompt and the labeled transcript. The model returns strict `{win, fix, moment,
labels}` JSON with quotes that must substring-match the real transcript (the validator
rejects fabrications). It never outputs a score; the score is deterministic, server-side.
