import Fastify from 'fastify';
import cors from '@fastify/cors';
import type { Deps } from './composition.js';
import { registerMeRoutes } from './routes/me.js';
import { registerSessionRoutes } from './routes/sessions.js';
import { registerWebhookRoutes } from './routes/webhooks.js';

export function buildApp(deps: Deps) {
  const app = Fastify({ logger: false });
  // CORS: dev reflects any origin (Expo web on :8081, LAN devices); prod is locked
  // to an explicit allowlist from CORS_ORIGINS. Fastify applies this on ready().
  const isProd = process.env.NODE_ENV === 'production';
  app.register(cors, {
    origin: isProd ? (process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()) ?? false) : true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  });
  app.get('/healthz', async () => ({ ok: true }));
  registerSessionRoutes(app, deps);
  registerMeRoutes(app, deps);
  registerWebhookRoutes(app, deps);
  return app;
}
