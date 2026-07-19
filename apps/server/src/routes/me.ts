import type { FastifyInstance } from 'fastify';
import type { Deps } from '../composition.js';
import { trackEvent } from '../services/analytics.js';
import { deleteUserData } from '../services/deletion.js';
import { requireUser } from './sessions.js';

export function registerMeRoutes(app: FastifyInstance, deps: Deps): void {
  app.delete('/v1/me/data', async (req, reply) => {
    const user = await requireUser(deps, req, reply);
    if (!user) return;

    await deleteUserData(deps.db, user.id);
    reply.code(204).send();
  });

  app.post('/v1/events/share-tapped', async (req, reply) => {
    const user = await requireUser(deps, req, reply);
    if (!user) return;

    await trackEvent(deps.db, user, 'share_tapped', {}, new Date());
    reply.code(204).send();
  });
}
