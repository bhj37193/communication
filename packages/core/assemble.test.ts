// packages/core/assemble.test.ts
// The invariants that matter: static prefix stays static (cache), variable stuff stays
// in messages, contracts and humanizer rules are actually in the rendered text.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  assembleCharacterTurn,
  assembleFeedback,
  characterSystem,
  renderUserProfile,
} from './assemble';
import { ReasonCodeSchema, UnitSchema, type ChatMessage } from './schemas';

const pack = JSON.parse(
  readFileSync(new URL('./content/everyday.housewarming-sam.json', import.meta.url), 'utf-8'),
) as { unit: unknown };
const unit = UnitSchema.parse(pack.unit);

const transcript: ChatMessage[] = [
  { role: 'character', content: unit.persona.opener },
  { role: 'user', content: 'How do you know the host, by the way?' },
];

describe('assembleCharacterTurn', () => {
  it('system is static across warmth levels and turns (cache stability)', () => {
    const systems = [0, 1, 2, 3].map(
      (warmth) =>
        assembleCharacterTurn({ persona: unit.persona, unit, warmth, transcript }).system,
    );
    expect(new Set(systems).size).toBe(1);
    expect(systems[0]).toBe(characterSystem(unit));
  });

  it('system carries persona, all four warmth behaviors, and the strict JSON contract', () => {
    const system = characterSystem(unit);
    expect(system).toContain(unit.persona.brief);
    expect(system).toContain(unit.persona.hidden_depth);
    for (const level of ['0', '1', '2', '3'] as const) {
      expect(system).toContain(unit.persona.behavior_by_warmth[level]);
    }
    for (const code of ReasonCodeSchema.options) {
      expect(system).toContain(code);
    }
    expect(system).toContain('"warmth_delta"');
  });

  it('warmth and profile ride in a [session context] first user message, then the transcript', () => {
    const call = assembleCharacterTurn({
      persona: unit.persona,
      unit,
      warmth: 2,
      transcript,
      userProfile: { goal: 'hold a conversation at parties' },
    });
    expect(call.messages[0]!.role).toBe('user');
    expect(call.messages[0]!.content).toContain('current warmth: 2/3');
    expect(call.messages[0]!.content).toContain('goal: hold a conversation at parties');
    expect(call.messages.slice(1)).toEqual(transcript);
    expect(call.messages[1]!.role).toBe('character'); // opener stays second: user, assistant, user...
    expect(call.tag).toBe('character');
  });

  it('clamps out-of-range warmth into 0..3', () => {
    const low = assembleCharacterTurn({ persona: unit.persona, unit, warmth: -2, transcript });
    const high = assembleCharacterTurn({ persona: unit.persona, unit, warmth: 9, transcript });
    expect(low.messages[0]!.content).toContain('current warmth: 0/3');
    expect(high.messages[0]!.content).toContain('current warmth: 3/3');
  });
});

describe('assembleFeedback', () => {
  it('one user message with the labeled transcript, byte-exact after the label', () => {
    const call = assembleFeedback({ unit, transcript });
    expect(call.messages).toHaveLength(1);
    expect(call.messages[0]!.role).toBe('user');
    expect(call.messages[0]!.content).toContain(`Sam: ${unit.persona.opener}`);
    expect(call.messages[0]!.content).toContain('You: How do you know the host, by the way?');
    expect(call.tag).toBe('feedback');
  });

  it('system demands the feedback JSON and forbids scoring', () => {
    const { system } = assembleFeedback({ unit, transcript });
    expect(system).toContain('"win"');
    expect(system).toContain('"fix"');
    expect(system).toContain('"moment"');
    expect(system).toContain('"labels"');
    expect(system.toLowerCase()).toContain('never output a score');
  });
});

describe('renderUserProfile', () => {
  it('defaults to a first-session line and never exceeds 5 lines', () => {
    expect(renderUserProfile()).toBe('first session, no history yet');
    const full = renderUserProfile({
      goal: 'hold a conversation at parties',
      masteredSkillIds: ['open-questions'],
      struggle: { skillId: 'everyday-connection', signalId: 'followups', note: 'below band 3 runs' },
      lastSessionNote: 'passed, reciprocity 0',
    });
    expect(full.split('\n').length).toBeLessThanOrEqual(5);
    expect(full).toContain('working on: everyday-connection (signal: followups');
  });
});

describe('humanizer compliance of the rendered prompts themselves', () => {
  it('no em-dash anywhere in either assembled call', () => {
    const c = assembleCharacterTurn({ persona: unit.persona, unit, warmth: 1, transcript });
    const f = assembleFeedback({ unit, transcript });
    for (const text of [c.system, f.system, ...c.messages.map((m) => m.content)]) {
      expect(text).not.toContain('—');
    }
  });
});
