// packages/core/validator.test.ts
// Known-answer fixture suite: every signal value is asserted explicitly so a
// human or agent can see the moat is correct by reading the assertions.
import { describe, expect, it } from 'vitest';
import {
  CLOSED_STARTERS,
  OPEN_STARTERS,
  buildTemplateFeedback,
  checkEvidence,
  claritySignalValue,
  computeClaritySignals,
  computeSignals,
  isFollowup,
  isOpenQuestion,
  isQuestion,
  isSelfDisclosure,
  passes,
  passesClarity,
  wordCount,
} from './validator';
import { score } from './score';
import {
  FeedbackOutputSchema,
  RubricLineSchema,
  type ChatMessage,
  type ClaritySignals,
  type Signals,
} from './schemas';
import {
  FakeChatModel,
  SAM_BAD_RUN,
  SAM_GOOD_RUN,
  playSession,
} from './fakes/FakeChatModel';
import pack from './content/everyday.housewarming-sam.json';

const rubric = RubricLineSchema.array().parse(pack.unit.rubric);

describe('starter lists', () => {
  it('ship the PRD 4.5 entries and match the content pack', () => {
    for (const s of ['what', 'how', 'why', 'tell me', 'walk me through', 'where did']) {
      expect(OPEN_STARTERS).toContain(s);
    }
    for (const s of ['do you', 'did you', 'are you', 'have you', 'can i']) {
      expect(CLOSED_STARTERS).toContain(s);
    }
    expect(pack.open_starters).toEqual(Array.from(OPEN_STARTERS));
    expect(pack.closed_starters).toEqual(Array.from(CLOSED_STARTERS));
  });
});

describe('is_open_question hand-labeled table', () => {
  const cases: Array<[string, boolean]> = [
    ['do you sail?', false], // closed starter
    ["what's it like out there?", true], // open starter
    ["that's so cool!", false], // not even a question
    ['How do you know the host, by the way?', true], // "do you" mid-sentence does not close it
    ['Where did you grow up?', true],
    ['Tell me about the crossing?', true],
    ['Tell me about the crossing.', false], // no question mark, not a question
    ['whatever happened to the boat?', false], // starter must be a whole word
    ['Are you serious?', false],
    ['Moved back? From where?', false], // question, but no listed starter at the start
  ];
  for (const [text, expected] of cases) {
    it(`${JSON.stringify(text)} -> ${expected}`, () => {
      expect(isOpenQuestion(text)).toBe(expected);
    });
  }
});

describe('is_followup hand-labeled table', () => {
  const prev = 'I spent five months crewing a sailboat across the Pacific.';
  it('shares a content word with the previous character message', () => {
    expect(isFollowup("What's it like living on a sailboat?", prev)).toBe(true);
  });
  it('explicit back-reference "you said" counts', () => {
    expect(isFollowup('You said five months, right?', prev)).toBe(true);
  });
  it('unrelated question is not a follow-up', () => {
    expect(isFollowup('Do you like cheese?', prev)).toBe(false);
  });
  it('stemming matches sail/sailing', () => {
    expect(isFollowup('Where do you sail?', 'I love sailing these days.')).toBe(true);
  });
  it('no shared content words means no follow-up', () => {
    expect(isFollowup('Nice weather today.', prev)).toBe(false);
  });
  it('no previous character message means no follow-up', () => {
    expect(isFollowup('What about that?', undefined)).toBe(false);
  });
});

describe('is_self_disclosure', () => {
  it('first person, non-question, >= 6 words', () => {
    expect(
      isSelfDisclosure('I moved here two years ago and it took a while to settle.'),
    ).toBe(true);
  });
  it('too short fails', () => {
    expect(isSelfDisclosure('I agree.')).toBe(false);
  });
  it('questions are never self-disclosure', () => {
    expect(isSelfDisclosure('What do I know?')).toBe(false);
  });
  it('no first person fails', () => {
    expect(isSelfDisclosure('People around here seem friendly enough tonight.')).toBe(false);
  });
});

describe('bare flattery is neutral and moves nothing', () => {
  const flattery = "that's so cool!";
  it('is not a question, not open, not disclosure, not follow-up', () => {
    expect(isQuestion(flattery)).toBe(false);
    expect(isOpenQuestion(flattery)).toBe(false);
    expect(isSelfDisclosure(flattery)).toBe(false);
    expect(
      isFollowup(flattery, 'I spent five months crewing a sailboat across the Pacific.'),
    ).toBe(false);
  });
});

describe('GOOD run through the validator (known answers)', () => {
  it('warms Sam to 3, computes exact signals, passes, scores 100', async () => {
    const { transcript, warmthTrace } = await playSession(
      new FakeChatModel(SAM_GOOD_RUN),
      SAM_GOOD_RUN,
    );
    expect(warmthTrace).toEqual([0, 1, 2, 3, 3, 3]);
    const signals = computeSignals(transcript, warmthTrace);
    expect(signals).toEqual({
      open_questions: 3,
      followups: 2,
      reciprocity: 2,
      spotlight_share: 0.6, // 3 of 5 user messages are about Sam
      interview_mode: false,
      monologue_brag: false,
      final_warmth: 3,
    });
    expect(passes(signals, rubric)).toBe(true);
    // Raw formula value is 119 (40 + 24 + 20 + 10 + 10 + 15), clamped to 100.
    expect(score(signals)).toBe(100);
  });
});

describe('BAD run through the validator (known answers)', () => {
  it('keeps Sam flat, computes exact signals, fails, scores 20', async () => {
    const { transcript, warmthTrace } = await playSession(
      new FakeChatModel(SAM_BAD_RUN),
      SAM_BAD_RUN,
    );
    expect(warmthTrace).toEqual([0, 0, 0, 0, 0, 0]);
    const signals = computeSignals(transcript, warmthTrace);
    expect(signals).toEqual({
      open_questions: 0,
      followups: 0,
      reciprocity: 0,
      spotlight_share: 0.2, // 1 of 5 user messages is about Sam
      interview_mode: false,
      monologue_brag: true, // the 70-word opener monologue
      final_warmth: 0,
    });
    expect(passes(signals, rubric)).toBe(false);
    // 40 + 0 + 0 + 0 + 0 + 0 - 20 = 20.
    expect(score(signals)).toBe(20);
  });

  it('the monologue message is exactly 70 words, which trips the > 60 rule', () => {
    expect(wordCount(SAM_BAD_RUN.userMessages[0]!)).toBe(70);
  });
});

describe('interview_mode', () => {
  const q = (content: string): ChatMessage => ({ role: 'user', content });
  const c = (content: string): ChatMessage => ({ role: 'character', content });

  it('three consecutive user questions trip it', () => {
    const transcript: ChatMessage[] = [
      c('Hey.'), q('Do you run?'), c('No.'), q('Do you swim?'), c('No.'),
      q('Do you bike?'), c('No.'),
    ];
    expect(computeSignals(transcript, [0, 0, 0, 0]).interview_mode).toBe(true);
  });

  it('a self-disclosure between questions breaks the run', () => {
    const transcript: ChatMessage[] = [
      c('Hey.'),
      q('Do you run?'), c('No.'),
      q('Do you swim?'), c('No.'),
      { role: 'user', content: 'I swim every morning before work honestly.' }, c('Okay.'),
      q('Do you bike?'), c('No.'),
    ];
    expect(computeSignals(transcript, [0, 0, 0, 0, 0]).interview_mode).toBe(false);
  });
});

describe('monologue word-count band edge', () => {
  const c: ChatMessage = { role: 'character', content: 'Hey.' };
  it('61 words trips monologue_brag, 60 does not', () => {
    const msg61: ChatMessage = { role: 'user', content: Array(61).fill('word').join(' ') };
    const msg60: ChatMessage = { role: 'user', content: Array(60).fill('word').join(' ') };
    expect(computeSignals([c, msg61], [0]).monologue_brag).toBe(true);
    expect(computeSignals([c, msg60], [0]).monologue_brag).toBe(false);
  });
});

describe('model brag flag evidence', () => {
  it('counts only when the quote matches the USER transcript', async () => {
    const { transcript, warmthTrace } = await playSession(
      new FakeChatModel(SAM_GOOD_RUN),
      SAM_GOOD_RUN,
    );
    // Real user substring: confirmed.
    expect(
      computeSignals(transcript, warmthTrace, { quote: 'I sleep with the window open' })
        .monologue_brag,
    ).toBe(true);
    // Fabricated quote: discarded.
    expect(
      computeSignals(transcript, warmthTrace, { quote: 'I am basically a sailing expert' })
        .monologue_brag,
    ).toBe(false);
    // A character line is the wrong speaker for a user brag: discarded.
    expect(
      computeSignals(transcript, warmthTrace, { quote: 'the ocean is breathing' })
        .monologue_brag,
    ).toBe(false);
  });
});

describe('evidence check and template fallback', () => {
  it('accepts feedback whose quotes are real, both runs', async () => {
    const good = await playSession(new FakeChatModel(SAM_GOOD_RUN), SAM_GOOD_RUN);
    const bad = await playSession(new FakeChatModel(SAM_BAD_RUN), SAM_BAD_RUN);
    expect(checkEvidence(SAM_GOOD_RUN.feedback, good.transcript)).toBe(true);
    expect(checkEvidence(SAM_BAD_RUN.feedback, bad.transcript)).toBe(true); // numeric anchor path
  });

  it('rejects the fabricated-quote variants from the FakeChatModel', async () => {
    const good = await playSession(new FakeChatModel(SAM_GOOD_RUN), SAM_GOOD_RUN);
    const bad = await playSession(new FakeChatModel(SAM_BAD_RUN), SAM_BAD_RUN);
    const fakeGood = new FakeChatModel(SAM_GOOD_RUN, { fabricateFeedbackQuote: true });
    const res = await fakeGood.complete({
      system: '', messages: [], maxTokens: 700, json: FeedbackOutputSchema, tag: 'feedback',
    });
    const fabricated = FeedbackOutputSchema.parse(res.json);
    expect(checkEvidence(fabricated, good.transcript)).toBe(false);
    expect(checkEvidence(SAM_BAD_RUN.fabricatedFeedback, bad.transcript)).toBe(false);
  });

  it('rejects a win quote taken from the wrong speaker', async () => {
    const { transcript } = await playSession(new FakeChatModel(SAM_GOOD_RUN), SAM_GOOD_RUN);
    const wrongSpeaker = {
      ...SAM_GOOD_RUN.feedback,
      win: { text: 'Nice line.', quote: "I think I'm mostly here for the snacks." },
    };
    expect(checkEvidence(wrongSpeaker, transcript)).toBe(false);
  });

  it('normalizes whitespace before matching', async () => {
    const { transcript } = await playSession(new FakeChatModel(SAM_GOOD_RUN), SAM_GOOD_RUN);
    const spaced = {
      ...SAM_GOOD_RUN.feedback,
      win: {
        text: 'Great follow-up.',
        quote: "What's   the loudest quiet like at   three in the morning?",
      },
    };
    expect(checkEvidence(spaced, transcript)).toBe(true);
  });

  it('fabricated feedback falls back to schema-valid template feedback', async () => {
    const { transcript, warmthTrace } = await playSession(
      new FakeChatModel(SAM_GOOD_RUN),
      SAM_GOOD_RUN,
    );
    const signals = computeSignals(transcript, warmthTrace);
    expect(checkEvidence(SAM_GOOD_RUN.fabricatedFeedback, transcript)).toBe(false);
    const template = buildTemplateFeedback(signals);
    expect(FeedbackOutputSchema.parse(template)).toEqual(template);
    expect(template.win.text).toContain('3 open questions');
    expect(template.win.text).toContain('followed up 2 times');
    expect(template.labels).toContain('template_feedback');
  });
});

describe('pass-rule band edges (bands, not floors)', () => {
  const base: Signals = {
    open_questions: 3,
    followups: 2,
    reciprocity: 1,
    spotlight_share: 0.5,
    interview_mode: false,
    monologue_brag: false,
    final_warmth: 2,
  };
  it('7 open questions fails the max of the band, 6 passes', () => {
    expect(passes({ ...base, open_questions: 7 }, rubric)).toBe(false);
    expect(passes({ ...base, open_questions: 6 }, rubric)).toBe(true);
  });
  it('1 follow-up fails the min of the band', () => {
    expect(passes({ ...base, followups: 1 }, rubric)).toBe(false);
  });
  it('soft lines never gate the pass', () => {
    expect(passes({ ...base, spotlight_share: 0.9, reciprocity: 0 }, rubric)).toBe(true);
  });
  it('hard flags gate the pass', () => {
    expect(passes({ ...base, interview_mode: true }, rubric)).toBe(false);
    expect(passes({ ...base, monologue_brag: true }, rubric)).toBe(false);
  });
});

// --- Clarity validator (content-library/constraints/clarity-northstar.md) ---
describe('computeClaritySignals known answers', () => {
  const keyPoints = [
    'checkout is at eleven tomorrow morning',
    'breakfast is not included',
  ];
  const transcript: ChatMessage[] = [
    { role: 'character', content: 'Hey, thanks for booking!' },
    {
      role: 'user',
      content: 'Um, so checkout is at eleven tomorrow morning, just so you know.',
    },
    { role: 'user', content: 'I think breakfast is not included, sorry about that.' },
  ];

  it('both key points land, one filler and one hedge counted, sentence length averaged', () => {
    const signals = computeClaritySignals(transcript, keyPoints);
    expect(signals.key_points_share).toBe(1);
    expect(signals.filler_ratio).toBe(2 / 21); // "um" + "you know"
    expect(signals.avg_sentence_length).toBe(10.5); // (12 + 9) / 2
    expect(signals.hedge_count).toBe(1); // "i think"
    expect(signals.rambling).toBe(false);
    expect(signals.off_topic).toBe(false);
  });

  it('a key point with no shared content words does not land', () => {
    const signals = computeClaritySignals(transcript, [
      ...keyPoints,
      'the elevator is out of order',
    ]);
    expect(signals.key_points_share).toBe(2 / 3);
  });

  it('a single message over 80 words trips rambling', () => {
    const long: ChatMessage = { role: 'user', content: Array(81).fill('word').join(' ') };
    expect(computeClaritySignals([long], keyPoints).rambling).toBe(true);
  });

  it('majority of turns sharing no content word with any key point trips off_topic', () => {
    const driftedTranscript: ChatMessage[] = [
      { role: 'user', content: 'Anyway, how about that weather lately?' },
      { role: 'user', content: 'Also did you catch the game last night?' },
    ];
    expect(computeClaritySignals(driftedTranscript, keyPoints).off_topic).toBe(true);
  });

  it('a single off-topic greeting among on-topic turns does not trip off_topic', () => {
    expect(computeClaritySignals(transcript, keyPoints).off_topic).toBe(false);
  });

  it('empty key_points list yields key_points_share 0, never divides by zero', () => {
    expect(computeClaritySignals(transcript, []).key_points_share).toBe(0);
  });

  it('does not count "er"/"um" embedded inside ordinary words as filler', () => {
    const clean: ChatMessage = {
      role: 'user',
      content: 'Her number was after the water heater.',
    };
    expect(computeClaritySignals([clean], keyPoints).filler_ratio).toBe(0);
  });
});

describe('claritySignalValue and passesClarity', () => {
  const signals: ClaritySignals = {
    key_points_share: 1,
    filler_ratio: 0,
    avg_sentence_length: 15,
    hedge_count: 0,
    rambling: false,
    off_topic: false,
  };
  it('maps every field, flags as 0/1', () => {
    expect(claritySignalValue(signals, 'key_points_share')).toBe(1);
    expect(claritySignalValue({ ...signals, rambling: true }, 'rambling')).toBe(1);
    expect(claritySignalValue(signals, 'off_topic')).toBe(0);
  });
  it('throws on an unknown signal id', () => {
    expect(() => claritySignalValue(signals, 'nonsense')).toThrow();
  });
  it('a hard rubric line gates the pass', () => {
    const rubric = [{ signal_id: 'key_points_share', band: { min: 1 }, hard: true }];
    expect(passesClarity(signals, rubric)).toBe(true);
    expect(passesClarity({ ...signals, key_points_share: 0.5 }, rubric)).toBe(false);
  });
  it('soft rubric lines never gate the pass', () => {
    const rubric = [{ signal_id: 'filler_ratio', band: { max: 0 }, hard: false }];
    expect(passesClarity({ ...signals, filler_ratio: 0.5 }, rubric)).toBe(true);
  });
});

describe('FakeChatModel script bounds', () => {
  it('throws when the character script is exhausted', async () => {
    const model = new FakeChatModel(SAM_GOOD_RUN);
    for (let i = 0; i < 5; i += 1) {
      await model.complete({ system: '', messages: [], maxTokens: 120, tag: 'character' });
    }
    await expect(
      model.complete({ system: '', messages: [], maxTokens: 120, tag: 'character' }),
    ).rejects.toThrow('script exhausted');
  });
});
