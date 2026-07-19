// Hourly sweep (P0-21, SD-3): hard-deletes transcripts/results past their
// TTL, and auto-ends sessions left open too long — scored via the
// deterministic template feedback pipeline (no model call: avoids a cold
// FakeChatModel/real-model spend for a session nobody is watching, and
// naturally consumes no daily cap since that's only incremented at session
// start), or marked abandoned when the user never sent a message.
import { and, eq, lt } from 'drizzle-orm';
import { score } from '@charisma/core/score';
import type { ChatMessage } from '@charisma/core/schemas';
import { buildTemplateFeedback, computeSignals, passes } from '@charisma/core/validator';
import { SAM_PACK } from '../content.js';
import type { Db } from '../db/client.js';
import { results, sessions, transcripts } from '../db/schema.js';

const STALE_OPEN_MS = 60 * 60 * 1000;

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 24 * 60 * 60 * 1000);
}

export async function sweepExpiredContent(db: Db, now: Date): Promise<void> {
  await db.delete(transcripts).where(lt(transcripts.expiresAt, now));
  await db.delete(results).where(lt(results.expiresAt, now));
}

export async function sweepStaleOpenSessions(
  db: Db,
  now: Date,
): Promise<{ scored: number; abandoned: number }> {
  const cutoff = new Date(now.getTime() - STALE_OPEN_MS);
  const stale = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.state, 'open'), lt(sessions.startedAt, cutoff)));

  let scoredCount = 0;
  let abandonedCount = 0;
  for (const session of stale) {
    const [transcriptRow] = await db.select().from(transcripts).where(eq(transcripts.sessionId, session.id));
    const transcript = (transcriptRow?.messages as ChatMessage[] | undefined) ?? [];
    const hasUserMessage = transcript.some((m) => m.role === 'user');

    if (!hasUserMessage) {
      await db
        .update(sessions)
        .set({ state: 'abandoned', endedAt: now })
        .where(and(eq(sessions.id, session.id), eq(sessions.state, 'open')));
      abandonedCount += 1;
      continue;
    }

    // Claim the session (open -> scored) before writing results, so a
    // concurrent /end landing in this window loses the race cleanly instead
    // of hitting a results PK collision.
    const claimed = await db
      .update(sessions)
      .set({ state: 'scored', endedAt: now })
      .where(and(eq(sessions.id, session.id), eq(sessions.state, 'open')));
    if (claimed.rowCount === 0) continue;

    const warmthTrace = (session.warmthTrace as number[] | undefined) ?? [];
    const signals = computeSignals(transcript, warmthTrace);
    const feedback = buildTemplateFeedback(signals);
    await db.insert(results).values({
      sessionId: session.id,
      win: feedback.win,
      fix: feedback.fix,
      moment: feedback.moment,
      score: score(signals, SAM_PACK.signals),
      passed: passes(signals, SAM_PACK.unit.rubric),
      signals,
      templateFallback: true,
      expiresAt: addDays(now, 60),
    });
    scoredCount += 1;
  }
  return { scored: scoredCount, abandoned: abandonedCount };
}

export async function runRetentionSweep(db: Db, now: Date): Promise<void> {
  await sweepExpiredContent(db, now);
  await sweepStaleOpenSessions(db, now);
}
