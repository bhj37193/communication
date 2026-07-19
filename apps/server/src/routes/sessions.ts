import { clamp, score } from '@charisma/core/score';
import type { ChatMessage } from '@charisma/core/schemas';
import { CharacterOutputSchema, FeedbackOutputSchema } from '@charisma/core/schemas';
import { buildTemplateFeedback, checkEvidence, computeSignals, passes } from '@charisma/core/validator';
import { and, eq } from 'drizzle-orm';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { Deps } from '../composition.js';
import { SAM_PACK, SAM_UNIT_ID } from '../content.js';
import { modelUsage, results, sessions, transcripts, users } from '../db/schema.js';
import { checkBreaker, checkDailyCap, incrementDailyUsage } from '../services/caps.js';

type UserRow = typeof users.$inferSelect;
type SessionRow = typeof sessions.$inferSelect;

const MessageBodySchema = z.object({ text: z.string().trim().min(1).max(500) });

export async function upsertUser(deps: Deps, clerkId: string): Promise<UserRow> {
  const existing = await deps.db.select().from(users).where(eq(users.clerkId, clerkId));
  if (existing[0]) return existing[0];
  const inserted = await deps.db.insert(users).values({ clerkId }).onConflictDoNothing().returning();
  if (inserted[0]) return inserted[0];
  const [row] = await deps.db.select().from(users).where(eq(users.clerkId, clerkId));
  return row!; // lost an insert race; the winner's row is guaranteed to exist
}

export async function requireUser(
  deps: Deps,
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<UserRow | null> {
  const identity = await deps.authVerifier.verify(req.headers.authorization);
  if (!identity) {
    reply.code(401).send({ error: { code: 'UNAUTHENTICATED', message: 'missing or invalid Authorization header' } });
    return null;
  }
  return upsertUser(deps, identity.externalId);
}

async function loadOwnedSession(deps: Deps, id: string, userId: string): Promise<SessionRow | null> {
  const [row] = await deps.db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, id), eq(sessions.userId, userId)));
  return row ?? null;
}

function characterSystemPrompt(warmth: number): string {
  const p = SAM_PACK.unit.persona;
  const w = clamp(0, 3, warmth);
  const behavior = p.behavior_by_warmth[String(w) as '0' | '1' | '2' | '3'];
  return `${p.brief}\nHidden depth, reveal only when earned: ${p.hidden_depth}\nCurrent warmth ${w}/3: ${behavior}`;
}

async function recordModelUsage(
  deps: Deps,
  sessionId: string,
  tag: 'character' | 'feedback',
  usage: { inputTokens: number; outputTokens: number; cachedInputTokens: number },
): Promise<void> {
  await deps.db.insert(modelUsage).values({
    sessionId,
    tag,
    tokensIn: usage.inputTokens,
    tokensOut: usage.outputTokens,
    cachedIn: usage.cachedInputTokens,
  });
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * 24 * 60 * 60 * 1000);
}

function isUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: string }).code === '23505';
}

export function registerSessionRoutes(app: FastifyInstance, deps: Deps): void {
  app.post('/v1/sessions', async (req, reply) => {
    const user = await requireUser(deps, req, reply);
    if (!user) return;

    const now = new Date();
    if (!(await checkBreaker(deps.db, deps.env.DAILY_MODEL_BUDGET_USD, now))) {
      reply.code(503).send({ error: { code: 'BUDGET_EXCEEDED', message: 'daily model budget exhausted' } });
      return;
    }
    if (!(await checkDailyCap(deps.db, user.id, user.tz, now))) {
      reply.code(409).send({ error: { code: 'CAPPED', message: 'daily scored session limit reached' } });
      return;
    }

    let sessionRow: SessionRow;
    try {
      const inserted = await deps.db
        .insert(sessions)
        .values({ userId: user.id, unitId: SAM_UNIT_ID })
        .returning();
      sessionRow = inserted[0]!;
    } catch (err) {
      if (isUniqueViolation(err)) {
        reply.code(409).send({ error: { code: 'SESSION_OPEN', message: 'an open session already exists' } });
        return;
      }
      throw err;
    }

    const opener: ChatMessage = { role: 'character', content: SAM_PACK.unit.persona.opener };
    await deps.db.insert(transcripts).values({
      sessionId: sessionRow.id,
      messages: [opener],
      expiresAt: addDays(now, 60),
    });
    await incrementDailyUsage(deps.db, user.id, user.tz, now);

    reply.code(201).send({
      session_id: sessionRow.id,
      opener: SAM_PACK.unit.persona.opener,
      remaining: SAM_PACK.unit.scenario.message_budget,
    });
  });

  app.get('/v1/sessions/:id', async (req, reply) => {
    const user = await requireUser(deps, req, reply);
    if (!user) return;
    const { id } = req.params as { id: string };

    const session = await loadOwnedSession(deps, id, user.id);
    if (!session) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'session not found' } });
      return;
    }
    const [transcriptRow] = await deps.db.select().from(transcripts).where(eq(transcripts.sessionId, id));
    reply.send({
      session_id: session.id,
      state: session.state,
      warmth: session.warmth,
      messages: transcriptRow?.messages ?? [],
      remaining: SAM_PACK.unit.scenario.message_budget - session.characterCalls,
    });
  });

  app.post('/v1/sessions/:id/messages', async (req, reply) => {
    const user = await requireUser(deps, req, reply);
    if (!user) return;
    const { id } = req.params as { id: string };

    const parsed = MessageBodySchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400).send({ error: { code: 'INVALID_BODY', message: parsed.error.message } });
      return;
    }

    const session = await loadOwnedSession(deps, id, user.id);
    if (!session) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'session not found' } });
      return;
    }
    if (session.state !== 'open') {
      reply.code(409).send({ error: { code: 'SESSION_NOT_OPEN', message: `session is ${session.state}` } });
      return;
    }
    if (session.characterCalls >= SAM_PACK.unit.scenario.message_budget) {
      reply.code(409).send({ error: { code: 'TURN_LIMIT', message: 'message budget exhausted' } });
      return;
    }

    const [transcriptRow] = await deps.db.select().from(transcripts).where(eq(transcripts.sessionId, id));
    const transcript: ChatMessage[] = [
      ...((transcriptRow?.messages as ChatMessage[] | undefined) ?? []),
      { role: 'user', content: parsed.data.text },
    ];

    const chatModel = deps.getChatModel(id);
    let completion: Awaited<ReturnType<typeof chatModel.complete>>;
    try {
      completion = await chatModel.complete({
        system: characterSystemPrompt(session.warmth),
        messages: transcript,
        maxTokens: 120,
        json: CharacterOutputSchema,
        tag: 'character',
      });
    } catch {
      reply.code(409).send({ error: { code: 'TURN_LIMIT', message: 'character script exhausted' } });
      return;
    }
    const out = CharacterOutputSchema.parse(completion.json);
    const warmth = clamp(0, 3, session.warmth + out.warmth_delta);
    transcript.push({ role: 'character', content: out.reply });
    const characterCalls = session.characterCalls + 1;
    const warmthTrace = [...((session.warmthTrace as number[] | undefined) ?? []), warmth];

    await deps.db.update(sessions).set({ warmth, warmthTrace, characterCalls }).where(eq(sessions.id, id));
    await deps.db.update(transcripts).set({ messages: transcript }).where(eq(transcripts.sessionId, id));
    await recordModelUsage(deps, id, 'character', completion.usage);

    reply.send({
      reply: out.reply,
      warmth,
      remaining: SAM_PACK.unit.scenario.message_budget - characterCalls,
    });
  });

  app.post('/v1/sessions/:id/end', async (req, reply) => {
    const user = await requireUser(deps, req, reply);
    if (!user) return;
    const { id } = req.params as { id: string };

    const session = await loadOwnedSession(deps, id, user.id);
    if (!session) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'session not found' } });
      return;
    }
    if (session.state !== 'open') {
      reply.code(409).send({ error: { code: 'SESSION_NOT_OPEN', message: `session is ${session.state}` } });
      return;
    }

    const now = new Date();
    await deps.db.update(sessions).set({ state: 'scoring', endedAt: now }).where(eq(sessions.id, id));

    const [transcriptRow] = await deps.db.select().from(transcripts).where(eq(transcripts.sessionId, id));
    const transcript = ((transcriptRow?.messages as ChatMessage[] | undefined) ?? []);
    const warmthTrace = (session.warmthTrace as number[] | undefined) ?? [];
    const signals = computeSignals(transcript, warmthTrace);

    const chatModel = deps.getChatModel(id);
    let feedbackCalls = session.feedbackCalls;
    let feedback: ReturnType<typeof buildTemplateFeedback> | undefined;
    let templateFallback = false;
    for (let attempt = 0; attempt < 2 && !feedback; attempt += 1) {
      const completion = await chatModel.complete({
        system: SAM_PACK.unit.feedback_prompt,
        messages: transcript,
        maxTokens: 300,
        json: FeedbackOutputSchema,
        tag: 'feedback',
      });
      feedbackCalls += 1;
      await recordModelUsage(deps, id, 'feedback', completion.usage);
      const candidate = FeedbackOutputSchema.parse(completion.json);
      if (checkEvidence(candidate, transcript)) {
        feedback = candidate;
      }
    }
    if (!feedback) {
      feedback = buildTemplateFeedback(signals);
      templateFallback = true;
    }

    const passed = passes(signals, SAM_PACK.unit.rubric);
    const scoreValue = score(signals, SAM_PACK.signals);

    await deps.db.insert(results).values({
      sessionId: id,
      win: feedback.win,
      fix: feedback.fix,
      moment: feedback.moment,
      score: scoreValue,
      passed,
      signals,
      templateFallback,
      expiresAt: addDays(now, 60),
    });
    await deps.db.update(sessions).set({ state: 'scored', feedbackCalls }).where(eq(sessions.id, id));
    deps.releaseChatModel(id);

    reply.send({ session_id: id, status: 'scored' });
  });

  app.get('/v1/sessions/:id/result', async (req, reply) => {
    const user = await requireUser(deps, req, reply);
    if (!user) return;
    const { id } = req.params as { id: string };

    const session = await loadOwnedSession(deps, id, user.id);
    if (!session) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'session not found' } });
      return;
    }
    if (session.state !== 'scored') {
      reply.code(202).send({ status: session.state });
      return;
    }
    const [row] = await deps.db.select().from(results).where(eq(results.sessionId, id));
    if (!row) {
      reply.code(404).send({ error: { code: 'NOT_FOUND', message: 'result not found' } });
      return;
    }
    reply.send({
      score: row.score,
      passed: row.passed,
      win: row.win,
      fix: row.fix,
      moment: row.moment,
      signals: row.signals,
      template_fallback: row.templateFallback,
    });
  });
}
