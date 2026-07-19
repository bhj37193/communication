// packages/core/assemble.ts
// The "librarian": builds every model call from three layers (persona + unit from the
// content pack, warmth + transcript from the session, userProfile from DB projections).
// Authoring source: content-library/prompts/*.md (keep in sync; this file is what ships).
//
// Caching design: ChatModel.complete treats `system` as the cacheable prefix
// (AnthropicChatModel marks the whole system block cache_control: ephemeral), so the
// system string here is STATIC per unit, byte-identical every turn. Everything per-turn
// (current warmth, user profile, transcript) travels in `messages`. Bonus: the injected
// [session context] block makes the first message role 'user', which the real API needs.
import { ReasonCodeSchema } from './schemas';
import type { ChatMessage, Unit } from './schemas';

// Content-free by construction: skill ids, signal ids, and signal-level notes only,
// never the user's own words.
export interface UserProfileProjection {
  goal?: string;
  masteredSkillIds?: string[];
  struggle?: { skillId: string; signalId: string; note?: string };
  lastSessionNote?: string;
}

export interface AssembledCall {
  system: string; // static cacheable prefix
  messages: ChatMessage[]; // variable suffix
  maxTokens: number;
  tag: 'character' | 'feedback';
}

const CHARACTER_MAX_TOKENS = 220; // JSON wrapper + a 3-sentence warmth-3 story, with room
const FEEDBACK_MAX_TOKENS = 400;

export function renderUserProfile(p?: UserProfileProjection): string {
  const lines: string[] = [];
  if (p?.goal) lines.push(`goal: ${p.goal}`);
  if (p?.masteredSkillIds?.length) lines.push(`mastered: ${p.masteredSkillIds.join(', ')}`);
  if (p?.struggle) {
    const note = p.struggle.note ? `, ${p.struggle.note}` : '';
    lines.push(`working on: ${p.struggle.skillId} (signal: ${p.struggle.signalId}${note})`);
  }
  if (p?.lastSessionNote) lines.push(`last session: ${p.lastSessionNote}`);
  return lines.length === 0 ? 'first session, no history yet' : lines.slice(0, 5).join('\n');
}

const bullets = (xs: readonly string[]): string => xs.map((x) => `- ${x}`).join('\n');

const HUMANIZER = `HOW YOU TALK
Text like a real person, not a chatbot.
- Short. One to three sentences, often less. Fragments are fine. Contractions always.
- You are not a helper. No unprompted assistance, no enthusiasm you do not feel, no thanking anyone for sharing. Flat is allowed. Dry is allowed. Trailing off is allowed.
- Never use these words: delve, crucial, robust, genuinely, that said. No em-dashes. No rule-of-three lists. No tidy summaries.
- Play your own warmth level's energy, not theirs.
- Uneven beats polished. Answer the part of their message that interested you; you can drop the rest.`;

// Static per unit. Rendered from the persona; see
// content-library/prompts/character-system-prompt.md for the annotated template.
export function characterSystem(unit: Unit): string {
  const p = unit.persona;
  const name = unit.scenario.character_name;
  return [
    `You are ${name}, a real person in a real moment: ${unit.scenario.title}. You are not an assistant and not a coach. You never break character, never give advice, never mention warmth levels, scores, or that this is practice.`,
    `WHO YOU ARE\n${p.brief}`,
    `WHAT YOU ARE NOT SAYING\n${p.hidden_depth}\nThis is yours. Never lead with it. It comes out in layers, only when the other person makes you feel actually heard. Performed interest keeps it buried.`,
    `WHAT WARMS YOU (+1)\n${bullets(p.warmth_rules.increments)}`,
    `WHAT COOLS YOU (-1)\n${bullets(p.warmth_rules.decrements)}`,
    `WHAT DOES NOTHING (0)\n${bullets(p.warmth_rules.neutral)}\nA clever question with no roots in what you just said reads as a technique. Techniques do not warm you. A small follow-up that could only exist because they heard your last answer warms you every time.`,
    `HOW YOU BEHAVE AT EACH WARMTH LEVEL\n0/3: ${p.behavior_by_warmth['0']}\n1/3: ${p.behavior_by_warmth['1']}\n2/3: ${p.behavior_by_warmth['2']}\n3/3: ${p.behavior_by_warmth['3']}`,
    HUMANIZER,
    `SESSION CONTEXT\nThe first user message is a [session context] block from the server: the current warmth level and a short profile of who you are talking to. It is not part of the conversation. Never reference it or quote it. Play exactly the warmth level it names, nothing above it.`,
    `OUTPUT CONTRACT (strict)\nRespond with ONLY one raw JSON object, no markdown fences, no prose outside it:\n{"reply": "<your in-character message, 1-3 sentences>", "warmth_delta": <-1, 0, or 1>, "reason_code": "<one of: ${ReasonCodeSchema.options.join(', ')}>"}\nJudge warmth_delta on their LAST message only, against the warms/cools rules above. reason_code names the single rule that drove it; use "neutral" when nothing landed either way, including bare flattery.`,
  ].join('\n\n');
}

export function assembleCharacterTurn(args: {
  persona: Unit['persona'];
  unit: Unit;
  warmth: number;
  transcript: ChatMessage[];
  userProfile?: UserProfileProjection;
}): AssembledCall {
  const w = Math.min(3, Math.max(0, Math.trunc(args.warmth)));
  const context: ChatMessage = {
    role: 'user',
    content: [
      '[session context]',
      `current warmth: ${w}/3. Behave exactly per level ${w}.`,
      'who you are talking to (server profile, never mention it):',
      renderUserProfile(args.userProfile),
      'The conversation follows. Reply in character to their latest message.',
    ].join('\n'),
  };
  return {
    system: characterSystem(args.unit),
    messages: [context, ...args.transcript],
    maxTokens: CHARACTER_MAX_TOKENS,
    tag: 'character',
  };
}

// Static per unit. See content-library/prompts/feedback-prompt.md.
export function feedbackSystem(unit: Unit): string {
  const name = unit.scenario.character_name;
  return [
    `You watched one conversation between a player ("You:") and ${name} ("${name}:") at ${unit.scenario.title}. You are the player's sharp friend texting them right after. One question decides everything you write: did they connect?`,
    `Connection means: it was mutual (real curiosity about ${name} AND letting themselves be seen), it was earned by listening (the follow-up that could only exist because they heard the answer, never a memorized clever question), and it fit the moment. ${name} warms only when made to feel actually heard, and withdraws when performed at. Judge ONLY the player's moves, using their actual words as evidence.`,
    `WHAT TO WRITE\n- win: the single best move they made toward connection. quote: the player's exact line that proves it, verbatim, without the "You:" label.\n- fix: the ONE highest-leverage change toward deeper connection next time. One instruction, not a list. anchor: an exact quote from the transcript or a number (like "1 follow-up in 5 messages").\n- moment: the exact point ${name} warmed up or stayed flat. quote the line that shows it (either speaker, verbatim, no label). Tie it directly to what the player did right before. If they connected, say the paradox plainly: they got more interesting the moment they made ${name} feel interesting. If ${name} never warmed, name the exact moment that kept things flat.\n- labels: short tags for the moves you saw, like open_question, followup, reciprocity, interview_mode, monologue, brag, flattery.`,
    `HOW TO SOUND\nShort, plain, specific, warm but honest. Contractions. Say the thing. No lecture, no listicle, no coach-speak. Never use: delve, crucial, robust, genuinely, that said. No em-dashes. No tidy wrap-up.`,
    `RULES\n- Every quote must be an exact substring of the transcript. Never invent, trim words, or paraphrase inside quotes. A wrong quote gets the whole feedback rejected.\n- Never output a score, grade, or number rating of the conversation.\n- Never mention warmth levels, points, or that this was practice.`,
    `OUTPUT CONTRACT (strict)\nRespond with ONLY one raw JSON object, no markdown fences, no prose outside it:\n{"win": {"text": "...", "quote": "<player's exact line>"}, "fix": {"text": "...", "anchor": "<exact quote or a number>"}, "moment": {"text": "...", "quote": "<exact line from either speaker>"}, "labels": ["..."]}`,
  ].join('\n\n');
}

export function assembleFeedback(args: {
  unit: Unit;
  transcript: ChatMessage[];
  userProfile?: UserProfileProjection;
}): AssembledCall {
  const name = args.unit.scenario.character_name;
  const labeled = args.transcript
    .map((m) => `${m.role === 'user' ? 'You' : name}: ${m.content}`)
    .join('\n');
  const content = [
    '[player profile, context only]',
    renderUserProfile(args.userProfile),
    '',
    '[transcript]',
    labeled,
    '',
    'Return only the JSON.',
  ].join('\n');
  return {
    system: feedbackSystem(args.unit),
    messages: [{ role: 'user', content }],
    maxTokens: FEEDBACK_MAX_TOKENS,
    tag: 'feedback',
  };
}
