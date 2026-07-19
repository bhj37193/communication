# How to run the Fable prompts

Four driver prompts. Paste each into Fable (which can write files here). Run SEPARATELY in
this order for best quality; the combined one-paste version at the bottom trades quality for
convenience. All treat PRD-CHARISMA-CHAT.md as locked input. No em-dashes in any output.

## 1. Core code (run first, most important)
```
Read /Users/main/Desktop/Active Projects/communication/FABLE-PROMPT-CORE-CODE.md and
/Users/main/Desktop/Active Projects/communication/PRD-CHARISMA-CHAT.md. Execute the
CORE-CODE prompt in full: emit complete, compiling, test-passing TypeScript for
packages/core exactly as specified. Write the actual files into
/Users/main/Desktop/Active Projects/communication/packages/core/ (schemas.ts, model.ts,
fakes/FakeChatModel.ts, validator.ts, score.ts, content/everyday.housewarming-sam.json,
and the *.test.ts files). If you cannot write multiple files, write one document to
/Users/main/Desktop/Active Projects/communication/FABLE-OUT-CORE-CODE.md with each file in
a labeled code block. Then reason through the fixture tests and report pass/fail per test.
No em-dashes.
```

## 2. Venture dossier (run second) -- CHUNKED (the full-dossier single run stalls mid-stream)
The full 14-section dossier is too large for one response and stalls. Run it as three
smaller pastes, each writing its own file, then concatenate.

### 2a. Technical + trust (sections 1-5)
```
Read /Users/main/Desktop/Active Projects/communication/FABLE-PROMPT-VENTURE-DOSSIER.md and
/Users/main/Desktop/Active Projects/communication/PRD-CHARISMA-CHAT.md. Execute ONLY sections
1 through 5 (Executive summary, Architecture and technical decisions, Data schema and logic,
User-data handling and privacy, Security). Write just those sections to
/Users/main/Desktop/Active Projects/communication/VENTURE-DOSSIER-1-tech.md. Produce the full
sections, do not summarize. No em-dashes.
```

### 2b. Money (sections 6-9)
```
Read /Users/main/Desktop/Active Projects/communication/FABLE-PROMPT-VENTURE-DOSSIER.md and
/Users/main/Desktop/Active Projects/communication/PRD-CHARISMA-CHAT.md. Execute ONLY sections
6 through 9 (Business model and pricing, Unit economics, Financial projection, Tax spec).
Write just those sections to
/Users/main/Desktop/Active Projects/communication/VENTURE-DOSSIER-2-money.md. Show arithmetic
on every figure; mark every tax or legal rate as "confirm with professional". Produce the full
sections, do not summarize. No em-dashes.
```

### 2c. Behavior + risk (sections 10-14)
```
Read /Users/main/Desktop/Active Projects/communication/FABLE-PROMPT-VENTURE-DOSSIER.md and
/Users/main/Desktop/Active Projects/communication/PRD-CHARISMA-CHAT.md. Execute ONLY sections
10 through 14 (Motivation and retention loop, Content safety and age policy, Risk register and
pre-mortem, Unknown unknowns, Human-gate callouts). Write just those sections to
/Users/main/Desktop/Active Projects/communication/VENTURE-DOSSIER-3-behavior-risk.md. Produce
the full sections, do not summarize. No em-dashes.
```

Then concatenate the three into VENTURE-DOSSIER.md. If any chunk stalls, retry it (transient);
if it reliably stalls, split that chunk further (e.g. 6-7 then 8-9).

## 3. Build-execution plan (run third)
```
Read /Users/main/Desktop/Active Projects/communication/FABLE-PROMPT-BUILD-EXECUTION.md and
/Users/main/Desktop/Active Projects/communication/PRD-CHARISMA-CHAT.md. Execute the
build-execution prompt in full. Write the plan to
/Users/main/Desktop/Active Projects/communication/BUILD-EXECUTION-PLAN.md. Go deep on
Phase 0; include the mock boundary, the task DAG with per-task acceptance commands, and the
full human-gate register. Produce the whole document, do not summarize. No em-dashes.
```

## 4. Proven progress / validity layer (run after core code lands)
```
Read /Users/main/Desktop/Active Projects/communication/FABLE-PROMPT-PROVEN-PROGRESS.md and
/Users/main/Desktop/Active Projects/communication/PRD-CHARISMA-CHAT.md and
/Users/main/Desktop/Active Projects/communication/POSITIONING.md. Execute the
PROVEN-PROGRESS prompt in full: design and build the checkpoint/benchmark-retest mechanism
and the validity roadmap exactly as specified. Write real schema/content diffs into
packages/core/ and content-library/. If you cannot write multiple files, write one document
to /Users/main/Desktop/Active Projects/communication/FABLE-OUT-PROVEN-PROGRESS.md with each
file in a labeled code block. No em-dashes.
```

## 5. Empire: 4-skill pivot (financial model + content roadmap + research methodology)
THREE independent sections in one file. Paste each into its OWN separate Fable session
and run all three at the same time; they do not depend on each other and each writes
its own output file, so there is no interference. This is a bigger scope decision than
prompts 1-4 (expanding from one trained skill to four on the same app), read
FABLE-PROMPT-EMPIRE.md's shared-context block once before pasting any section.

### 5a. Financial model (paste into session A)
```
Read /Users/main/Desktop/Active Projects/communication/FABLE-PROMPT-EMPIRE.md and execute
ONLY "PART 1" in full: build the 20-year financial model with explicit named assumptions,
shown arithmetic, and bear/conservative/realistic cases, anchored to the real unit
economics in AVATAR-TIER-PRICING.md and BUSINESS-MODEL-CONVERSION.md. Write the full
document to /Users/main/Desktop/Active Projects/communication/FINANCIAL-MODEL-20YR.md.
No em-dashes.
```

### 5b. Content roadmap (paste into session B)
```
Read /Users/main/Desktop/Active Projects/communication/FABLE-PROMPT-EMPIRE.md and execute
ONLY "PART 2" in full: define and differentiate the 4 candidate skills, then write a
zero-to-mastery curriculum direction per skill using only the existing engine. Write the
full document to
/Users/main/Desktop/Active Projects/communication/CONTENT-ROADMAP-4-SKILLS.md.
No em-dashes.
```

### 5c. Research methodology (paste into session C)
```
Read /Users/main/Desktop/Active Projects/communication/FABLE-PROMPT-EMPIRE.md and execute
ONLY "PART 3" in full: recommend the research approach and tooling (web search/fetch vs.
paid API vs. Apify-class scraper) for this project's market/competitor research needs.
Write the full document to
/Users/main/Desktop/Active Projects/communication/RESEARCH-METHODOLOGY.md.
No em-dashes.
```

After all three land: check FINANCIAL-MODEL-20YR.md's assumptions against
CONTENT-ROADMAP-4-SKILLS.md's build-order recommendation (a skill that is expensive/slow
to build should not be assumed cheap in the financial model), and confirm the final skill
names in the content roadmap (section 0 there may rename the working-assumption list)
before treating the financial model's numbers as final, since neither session sees the
other's output.

## Combined (one paste, lower quality, use only if short on time)
```
Do these in order, each as a fully-completed separate output, all in
/Users/main/Desktop/Active Projects/communication/. Treat PRD-CHARISMA-CHAT.md as locked
input for all. Finish each output completely before starting the next.
1) Execute FABLE-PROMPT-CORE-CODE.md -> write packages/core/*.ts files (or FABLE-OUT-CORE-CODE.md).
2) Execute FABLE-PROMPT-VENTURE-DOSSIER.md -> write VENTURE-DOSSIER.md.
3) Execute FABLE-PROMPT-BUILD-EXECUTION.md -> write BUILD-EXECUTION-PLAN.md.
4) Execute FABLE-PROMPT-PROVEN-PROGRESS.md -> write schema/content diffs (or FABLE-OUT-PROVEN-PROGRESS.md).
No em-dashes anywhere.
```

## After the runs
Reconcile the outputs: check the dossier's unit-economics numbers against the PRD, confirm
the core-code tests actually pass before agents build on them, and confirm the proven-progress
schema additions don't break the core-code tests (re-run core/server test suites after).
