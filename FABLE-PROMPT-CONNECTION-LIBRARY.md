# FABLE PROMPT: the connection content library + prompts + prompt-assembly (ICM-style)

Paste into Fable 5. It authors the plain-text content library, the character + feedback
system prompts, and the server-side prompt-assembly function, all anchored on ONE north
star: two people actually connecting. Design source (LOCKED, do not redesign, read for
grounding): PRD-CHARISMA-CHAT.md, packages/core (the schemas + validator + score + the
FakeChatModel contract), COMMUNICATION-PRINCIPLES.md (the clean EVERYDAY corpus). No
em-dashes anywhere.

---

You are Fable 5, authoring the content and prompts for a text-chat trainer whose entire
purpose is to help two people form a genuine connection. Make every decision yourself. Do
not ask questions. Be concrete: real files, real prompt text, real code. No em-dashes.

## THE NORTH STAR (anchor everything on this)

The product exists to create a genuine connection between two people. Not "charisma," not
"communication skills" as an end. The skills are the means; connection is the end. Every
skill, persona, prompt, and line of feedback must answer one question: DID THEY CONNECT?

Connection, defined precisely (encode this everywhere):
- It is MUTUAL: real curiosity about the other person AND letting yourself be seen. Pure
  questions with no self-disclosure is an interrogation, not a connection.
- Its depth comes from LISTENING, not from a bank of clever questions. The magic is the
  follow-up that could only exist because you actually heard them, never a memorized "deep
  question," which reads as a technique and kills connection.
- It is calibrated to the person and the moment (a date is not a networking floor).
- The character connects (warms) only when made to feel genuinely heard, and withdraws when
  performed at. The feedback names whether connection happened and exactly why.

## HARD CONTRACTS (the prompts MUST fit these; they already exist in packages/core)

- Character model call returns STRICT JSON: `{ reply, warmth_delta (-1|0|1), reason_code }`
  where reason_code is one of: open_question, followup, reciprocity, monologue, brag,
  ignored_content, neutral. Warmth is 0-3, server-held, injected each turn.
- Feedback model call returns STRICT JSON: `{ win:{text,quote}, fix:{text,anchor},
  moment:{text,quote}, labels:[...] }`. It proposes prose and labels only. It NEVER outputs
  a score (the score is deterministic, server-side).
- Countable signals the validator recomputes (reference them in the skills): open_questions,
  followups, reciprocity, spotlight_share, interview_mode, monologue_brag, final_warmth.

## SCOPE (confirmed): one skill and one persona DEEP, the rest scaffolded

Fully author the everyday-connection skill and the "Sam housewarming" persona (the loop
being tested now). Scaffold the other skills and personas as clearly-marked stubs with the
same file shape, so the structure is complete but the depth is focused.

## DELIVERABLE: author all of this under a new `content-library/` folder (ICM-style)

Interpretable Context Methodology: plain text, layered, every file human-editable, the
folder structure itself tells the server what to load. Produce:

### 1. The ICM library folder
```
content-library/
  README.md          how this library maps to the runtime (author vs serve), the north star
  CONTEXT.md         load order + which file feeds which prompt slice
  constraints/
    connection-northstar.md   the definition above, as the governing rule
    humanizer.md              the humanizer directives (below), the no-em-dash rule, tone
  skills/
    everyday-connection.md    FULL: principle, WHY-IT-CONNECTS, the observable signals
                              (mapped to the validator ids above) with band thresholds,
                              what connection this skill produces, the failure modes
                              (interrogation, monologue, flattery)
    <other ~7 skills>.md      STUBS: same shape, one-line intent each (open-questions,
                              reciprocity, reading-the-room, storytelling, yes-and,
                              make-the-ask, presence). Mark voice-only ones [voice].
  personas/
    sam-housewarming.md       FULL: who Sam is, hidden depth (the Pacific sailing trip),
                              warmth_rules (+/- behaviors), behavior_by_warmth 0..3, opener,
                              and a HUMAN voice (short, flat, real, per the humanizer)
    <2-3 others>.md           STUBS: coworker back from a trip, guarded friend-of-a-friend,
                              a first date. Same shape, brief.
  library/
    talks.md                  the go-deeper references (Headlee "10 ways", Duarte story,
                              Meyer "spot a liar", Boroditsky language, etc.) each mapped to
                              the skill it deepens. Reference-only, clean-room.
```

### 2. The system prompts (author as files under content-library/prompts/)
- `character-system-prompt.md`: the template the server renders every turn. It composes:
  the persona brief + hidden depth + warmth_rules + behavior at the CURRENT warmth level +
  the humanizer + the ONE goal (be a real person who connects or withdraws based on whether
  the user makes you feel genuinely heard; reveal depth only when connection is earned).
  It must demand the STRICT `{reply, warmth_delta, reason_code}` JSON. Mark the cacheable
  static prefix vs the per-turn variable suffix (for prompt caching).
- `feedback-prompt.md`: anchored on "did they connect?" It quotes the exact moment
  connection happened or failed, names the paradox (they became more interesting the moment
  they made the other person feel interesting), stays humanized, and emits the STRICT
  `{win, fix, moment, labels}` JSON with NO score. The FIX is the single highest-leverage
  move toward deeper connection next time.

Both prompts must obey `humanizer.md`: talk like a real person texting, short, contractions,
fragments ok; no em-dashes; never "delve, crucial, robust, genuinely, that said"; not
relentlessly helpful or agreeable; no rule-of-three or tidy summaries; let it be uneven;
match the persona's energy, never a chatbot's.

### 3. The assemble-the-prompt function (author real code under packages/core or apps/server)
Two pure-ish functions, the "librarian" that builds each call from three layers:
- `assembleCharacterTurn({ persona, unit, warmth, transcript, userProfile })` -> the exact
  messages/system for `ChatModel.complete(tag:'character')`. Static cacheable prefix =
  character-system-prompt rendered with the persona + humanizer + constraints. Variable
  suffix = current warmth + the transcript + a COMPACT user-profile summary.
- `assembleFeedback({ unit, transcript, userProfile })` -> the messages/system for
  `ChatModel.complete(tag:'feedback')`.
- `renderUserProfile(projection)` -> a <=5-line summary from the user's event-log
  projections: goal, mastered skills, current struggle (with the signal that shows it), last
  session note. Content-free (skill state and signals only, never the user's actual words).
Specify where each layer comes from (persona + unit from the loaded content pack; warmth +
transcript from the session; userProfile from the DB projections), and mark the cacheable
prefix so prompt caching keeps the cost near-zero.

### 4. Real-API readiness
Everything must run unchanged against `AnthropicChatModel` (Haiku) when
`MODEL_PROVIDER=anthropic`. The point of this whole deliverable: when the key is added and
the provider flips, the character has the persona, the humanizer, the routed skill, and the
user's profile all assembled into every turn, and it produces a real, connective
conversation, not a scripted stub.

## Output
The folder tree, the full content of each authored (non-stub) file, brief stubs for the
rest, both prompt files verbatim, and the assemble functions as real code. Decide
everything. The test of success: a competent dev drops this in, flips to the Anthropic API,
and Sam feels like a real person who connects only when you actually make them feel heard.
