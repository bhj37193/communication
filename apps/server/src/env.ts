import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().default('postgres://charisma_app@localhost:5432/charisma'),
  DATABASE_URL_OWNER: z.string().default('postgres://main@localhost:5432/charisma'),
  // Provider selectors: composition.ts is the only file that reads these to
  // instantiate concrete classes (mock-boundary architecture).
  AUTH_PROVIDER: z.enum(['fake', 'clerk']).default('fake'),
  MODEL_PROVIDER: z.enum(['fake', 'anthropic']).default('fake'),
  ANTHROPIC_API_KEY: z.string().default(''),
  DAILY_MODEL_BUDGET_USD: z.coerce.number().positive().default(20),
  // Empty -> /v1/webhooks/clerk accepts unsigned JSON bodies (fake/test mode).
  CLERK_WEBHOOK_SECRET: z.string().default(''),
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  return EnvSchema.parse(source);
}
