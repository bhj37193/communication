// Typed fetch client for the Charisma server contract. Shapes verified against
// apps/server/src/routes/sessions.ts + me.ts and packages/core FeedbackOutputSchema
// (win/fix/moment are objects, not strings — the planning doc drifted).
import { getAuthHeader } from './auth';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export type ErrorCode =
  | 'SESSION_OPEN'
  | 'CAPPED'
  | 'BUDGET_EXCEEDED'
  | 'UNAUTHENTICATED'
  | 'NOT_FOUND'
  | 'INVALID_BODY'
  | 'SESSION_NOT_OPEN'
  | 'TURN_LIMIT';

export class ApiError extends Error {
  readonly code: ErrorCode | 'UNKNOWN';
  readonly status: number;
  constructor(code: ErrorCode | 'UNKNOWN', message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

export interface ChatMessage {
  role: 'user' | 'character';
  content: string;
}

export interface CreateSessionResult {
  session_id: string;
  opener: string;
  remaining: number;
}

export interface SessionState {
  session_id: string;
  state: 'open' | 'scoring' | 'scored';
  warmth: number;
  messages: ChatMessage[];
  remaining: number;
}

export interface SendMessageResult {
  reply: string;
  warmth: number;
  remaining: number;
}

export interface EndSessionResult {
  session_id: string;
  status: 'scored';
}

export interface FeedbackWin {
  text: string;
  quote: string;
}
export interface FeedbackFix {
  text: string;
  anchor: string;
}
export interface FeedbackMoment {
  text: string;
  quote: string;
}

export interface ScoredResult {
  score: number;
  passed: boolean;
  win: FeedbackWin;
  fix: FeedbackFix;
  moment: FeedbackMoment;
  signals: unknown;
  template_fallback: boolean;
}

// GET /result returns 202 while still open/scoring, 200 once scored.
export type ResultResponse =
  | { status: 'pending'; state: 'open' | 'scoring' }
  | { status: 'scored'; result: ScoredResult };

interface ErrorEnvelope {
  error?: { code?: string; message?: string };
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  const authHeader = await getAuthHeader();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...authHeader,
    ...(init?.headers as Record<string, string> | undefined),
  };
  return fetch(`${BASE_URL}${path}`, { ...init, headers });
}

async function throwApiError(res: Response): Promise<never> {
  let code: ErrorCode | 'UNKNOWN' = 'UNKNOWN';
  let message = `request failed with status ${res.status}`;
  try {
    const body = (await res.json()) as ErrorEnvelope;
    if (body.error?.code) code = body.error.code as ErrorCode;
    if (body.error?.message) message = body.error.message;
  } catch {
    // non-JSON body; keep defaults
  }
  throw new ApiError(code, message, res.status);
}

export async function createSession(): Promise<CreateSessionResult> {
  const res = await request('/v1/sessions', { method: 'POST' });
  if (res.status !== 201) await throwApiError(res);
  return (await res.json()) as CreateSessionResult;
}

export async function getSession(id: string): Promise<SessionState> {
  const res = await request(`/v1/sessions/${id}`, { method: 'GET' });
  if (res.status !== 200) await throwApiError(res);
  return (await res.json()) as SessionState;
}

export async function sendMessage(id: string, text: string): Promise<SendMessageResult> {
  const trimmed = text.trim();
  if (trimmed.length < 1 || trimmed.length > 500) {
    throw new ApiError('INVALID_BODY', 'text must be 1–500 characters', 400);
  }
  const res = await request(`/v1/sessions/${id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: trimmed }),
  });
  if (res.status !== 200) await throwApiError(res);
  return (await res.json()) as SendMessageResult;
}

export async function endSession(id: string): Promise<EndSessionResult> {
  const res = await request(`/v1/sessions/${id}/end`, { method: 'POST' });
  if (res.status !== 200) await throwApiError(res);
  return (await res.json()) as EndSessionResult;
}

export async function getResult(id: string): Promise<ResultResponse> {
  const res = await request(`/v1/sessions/${id}/result`, { method: 'GET' });
  if (res.status === 202) {
    const body = (await res.json()) as { status: 'open' | 'scoring' };
    return { status: 'pending', state: body.status };
  }
  if (res.status !== 200) await throwApiError(res);
  return { status: 'scored', result: (await res.json()) as ScoredResult };
}

export async function deleteMyData(): Promise<void> {
  const res = await request('/v1/me/data', { method: 'DELETE' });
  if (res.status !== 204) await throwApiError(res);
}

// Fire-and-forget analytics ping when the user shares their score card. Throws
// on failure like every other call here; the share flow (lib/share.ts) wraps it
// in try/catch so a dropped ping never blocks or errors the share sheet.
export async function trackShareTapped(): Promise<void> {
  const res = await request('/v1/events/share-tapped', { method: 'POST' });
  if (res.status !== 204) await throwApiError(res);
}
