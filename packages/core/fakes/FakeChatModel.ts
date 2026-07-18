// packages/core/fakes/FakeChatModel.ts
// Scripted ChatModel for tests: no network, no randomness, no clock.
// Ships two hand-labeled Sam sessions (PRD 6.2): a GOOD run that earns
// warmth 3 and passes, and a BAD run of monologue/brag/self-focus that
// keeps warmth at 0 and fails. Feedback outputs cite REAL quotes from the
// scripted transcripts; each session also carries a variant with one
// FABRICATED quote so tests prove the evidence check rejects it.
import type { ChatModel, TokenUsage } from '../model';
import {
  CharacterOutputSchema,
  type CharacterOutput,
  type ChatMessage,
  type FeedbackOutput,
} from '../schemas';
import { clamp } from '../score';

export interface ScriptedSession {
  name: string;
  opener: string; // character's first line, always warmth 0
  userMessages: string[];
  characterOutputs: CharacterOutput[]; // one per user message
  feedback: FeedbackOutput; // every quote is real
  fabricatedFeedback: FeedbackOutput; // exactly one fabricated quote
}

const ZERO_USAGE: TokenUsage = { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 };

export const SAM_GOOD_RUN: ScriptedSession = {
  name: 'good',
  opener: "Hey. Nice place, right? I think I'm mostly here for the snacks.",
  userMessages: [
    'How do you know the host, by the way?',
    'What brought you back to the city, then?',
    'I get that. I moved here two years ago and it took me a full year to feel settled.',
    "What's the loudest quiet like at three in the morning?",
    'I ask because I sleep with the window open just to hear the city breathe.',
  ],
  characterOutputs: [
    {
      reply:
        'Oh, college, actually. I just moved back to the city last week, so I barely know anyone here yet.',
      warmth_delta: 1,
      reason_code: 'open_question',
    },
    {
      reply:
        'Honestly? I spent the last five months crewing a sailboat across the Pacific. Coming back to land has been the strange part.',
      warmth_delta: 1,
      reason_code: 'followup',
    },
    {
      reply:
        'Yeah, exactly. Okay, so the honest version: the Pacific at night is the loudest quiet you will ever hear. What about you, what keeps you busy these days?',
      warmth_delta: 1,
      reason_code: 'reciprocity',
    },
    {
      reply:
        'Ha, you actually want the details. It is like the ocean is breathing next to you. Nobody has asked me that since I got back.',
      warmth_delta: 1,
      reason_code: 'followup',
    },
    {
      reply:
        'Okay, that is a good answer. I take back the thing where I was only here for the snacks. You are decent company.',
      warmth_delta: 1,
      reason_code: 'reciprocity',
    },
  ],
  feedback: {
    win: {
      text: "You built on Sam's answers instead of resetting: your best follow-up went one level deeper into the detail Sam had just offered.",
      quote: "What's the loudest quiet like at three in the morning?",
    },
    fix: {
      text: "When you reciprocate, tie your share back to Sam's story so the thread keeps building.",
      anchor: 'I moved here two years ago',
    },
    moment: {
      text: 'Sam warmed up the moment you followed up instead of changing the subject. You became more interesting by making Sam feel interesting.',
      quote: 'I spent the last five months crewing a sailboat across the Pacific.',
    },
    labels: ['open_question', 'followup', 'reciprocity'],
  },
  fabricatedFeedback: {
    win: {
      text: "You built on Sam's answers instead of resetting: your best follow-up went one level deeper into the detail Sam had just offered.",
      quote: "What's the loudest quiet like at three in the morning?",
    },
    fix: {
      text: "When you reciprocate, tie your share back to Sam's story so the thread keeps building.",
      anchor: 'I moved here two years ago',
    },
    moment: {
      text: 'Sam warmed up the moment you followed up instead of changing the subject.',
      quote: 'I never talk about the Pacific crossing with strangers.',
    },
    labels: ['open_question', 'followup', 'reciprocity'],
  },
};

export const SAM_BAD_RUN: ScriptedSession = {
  name: 'bad',
  opener: "Hey. Nice place, right? I think I'm mostly here for the snacks.",
  userMessages: [
    // 70 words, no question mark: trips the > 60 word monologue rule.
    'Haha sure. So listen, I basically just got promoted to lead the entire growth team at my company, and I negotiated a huge raise, and honestly everyone keeps telling me I am crushing it, because last quarter I single-handedly doubled our numbers, then I ran a marathon the same month, which was obviously easy for me, and my landlord even said my apartment is the cleanest he has ever seen.',
    'Do you lift weights at all?',
    'Anyway, my startup is doing really well, we just closed a big funding round this spring.',
    'You should honestly come watch me play in my band sometime, we sold out a venue.',
    "Honestly people say I'm the most interesting person they know.",
  ],
  characterOutputs: [
    { reply: 'Huh. Congrats, I guess.', warmth_delta: -1, reason_code: 'monologue' },
    { reply: 'Not really my thing.', warmth_delta: 0, reason_code: 'neutral' },
    {
      reply: 'Okay. That is a lot of information.',
      warmth_delta: -1,
      reason_code: 'brag',
    },
    {
      reply: 'Right. I might go find the host.',
      warmth_delta: -1,
      reason_code: 'ignored_content',
    },
    {
      reply: 'Well. Good luck with all of that. I am going to grab another drink.',
      warmth_delta: -1,
      reason_code: 'brag',
    },
  ],
  feedback: {
    win: {
      text: 'You did ask Sam one direct question early on.',
      quote: 'Do you lift weights at all?',
    },
    fix: {
      text: 'Ask about Sam and follow up on the answer instead of pitching yourself.',
      anchor: '1 question across 5 messages',
    },
    moment: {
      text: 'Sam checked out after the run of self-promotion: nothing you said made Sam feel interesting, so Sam stayed flat.',
      quote: 'Right. I might go find the host.',
    },
    labels: ['monologue', 'brag', 'self_focus'],
  },
  fabricatedFeedback: {
    win: {
      text: 'You did ask Sam one direct question early on.',
      quote: 'So what was crossing the Pacific like?',
    },
    fix: {
      text: 'Ask about Sam and follow up on the answer instead of pitching yourself.',
      anchor: '1 question across 5 messages',
    },
    moment: {
      text: 'Sam checked out after the run of self-promotion.',
      quote: 'Right. I might go find the host.',
    },
    labels: ['monologue', 'brag', 'self_focus'],
  },
};

export class FakeChatModel implements ChatModel {
  private characterIdx = 0;

  constructor(
    private readonly session: ScriptedSession,
    private readonly opts: { fabricateFeedbackQuote?: boolean } = {},
  ) {}

  async complete(req: Parameters<ChatModel['complete']>[0]): ReturnType<ChatModel['complete']> {
    const payload: unknown =
      req.tag === 'character' ? this.nextCharacter() : this.feedbackPayload();
    const json = req.json ? req.json.parse(payload) : payload;
    return { text: JSON.stringify(payload), json, usage: ZERO_USAGE };
  }

  private nextCharacter(): CharacterOutput {
    const out = this.session.characterOutputs[this.characterIdx];
    if (!out) throw new Error(`script exhausted after ${this.characterIdx} character turns`);
    this.characterIdx += 1;
    return out;
  }

  private feedbackPayload(): FeedbackOutput {
    return this.opts.fabricateFeedbackQuote
      ? this.session.fabricatedFeedback
      : this.session.feedback;
  }
}

// Replays a scripted session through any ChatModel, mirroring the server's
// turn flow (PRD 3.3): opener at warmth 0, then per user message one
// character call, warmth clamped to [0, 3], full trace kept.
export async function playSession(
  model: ChatModel,
  session: ScriptedSession,
): Promise<{ transcript: ChatMessage[]; warmthTrace: number[] }> {
  const transcript: ChatMessage[] = [{ role: 'character', content: session.opener }];
  const warmthTrace: number[] = [0];
  let warmth = 0;
  for (const text of session.userMessages) {
    transcript.push({ role: 'user', content: text });
    const res = await model.complete({
      system: 'sam',
      messages: transcript,
      maxTokens: 120,
      json: CharacterOutputSchema,
      tag: 'character',
    });
    const out = CharacterOutputSchema.parse(res.json);
    warmth = clamp(0, 3, warmth + out.warmth_delta);
    warmthTrace.push(warmth);
    transcript.push({ role: 'character', content: out.reply });
  }
  return { transcript, warmthTrace };
}
