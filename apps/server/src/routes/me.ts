import type { FastifyInstance } from 'fastify';
import type { Deps } from '../composition.js';
import { deleteUserData } from '../services/deletion.js';
import { requireUser } from './sessions.js';

export function registerMeRoutes(app: FastifyInstance, deps: Deps): void {
  app.delete('/v1/me/data', async (req, reply) => {
    const user = await requireUser(deps, req, reply);
    if (!user) return;

    await deleteUserData(deps.db, user.id);
    reply.code(204).send();
  });
}
