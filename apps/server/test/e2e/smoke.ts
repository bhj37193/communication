// P0-24: E2E smoke. Boots the REAL server process (index.ts) against
// charisma_test, waits on /healthz, drives the good run over the wire with
// fetch, asserts deterministic score 100. Exits nonzero on any mismatch.
// The one command a human can also run to see the whole system work offline.
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { SAM_GOOD_RUN } from '@charisma/core/fakes/FakeChatModel';

// ponytail: random high port per run, no retry-on-collision. Add a bind-retry
// loop if this ever flakes in CI.
const port = 20000 + Math.floor(Math.random() * 20000);
const base = `http://localhost:${port}`;

const child = spawn('tsx', ['src/index.ts'], {
  cwd: new URL('../..', import.meta.url),
  env: {
    ...process.env,
    PORT: String(port),
    DATABASE_URL: 'postgres://charisma_app@localhost:5432/charisma_test',
    NODE_ENV: 'development',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverOutput = '';
child.stdout?.on('data', (d) => (serverOutput += d));
child.stderr?.on('data', (d) => (serverOutput += d));

function fail(message: string): never {
  console.error(`e2e:smoke FAILED: ${message}`);
  console.error('--- server output ---\n' + serverOutput);
  child.kill();
  process.exit(1);
}

async function waitForHealthz(timeoutMs = 15_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) fail(`server process exited early (code ${child.exitCode})`);
    try {
      const res = await fetch(`${base}/healthz`);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  fail('server did not become healthy within timeout');
}

async function playGoodRun(): Promise<void> {
  const headers = { authorization: `Bearer smoke-${randomUUID()}` };

  const created = await fetch(`${base}/v1/sessions`, { method: 'POST', headers });
  if (created.status !== 201) fail(`POST /v1/sessions -> ${created.status}`);
  const { session_id: sessionId, opener } = await created.json();
  if (opener !== SAM_GOOD_RUN.opener) fail(`opener mismatch: ${opener}`);

  for (const text of SAM_GOOD_RUN.userMessages) {
    const res = await fetch(`${base}/v1/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (res.status !== 200) fail(`POST .../messages -> ${res.status}`);
  }

  const ended = await fetch(`${base}/v1/sessions/${sessionId}/end`, { method: 'POST', headers });
  if (ended.status !== 200) fail(`POST .../end -> ${ended.status}`);

  const result = await fetch(`${base}/v1/sessions/${sessionId}/result`, { headers });
  if (result.status !== 200) fail(`GET .../result -> ${result.status}`);
  const body = await result.json();

  if (body.score !== 100) fail(`score mismatch: expected 100, got ${body.score}`);
  if (body.passed !== true) fail(`passed mismatch: expected true, got ${body.passed}`);
  if (body.win.quote !== SAM_GOOD_RUN.feedback.win.quote) fail(`quote mismatch: ${body.win.quote}`);
}

try {
  await waitForHealthz();
  await playGoodRun();
} finally {
  child.kill();
}
console.log('e2e:smoke PASSED (score 100, passed, quote matches).');
process.exit(0);
