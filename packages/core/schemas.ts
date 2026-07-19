// packages/core/schemas.ts
// Zod schemas for the charisma chat trainer core. Design source:
// PRD-CHARISMA-CHAT.md Sections 3.4, 4.1 to 4.7.
import { z } from 'zod';

export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'character']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// PRD 4.4: closed reason_code enum for every character turn.
export const ReasonCodeSchema = z.enum([
  'open_question',
  'followup',
  'reciprocity',
  'monologue',
  'brag',
  'ignored_content',
  'neutral',
]);
export type ReasonCode = z.infer<typeof ReasonCodeSchema>;

export const WarmthDeltaSchema = z.union([z.literal(-1), z.literal(0), z.literal(1)]);
export type WarmthDelta = z.infer<typeof WarmthDeltaSchema>;

// Character model output (PRD 3.3): { reply, warmth_delta, reason_code }.
export const CharacterOutputSchema = z.object({
  reply: z.string().min(1),
  warmth_delta: WarmthDeltaSchema,
  reason_code: ReasonCodeSchema,
});
export type CharacterOutput = z.infer<typeof CharacterOutputSchema>;

// Feedback model output (PRD 3.5): prose and labels only, never a score.
export const FeedbackOutputSchema = z.object({
  win: z.object({ text: z.string().min(1), quote: z.string() }),
  fix: z.object({ text: z.string().min(1), anchor: z.string() }),
  moment: z.object({ text: z.string().min(1), quote: z.string() }),
  labels: z.array(z.string()),
});
export type FeedbackOutput = z.infer<typeof FeedbackOutputSchema>;

// PRD 4.3.
export const SignalDefSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['count', 'ratio', 'flag']),
  description: z.string().min(1),
  weight: z.number(),
});
export type SignalDef = z.infer<typeof SignalDefSchema>;

// PRD 4.2. Bands, not floors: min or max (or both) must be present.
export const RubricLineSchema = z.object({
  signal_id: z.string().min(1),
  band: z
    .object({ min: z.number().optional(), max: z.number().optional() })
    .refine((b) => b.min !== undefined || b.max !== undefined, {
      message: 'band requires min or max',
    }),
  hard: z.boolean(),
});
export type RubricLine = z.infer<typeof RubricLineSchema>;

export const SkillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  objective: z.string().min(1),
  prerequisites: z.array(z.string().min(1)),
});
export type Skill = z.infer<typeof SkillSchema>;

// CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md Section 4: non-AI drill units.
// Never scored, never seen by validator.ts/score.ts; a self-attested rep.
export const DrillSchema = z.object({
  prompt_text: z.string().min(1),
  timer_seconds: z.number().int().positive(),
  variants: z.array(z.string().min(1)).min(1),
  self_check: z.array(z.string().min(1)).min(1),
  recording_variant: z.boolean(),
});
export type Drill = z.infer<typeof DrillSchema>;

export const UnitSchema = z.object({
  id: z.string().min(1),
  skill_id: z.string().min(1),
  principle: z.string().min(1),
  exemplar: z.string().min(1),
  unit_type: z.literal('scenario').default('scenario'),
  scenario: z.object({
    title: z.string().min(1),
    setup_text: z.string().min(1),
    character_name: z.string().min(1),
    message_budget: z.number().int().positive(),
  }),
  persona: z.object({
    brief: z.string().min(1),
    hidden_depth: z.string().min(1),
    opener: z.string().min(1),
    warmth_rules: z.object({
      increments: z.array(z.string().min(1)).min(1),
      decrements: z.array(z.string().min(1)).min(1),
      neutral: z.array(z.string().min(1)).min(1),
    }),
    behavior_by_warmth: z.object({
      '0': z.string().min(1),
      '1': z.string().min(1),
      '2': z.string().min(1),
      '3': z.string().min(1),
    }),
  }),
  rubric: z.array(RubricLineSchema).min(1),
  feedback_prompt: z.string().min(1),
  mastery: z.object({
    passes_required: z.number().int().positive(),
    distinct_days: z.boolean(),
  }),
});
export type Unit = z.infer<typeof UnitSchema>;

// Drill units carry no persona/warmth_rules/behavior_by_warmth/rubric/
// feedback_prompt: nothing is scored and no model is called for a rep.
export const DrillUnitSchema = z.object({
  id: z.string().min(1),
  skill_id: z.string().min(1),
  principle: z.string().min(1),
  exemplar: z.string().min(1),
  unit_type: z.literal('drill'),
  drill: DrillSchema,
  mastery: z.object({
    passes_required: z.number().int().positive(),
    distinct_days: z.boolean(),
  }),
});
export type DrillUnit = z.infer<typeof DrillUnitSchema>;

export const AnyUnitSchema = z.union([UnitSchema, DrillUnitSchema]);
export type AnyUnit = z.infer<typeof AnyUnitSchema>;

export const SkillPackSchema = z.object({
  pack_id: z.string().min(1),
  version: z.string().min(1),
  skills: z.array(SkillSchema),
  units: z.array(UnitSchema),
  signals: z.array(SignalDefSchema),
});
export type SkillPack = z.infer<typeof SkillPackSchema>;

// The validator's recomputed signals (PRD 4.5).
export const SignalsSchema = z.object({
  open_questions: z.number().int().min(0),
  followups: z.number().int().min(0),
  reciprocity: z.number().int().min(0),
  spotlight_share: z.number().min(0).max(1),
  interview_mode: z.boolean(),
  monologue_brag: z.boolean(),
  final_warmth: z.number().int().min(0).max(3),
});
export type Signals = z.infer<typeof SignalsSchema>;
