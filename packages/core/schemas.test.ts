// packages/core/schemas.test.ts
// The content pack and every scripted fixture must satisfy the Zod schemas.
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  AnyUnitSchema,
  CharacterOutputSchema,
  ChatMessageSchema,
  DrillUnitSchema,
  FeedbackOutputSchema,
  RubricLineSchema,
  SignalDefSchema,
  SignalsSchema,
  UnitSchema,
} from './schemas';
import { SAM_BAD_RUN, SAM_GOOD_RUN } from './fakes/FakeChatModel';
import pack from './content/everyday.housewarming-sam.json';

describe('content pack JSON', () => {
  it('the Sam unit validates against UnitSchema', () => {
    const unit = UnitSchema.parse(pack.unit);
    expect(unit.id).toBe('everyday.followups.housewarming-sam');
    expect(unit.skill_id).toBe('followups');
    expect(unit.scenario.message_budget).toBe(10);
    expect(unit.mastery).toEqual({ passes_required: 2, distinct_days: true });
    expect(unit.unit_type).toBe('scenario');
  });

  it('a drill unit validates against DrillUnitSchema and AnyUnitSchema, and rejects a missing drill body', () => {
    const drillUnit = {
      id: 'communication.followup-ladder',
      skill_id: 'communication',
      principle: 'Ask a follow-up before you pivot.',
      exemplar: 'Oh nice, what got you into that?',
      unit_type: 'drill',
      drill: {
        prompt_text: 'Write three follow-up questions to: "I just got back from Peru."',
        timer_seconds: 300,
        variants: ['I just got back from Peru.', 'My kid started college this week.'],
        self_check: ['Each question references specific detail from the line.', 'None are yes/no questions.'],
        recording_variant: false,
      },
      mastery: { passes_required: 2, distinct_days: true },
    };

    expect(DrillUnitSchema.parse(drillUnit).unit_type).toBe('drill');
    expect(AnyUnitSchema.parse(drillUnit).unit_type).toBe('drill');
    expect(AnyUnitSchema.parse(pack.unit).unit_type).toBe('scenario');
    expect(() => DrillUnitSchema.parse({ ...drillUnit, drill: undefined })).toThrow();
  });

  it('signal definitions validate and carry the PRD weights', () => {
    const defs = SignalDefSchema.array().min(1).parse(pack.signals);
    const byId = new Map(defs.map((d) => [d.id, d]));
    expect(byId.get('open_questions')?.weight).toBe(8);
    expect(byId.get('followups')?.weight).toBe(10);
    expect(byId.get('reciprocity')?.weight).toBe(10);
    expect(byId.get('spotlight_share')?.weight).toBe(10);
    expect(byId.get('final_warmth')?.weight).toBe(5);
    expect(byId.get('interview_mode')?.weight).toBe(-20);
    expect(byId.get('monologue_brag')?.weight).toBe(-20);
  });

  it('every rubric line references a defined signal', () => {
    const defs = SignalDefSchema.array().parse(pack.signals);
    const ids = new Set(defs.map((d) => d.id));
    for (const line of RubricLineSchema.array().parse(pack.unit.rubric)) {
      expect(ids.has(line.signal_id)).toBe(true);
    }
  });

  it('starter lists are non-empty string arrays', () => {
    z.array(z.string().min(1)).min(1).parse(pack.open_starters);
    z.array(z.string().min(1)).min(1).parse(pack.closed_starters);
  });

  it('band refinement rejects an empty band', () => {
    expect(() =>
      RubricLineSchema.parse({ signal_id: 'followups', band: {}, hard: true }),
    ).toThrow();
  });
});

describe('CharacterOutputSchema', () => {
  it('accepts every scripted character output in both runs', () => {
    for (const out of [...SAM_GOOD_RUN.characterOutputs, ...SAM_BAD_RUN.characterOutputs]) {
      expect(CharacterOutputSchema.parse(out)).toEqual(out);
    }
  });
  it('rejects a warmth_delta outside -1|0|1', () => {
    expect(() =>
      CharacterOutputSchema.parse({ reply: 'hi', warmth_delta: 2, reason_code: 'neutral' }),
    ).toThrow();
  });
  it('rejects an unknown reason_code', () => {
    expect(() =>
      CharacterOutputSchema.parse({ reply: 'hi', warmth_delta: 0, reason_code: 'flattery' }),
    ).toThrow();
  });
});

describe('FeedbackOutputSchema', () => {
  it('accepts the scripted feedback objects', () => {
    expect(FeedbackOutputSchema.parse(SAM_GOOD_RUN.feedback)).toEqual(SAM_GOOD_RUN.feedback);
    expect(FeedbackOutputSchema.parse(SAM_BAD_RUN.feedback)).toEqual(SAM_BAD_RUN.feedback);
  });
  it('rejects a win without a quote field', () => {
    expect(() =>
      FeedbackOutputSchema.parse({
        win: { text: 'nice' },
        fix: { text: 'do better', anchor: 'x' },
        moment: { text: 'there', quote: 'y' },
        labels: [],
      }),
    ).toThrow();
  });
});

describe('ChatMessageSchema and SignalsSchema', () => {
  it('only user|character roles are allowed', () => {
    expect(ChatMessageSchema.parse({ role: 'user', content: 'hi' }).role).toBe('user');
    expect(() => ChatMessageSchema.parse({ role: 'assistant', content: 'hi' })).toThrow();
  });
  it('a computed signals object validates', () => {
    SignalsSchema.parse({
      open_questions: 3,
      followups: 2,
      reciprocity: 2,
      spotlight_share: 0.6,
      interview_mode: false,
      monologue_brag: false,
      final_warmth: 3,
    });
  });
  it('final_warmth above 3 is rejected', () => {
    expect(() =>
      SignalsSchema.parse({
        open_questions: 0,
        followups: 0,
        reciprocity: 0,
        spotlight_share: 0,
        interview_mode: false,
        monologue_brag: false,
        final_warmth: 4,
      }),
    ).toThrow();
  });
});

describe('fixture consistency', () => {
  it('both runs use the pack persona opener', () => {
    expect(SAM_GOOD_RUN.opener).toBe(pack.unit.persona.opener);
    expect(SAM_BAD_RUN.opener).toBe(pack.unit.persona.opener);
  });
});
