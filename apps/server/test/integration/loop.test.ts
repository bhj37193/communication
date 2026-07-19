// P0-23: the loop proof. Full HTTP round trips against the app factory +
// charisma_test db + Fakes, no real API key: good run, bad run, and a
// fabricated-quote run that must fall back to template feedback. Runs
// alongside the caps/retention/webhook suites (src/**/*.test.ts) under the
// same `vitest run`, so `test:integration` proves them all green together.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { ScriptedSession } from '@charisma/core/fakes/FakeChatModel';
import { FakeChatModel, SAM_BAD_RUN, SAM_GOOD_RUN } from '@charisma/core/fakes/FakeChatModel';
import { buildTestApp, playToResult, pool, seedContent } from './setup.js';

// Regression for the missing-opener-zero bug: warmthTrace must start at the
// opener's implicit warmth 0, or warmTwoIndex fires one character turn early
// and credits reciprocity before warmth has actually crossed the threshold.
// Turn 1 only reaches warmth 1; the self-disclosure lands right after it, so
// it must NOT count until turn 2 pushes warmth to 2.
const WARM_TWO_INDEX_RUN: ScriptedSession = {
  name: 'warm-two-index',
  opener: SAM_GOOD_RUN.opener, // server always sends the real content-pack opener
  userMessages: [
    'What do you do for work?',
    'I moved here five years ago for a new job and it changed everything.',
  ],
  characterOutputs: [
    { reply: 'I design boats, actually.', warmth_delta: 1, reason_code: 'open_question' },
    { reply: 'That is a big move to make alone.', warmth_delta: 1, reason_code: 'followup' },
  ],
  feedback: {
    win: { text: 'Solid opener question.', quote: 'What do you do for work?' },
    fix: { text: 'Keep building on the reply.', anchor: 'I design boats' },
    moment: { text: 'Good moment.', quote: 'I design boats, actually.' },
    labels: ['open_question', 'followup'],
  },
  fabricatedFeedback: {
    win: { text: 'Solid opener question.', quote: 'never actually said' },
    fix: { text: 'Keep building on the reply.', anchor: 'I design boats' },
    moment: { text: 'Good moment.', quote: 'I design boats, actually.' },
    labels: ['open_question', 'followup'],
  },
};

beforeAll(async () => {
  await seedContent();
});
afterAll(async () => {
  await pool.end();
});

describe('the loop proof', () => {
  it('good run passes at its exact deterministic score', async () => {
    const app = buildTestApp(new FakeChatModel(SAM_GOOD_RUN));
    const result = await playToResult(app, SAM_GOOD_RUN);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.win.quote).toBe(SAM_GOOD_RUN.feedback.win.quote);
    expect(result.template_fallback).toBe(false);
    expect(result.signals).toEqual({
      open_questions: 3,
      followups: 2,
      reciprocity: 2,
      spotlight_share: 0.6,
      interview_mode: false,
      monologue_brag: false,
      final_warmth: 3,
    });
  });

  it('bad run fails at its exact deterministic score, brag label honored', async () => {
    const app = buildTestApp(new FakeChatModel(SAM_BAD_RUN));
    const result = await playToResult(app, SAM_BAD_RUN);
    expect(result.score).toBe(20);
    expect(result.passed).toBe(false);
    expect(result.signals.monologue_brag).toBe(true);
    expect(result.template_fallback).toBe(false);
  });

  it('fabricated-quote feedback is rejected and falls back to the template', async () => {
    const app = buildTestApp(new FakeChatModel(SAM_GOOD_RUN, { fabricateFeedbackQuote: true }));
    const result = await playToResult(app, SAM_GOOD_RUN);
    expect(result.score).toBe(100); // signals-only; unaffected by the feedback fallback
    expect(result.template_fallback).toBe(true);
    expect(result.win.quote).toBe(''); // template feedback carries no quote to fabricate
  });

  it('warmTwoIndex accounts for the opener before crediting reciprocity', async () => {
    const app = buildTestApp(new FakeChatModel(WARM_TWO_INDEX_RUN));
    const result = await playToResult(app, WARM_TWO_INDEX_RUN);
    expect(result.signals.reciprocity).toBe(0);
  });
});
