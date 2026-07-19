// Content-free user-profile projection. Lets the COACH (feedback) remember what someone
// struggled with across sessions, from skill state + prior-session SIGNALS only, never the
// user's words. Not fed to the character: Sam is a stranger meeting the player fresh and must
// not know their history (that would break the fiction).
import { and, desc, eq, isNotNull, ne } from 'drizzle-orm';
import type { UserProfileProjection } from '@charisma/core/assemble';
import type { Deps } from '../composition.js';
import { results, sessions, userSkillState } from '../db/schema.js';

type Signals = Record<string, number | boolean>;

function deriveStruggle(s: Signals): UserProfileProjection['struggle'] {
  if (s.interview_mode === true)
    return { skillId: 'reciprocity', signalId: 'reciprocity', note: 'interviewed, never shared back' };
  if (Number(s.reciprocity ?? 0) === 0)
    return { skillId: 'reciprocity', signalId: 'reciprocity', note: 'did not reciprocate' };
  if (Number(s.followups ?? 0) === 0)
    return { skillId: 'follow-ups', signalId: 'followups', note: 'no follow-ups on their answers' };
  const w = Number(s.final_warmth ?? 0);
  if (w <= 1) return { skillId: 'connection', signalId: 'final_warmth', note: `warmth stalled at ${w}/3` };
  return undefined;
}

function summarize(s: Signals): string {
  const w = Number(s.final_warmth ?? 0);
  const fu = Number(s.followups ?? 0);
  const reciprocated = Number(s.reciprocity ?? 0) > 0;
  return `last time: warmth ${w}/3, ${fu} follow-up${fu === 1 ? '' : 's'}, ${reciprocated ? 'reciprocated once' : 'no reciprocity'}`;
}

// Builds the profile from the user's most recent PRIOR scored session (excludes the current
// one). Returns undefined when there is no history, so the prompt reads "first session".
export async function getUserProfile(
  deps: Deps,
  userId: string,
  currentSessionId: string,
): Promise<UserProfileProjection | undefined> {
  const mastered = await deps.db
    .select({ skillId: userSkillState.skillId })
    .from(userSkillState)
    .where(and(eq(userSkillState.userId, userId), eq(userSkillState.status, 'mastered')));

  const [last] = await deps.db
    .select({ signals: results.signals })
    .from(results)
    .innerJoin(sessions, eq(sessions.id, results.sessionId))
    .where(and(eq(sessions.userId, userId), ne(sessions.id, currentSessionId), isNotNull(results.score)))
    .orderBy(desc(sessions.startedAt))
    .limit(1);

  const profile: UserProfileProjection = {};
  if (mastered.length) profile.masteredSkillIds = mastered.map((m) => m.skillId);
  if (last?.signals) {
    const s = last.signals as Signals;
    const struggle = deriveStruggle(s);
    if (struggle) profile.struggle = struggle;
    profile.lastSessionNote = summarize(s);
  }
  return Object.keys(profile).length ? profile : undefined;
}
