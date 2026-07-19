// P0-23: the loop proof. Full HTTP round trips against the app factory +
// charisma_test db + Fakes, no real API key: good run, bad run, and a
// fabricated-quote run that must fall back to template feedback. Runs
// alongside the caps/retention/webhook suites (src/**/*.test.ts) under the
// same `vitest run`, so `test:integration` proves them all green together.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { FakeChatModel, SAM_BAD_RUN, SAM_GOOD_RUN } from '@charisma/core/fakes/FakeChatModel';
import { buildTestApp, playToResult, pool, seedContent } from './setup.js';

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
});
