// packages/core/validator.ts
// Deterministic validator per PRD-CHARISMA-CHAT.md Section 4.5.
// Pure functions, zero I/O, zero inference, zero randomness: the same
// transcript always yields the same signals and the same verdict.
import type {
  ChatMessage,
  ClaritySignals,
  FeedbackOutput,
  RubricLine,
  Signals,
} from './schemas';

// Curated starter lists (PRD 4.5). Shipped as constants and mirrored in the
// content pack JSON; a test asserts the two stay identical.
// Stricter interpretation: a starter "matches" only when it anchors the START
// of the message (after leading punctuation), followed by a non-letter, so
// "whatever happened?" never matches "what" and a mid-sentence "do you" never
// flips an open question to closed.
export const OPEN_STARTERS: readonly string[] = [
  'what',
  'how',
  'why',
  'tell me',
  'describe',
  'walk me through',
  'where did',
  "what's it like",
  'which part',
  'who',
];
export const CLOSED_STARTERS: readonly string[] = [
  'do you',
  'did you',
  'are you',
  'is it',
  'was it',
  'have you',
  'would you',
  'can i',
];

// Stopwords are filtered before the follow-up content-word overlap check.
export const STOPWORDS: ReadonlySet<string> = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'nor', 'if', 'then', 'than', 'that',
  'this', 'these', 'those', 'there', 'here',
  'i', 'im', 'ive', 'id', 'ill', 'me', 'my', 'mine', 'we', 'us', 'our', 'ours',
  'you', 'your', 'yours', 'youre', 'youd', 'youll',
  'he', 'him', 'his', 'she', 'her', 'hers', 'it', 'its', 'they', 'them',
  'their', 'theirs',
  'who', 'whom', 'whose', 'which', 'what', 'whats', 'when', 'where', 'why', 'how',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'am',
  'do', 'does', 'did', 'doing', 'done', 'don', 'didn', 'doesn',
  'have', 'has', 'had', 'having',
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'won', 'wouldn', 'couldn', 'shouldn', 'isn', 'aren', 'wasn', 'weren',
  'not', 'no', 'yes', 'yeah', 'yep', 'ok', 'okay', 'hey', 'oh', 'ha', 'haha',
  'huh', 'hmm', 'so',
  'of', 'in', 'on', 'at', 'to', 'from', 'with', 'without', 'for', 'by',
  'about', 'as', 'into', 'onto', 'over', 'under', 'out', 'up', 'down', 'off',
  'again', 'once', 'ever', 'never', 'always', 'just', 'very', 'really',
  'quite', 'too', 'also', 'still', 'only', 'even', 'well', 'sure', 'right',
  'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'own', 'same',
  'because', 'while', 'after', 'before', 'during', 'until', 'since',
  'anyway', 'actually', 'like',
  'get', 'got', 'go', 'going', 'gone', 'come', 'came', 'say', 'said', 'says',
]);

export function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function wordCount(s: string): number {
  const t = normalizeWhitespace(s);
  return t === '' ? 0 : t.split(' ').length;
}

export function isQuestion(s: string): boolean {
  return s.includes('?');
}

function startsWithAny(text: string, starters: readonly string[]): boolean {
  return starters.some(
    (st) => text.startsWith(st) && !/[a-z]/.test(text.charAt(st.length)),
  );
}

export function isOpenQuestion(s: string): boolean {
  if (!isQuestion(s)) return false;
  const t = s.trim().toLowerCase().replace(/^[^a-z]+/, '');
  return startsWithAny(t, OPEN_STARTERS) && !startsWithAny(t, CLOSED_STARTERS);
}

// ponytail: naive suffix stemmer, upgrade to a real stemmer only if fixture
// mismatches show up in production transcripts.
function stem(w: string): string {
  if (w.endsWith('ing') && w.length > 5) return w.slice(0, -3);
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if (w.endsWith('es') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('ed') && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && w.length > 3) return w.slice(0, -1);
  return w;
}

// Stemmed, stopword-filtered content words, kept only when the stemmed form
// is >= 4 chars (stricter reading of the ">= 4 chars" rule).
function contentWords(text: string): Set<string> {
  const out = new Set<string>();
  for (const raw of text.toLowerCase().replace(/[^a-z0-9' -]+/g, ' ').split(/\s+/)) {
    const base = raw.split("'")[0] ?? ''; // strip clitics: "what's" -> "what"
    if (!base || STOPWORDS.has(base)) continue;
    const stemmed = stem(base);
    if (stemmed.length >= 4) out.add(stemmed);
  }
  return out;
}

const BACK_REFERENCES: readonly string[] = ['you said', 'you mentioned', 'you told'];

export function isFollowup(
  userText: string,
  prevCharacterText: string | undefined,
): boolean {
  if (!prevCharacterText) return false;
  const lower = userText.toLowerCase();
  if (BACK_REFERENCES.some((b) => lower.includes(b))) return true;
  const prev = contentWords(prevCharacterText);
  for (const w of contentWords(userText)) {
    if (prev.has(w)) return true;
  }
  return false;
}

const FIRST_PERSON = /\b(?:i|my|we)\b/i;

export function isSelfDisclosure(s: string): boolean {
  return !isQuestion(s) && FIRST_PERSON.test(s) && wordCount(s) >= 6;
}

// warmthTrace holds one clamped warmth value per character message in the
// transcript, opener included (the opener is always warmth 0).
// modelBrag is the model's optional brag flag; it only counts when its quoted
// evidence substring-matches the USER's own messages (a fabricated quote is
// discarded, PRD 4.5).
export function computeSignals(
  transcript: ChatMessage[],
  warmthTrace: number[],
  modelBrag?: { quote: string },
): Signals {
  // Transcript index of the first character turn at warmth >= 2.
  let warmTwoIndex = -1;
  let charTurn = 0;
  transcript.forEach((m, i) => {
    if (m.role !== 'character') return;
    if (warmTwoIndex === -1 && (warmthTrace[charTurn] ?? 0) >= 2) warmTwoIndex = i;
    charTurn += 1;
  });

  let open_questions = 0;
  let followups = 0;
  let reciprocity = 0;
  let spotlight = 0;
  let userCount = 0;
  let interview_mode = false;
  let longMessage = false;
  let questionRun = 0;
  let prevCharacter: string | undefined;

  transcript.forEach((m, i) => {
    if (m.role === 'character') {
      prevCharacter = m.content;
      return;
    }
    userCount += 1;
    const q = isQuestion(m.content);
    const fu = isFollowup(m.content, prevCharacter);
    if (isOpenQuestion(m.content)) open_questions += 1;
    if (fu) followups += 1;
    if (q || fu) spotlight += 1;
    // A run of consecutive user questions can never contain a self-disclosure
    // (is_self_disclosure requires a non-question), so 3 consecutive
    // questions trip interview_mode; any non-question user message ends the run.
    if (q) {
      questionRun += 1;
      if (questionRun >= 3) interview_mode = true;
    } else {
      questionRun = 0;
    }
    if (isSelfDisclosure(m.content) && warmTwoIndex !== -1 && i > warmTwoIndex) {
      reciprocity += 1;
    }
    if (wordCount(m.content) > 60) longMessage = true;
  });

  const userJoined = normalizeWhitespace(
    transcript.filter((m) => m.role === 'user').map((m) => m.content).join(' '),
  );
  const bragConfirmed = modelBrag
    ? userJoined.includes(normalizeWhitespace(modelBrag.quote))
    : false;

  return {
    open_questions,
    followups,
    reciprocity,
    spotlight_share: userCount === 0 ? 0 : spotlight / userCount,
    interview_mode,
    monologue_brag: longMessage || bragConfirmed,
    final_warmth: warmthTrace.length === 0 ? 0 : warmthTrace[warmthTrace.length - 1]!,
  };
}

// Evidence check (PRD 4.5): every quote must be an exact substring, after
// whitespace normalization, of the correct speaker's concatenated messages.
// Interpretation choices, stricter where the speaker is knowable:
// - win.quote is defined by the feedback prompt as the user's exact line, so
//   it must match USER text only.
// - moment.quote may cite either the character's warm/flat line or the user
//   line that caused it, so either speaker's text is accepted.
// - fix.anchor is "a quote or a number": accepted when it substring-matches
//   either speaker OR contains a digit.
// One failed check rejects the whole feedback object; the caller regenerates
// once, then falls back to buildTemplateFeedback(signals).
export function checkEvidence(
  feedback: FeedbackOutput,
  transcript: ChatMessage[],
): boolean {
  const joined = (role: 'user' | 'character'): string =>
    normalizeWhitespace(
      transcript.filter((m) => m.role === role).map((m) => m.content).join(' '),
    );
  const user = joined('user');
  const character = joined('character');

  const winOk = user.includes(normalizeWhitespace(feedback.win.quote));
  const momentQuote = normalizeWhitespace(feedback.moment.quote);
  const momentOk = user.includes(momentQuote) || character.includes(momentQuote);
  const anchor = normalizeWhitespace(feedback.fix.anchor);
  const anchorOk =
    /\d/.test(anchor) || user.includes(anchor) || character.includes(anchor);

  return winOk && momentOk && anchorOk;
}

// Deterministic fallback feedback assembled from the validator's own signals,
// used when model feedback fails the evidence check twice.
export function buildTemplateFeedback(s: Signals): FeedbackOutput {
  const plural = (n: number, word: string): string =>
    `${n} ${word}${n === 1 ? '' : 's'}`;
  const fixText =
    s.followups < 2
      ? 'Follow up on their last answer before starting a new topic.'
      : s.reciprocity < 1
        ? 'After they share something real, give one real detail back before your next question.'
        : 'Keep the spotlight balanced: aim to spend 40 to 70 percent of your messages on them.';
  const momentText =
    s.final_warmth >= 2
      ? `They warmed up to ${s.final_warmth} of 3. They opened up in the moments you made them feel interesting.`
      : `They stayed at warmth ${s.final_warmth} of 3. They warm up when you make them feel interesting, not when you perform.`;
  return {
    win: {
      text: `You asked ${plural(s.open_questions, 'open question')} and followed up ${plural(s.followups, 'time')}.`,
      quote: '',
    },
    fix: { text: fixText, anchor: `${s.followups} follow-ups` },
    moment: { text: momentText, quote: '' },
    labels: ['template_feedback'],
  };
}

// Flags map to 0/1 so bands like { max: 0 } apply uniformly.
export function signalValue(s: Signals, id: string): number {
  switch (id) {
    case 'open_questions':
      return s.open_questions;
    case 'followups':
      return s.followups;
    case 'reciprocity':
      return s.reciprocity;
    case 'spotlight_share':
      return s.spotlight_share;
    case 'interview_mode':
      return s.interview_mode ? 1 : 0;
    case 'monologue_brag':
      return s.monologue_brag ? 1 : 0;
    case 'final_warmth':
      return s.final_warmth;
    default:
      throw new Error(`unknown signal: ${id}`);
  }
}

// Pass rule (PRD 4.5): every hard rubric line's signal must land inside its
// band. Soft lines never gate the pass; they only move the score.
export function passes(s: Signals, rubric: RubricLine[]): boolean {
  return rubric
    .filter((line) => line.hard)
    .every((line) => {
      const v = signalValue(s, line.signal_id);
      return (
        (line.band.min === undefined || v >= line.band.min) &&
        (line.band.max === undefined || v <= line.band.max)
      );
    });
}

// --- Clarity validator (content-library/constraints/clarity-northstar.md) ---
// Deterministic lexical/structural proxies, same discipline as above: pure
// functions computed only from the user's own text against a unit's
// key_points, never from character output or a model judgment.

// ponytail: 'like' also matches the verb ("I like that idea"), inflating
// filler_ratio on legitimate sentences; upgrade to a part-of-speech check
// only if real transcripts show this misfiring often.
const FILLER_WORDS: readonly string[] = [
  'um', 'uh', 'er', 'like', 'you know', 'sort of', 'kind of', 'basically',
  'literally', 'i mean', 'actually', 'just saying',
];
const HEDGES: readonly string[] = [
  'i think', 'i guess', 'maybe', 'probably', 'not sure but', 'i suppose',
];

// Word-boundary match, not raw substring: a naive substring count treats
// "her", "number", "after", "water", "heater" as containing the fillers
// "er"/"um", which would drown the signal in false positives on ordinary
// text. \b requires the match to start/end outside a word character.
function countOccurrences(haystack: string, needle: string): number {
  if (needle === '') return 0;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return (haystack.match(new RegExp(`\\b${escaped}\\b`, 'g')) ?? []).length;
}

// A key point "lands" when at least half of its stemmed content words show
// up anywhere in the user's combined text (same overlap machinery as
// isFollowup's content-word check, applied against authored key_points
// instead of the previous character turn).
function keyPointLanded(keyPoint: string, userContent: Set<string>): boolean {
  const kpWords = contentWords(keyPoint);
  if (kpWords.size === 0) return false;
  let hits = 0;
  for (const w of kpWords) if (userContent.has(w)) hits += 1;
  return hits / kpWords.size >= 0.5;
}

export function computeClaritySignals(
  transcript: ChatMessage[],
  keyPoints: string[],
): ClaritySignals {
  const userMessages = transcript.filter((m) => m.role === 'user').map((m) => m.content);
  const userJoined = normalizeWhitespace(userMessages.join(' '));
  const userWords = wordCount(userJoined);
  const lower = userJoined.toLowerCase();

  const userContent = contentWords(userJoined);
  const landed = keyPoints.filter((kp) => keyPointLanded(kp, userContent)).length;

  const fillerHits = FILLER_WORDS.reduce((acc, f) => acc + countOccurrences(lower, f), 0);
  const hedgeHits = HEDGES.reduce((acc, h) => acc + countOccurrences(lower, h), 0);

  const sentences = userJoined.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const avgSentenceLength =
    sentences.length === 0
      ? 0
      : sentences.reduce((acc, s) => acc + wordCount(s), 0) / sentences.length;

  const rambling = userMessages.some((m) => wordCount(m) > 80);

  // ponytail: naive per-turn overlap against key_points, majority-vote so a
  // single greeting/small-talk turn doesn't false-positive; upgrade to
  // ignoring a fixed opener window if that still trips on real transcripts.
  const missCount = userMessages.filter((m) => {
    const words = contentWords(m);
    if (words.size === 0) return false;
    return !keyPoints.some((kp) => {
      const kpWords = contentWords(kp);
      for (const w of words) if (kpWords.has(w)) return true;
      return false;
    });
  }).length;
  const off_topic = userMessages.length >= 2 && missCount > userMessages.length / 2;

  return {
    key_points_share: keyPoints.length === 0 ? 0 : landed / keyPoints.length,
    filler_ratio: userWords === 0 ? 0 : fillerHits / userWords,
    avg_sentence_length: avgSentenceLength,
    hedge_count: hedgeHits,
    rambling,
    off_topic,
  };
}

export function claritySignalValue(s: ClaritySignals, id: string): number {
  switch (id) {
    case 'key_points_share':
      return s.key_points_share;
    case 'filler_ratio':
      return s.filler_ratio;
    case 'avg_sentence_length':
      return s.avg_sentence_length;
    case 'hedge_count':
      return s.hedge_count;
    case 'rambling':
      return s.rambling ? 1 : 0;
    case 'off_topic':
      return s.off_topic ? 1 : 0;
    default:
      throw new Error(`unknown clarity signal: ${id}`);
  }
}

export function passesClarity(s: ClaritySignals, rubric: RubricLine[]): boolean {
  return rubric
    .filter((line) => line.hard)
    .every((line) => {
      const v = claritySignalValue(s, line.signal_id);
      return (
        (line.band.min === undefined || v >= line.band.min) &&
        (line.band.max === undefined || v <= line.band.max)
      );
    });
}
