import { eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { Deps } from '../composition.js';
import { users } from '../db/schema.js';
import { deleteUserData } from '../services/deletion.js';
import { verifyClerkWebhook } from '../webhooks/verifyClerkWebhook.js';
import { upsertUser } from './sessions.js';

const ClerkWebhookReq = z.object({
  type: z.enum(['user.created', 'user.deleted']),
  data: z.object({ id: z.string() }).passthrough(),
});

function headerString(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function registerWebhookRoutes(app: FastifyInstance, deps: Deps): void {
  // Scoped plugin: the raw-string content-type parser below (needed to
  // verify the svix HMAC over the exact bytes sent) applies only inside
  // this encapsulation context, not to the rest of the app's JSON routes.
  app.register(async (scoped) => {
    scoped.addContentTypeParser('application/json', { parseAs: 'string' }, (_req, body, done) => {
      done(null, body);
    });

    scoped.post('/v1/webhooks/clerk', async (req, reply) => {
      const rawBody = req.body as string;
      const parsed = verifyClerkWebhook(
        deps.env.CLERK_WEBHOOK_SECRET,
        {
          svixId: headerString(req.headers['svix-id']),
          svixTimestamp: headerString(req.headers['svix-timestamp']),
          svixSignature: headerString(req.headers['svix-signature']),
        },
        rawBody,
      );
      if (parsed === null) {
        reply.code(400).send({ error: { code: 'INVALID_SIGNATURE', message: 'invalid webhook signature' } });
        return;
      }
      const body = ClerkWebhookReq.safeParse(parsed);
      if (!body.success) {
        reply.code(400).send({ error: { code: 'INVALID_BODY', message: body.error.message } });
        return;
      }

      if (body.data.type === 'user.created') {
        await upsertUser(deps, body.data.data.id);
      } else {
        // Idempotent: Clerk retries webhooks, and a re-delivered/unknown
        // user.deleted for an already-purged user is a no-op, not an error.
        const [row] = await deps.db.select().from(users).where(eq(users.clerkId, body.data.data.id));
        if (row) await deleteUserData(deps.db, row.id);
      }
      reply.send({ received: true });
    });
  });
}
