import {
  ApiError,
  createSession,
  deleteMyData,
  endSession,
  getChallenge,
  getResult,
  getSession,
  sendMessage,
} from '../lib/api';

// No EXPO_PUBLIC_API_URL / DEV_FAKE / CLERK key set in the test env, so:
//  - base URL falls back to http://localhost:3000
//  - auth takes the dev-fake path -> Authorization: Bearer <devUserId>
//    (devUserId is the mocked expo-crypto uuid on first run)
const BASE = 'http://localhost:3000';

function mockResponse(status: number, body: unknown): Response {
  return {
    status,
    json: async () => body,
  } as unknown as Response;
}

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

function lastCall(): [string, RequestInit] {
  const call = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
  return [call[0] as string, call[1] as RequestInit];
}

describe('auth header (drift check: Bearer, not x-test-user)', () => {
  it('sends Authorization: Bearer <id> and never x-test-user', async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse(201, { session_id: 's1', opener: 'hi', remaining: 10 }),
    );
    await createSession();
    const [, init] = lastCall();
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer test-uuid');
    expect(headers['x-test-user']).toBeUndefined();
  });
});

describe('createSession', () => {
  it('POSTs /v1/sessions and parses 201', async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse(201, { session_id: 's1', opener: 'Hey.', remaining: 10 }),
    );
    const res = await createSession();
    const [url, init] = lastCall();
    expect(url).toBe(`${BASE}/v1/sessions`);
    expect(init.method).toBe('POST');
    expect(res).toEqual({ session_id: 's1', opener: 'Hey.', remaining: 10 });
  });

  it('throws ApiError with code on 409 SESSION_OPEN', async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse(409, { error: { code: 'SESSION_OPEN', message: 'already open' } }),
    );
    await expect(createSession()).rejects.toMatchObject({
      code: 'SESSION_OPEN',
      status: 409,
      message: 'already open',
    });
  });
});

describe('getSession', () => {
  it('GETs /v1/sessions/:id and parses 200', async () => {
    const body = {
      session_id: 's1',
      state: 'open',
      warmth: 1,
      messages: [{ role: 'character', content: 'Hey.' }],
      remaining: 9,
    };
    fetchMock.mockResolvedValueOnce(mockResponse(200, body));
    const res = await getSession('s1');
    const [url, init] = lastCall();
    expect(url).toBe(`${BASE}/v1/sessions/s1`);
    expect(init.method).toBe('GET');
    expect(res).toEqual(body);
  });

  it('throws ApiError on 404 NOT_FOUND', async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse(404, { error: { code: 'NOT_FOUND', message: 'nope' } }),
    );
    await expect(getSession('bad')).rejects.toBeInstanceOf(ApiError);
  });
});

describe('getChallenge', () => {
  it('GETs /v1/challenge/today and parses 200', async () => {
    const body = {
      unit_id: 'everyday.followups.housewarming-sam',
      skill_id: 'followups',
      title: 'The Housewarming',
      setup_text: "You're at a friend's housewarming.",
      character_name: 'Sam',
      message_budget: 10,
    };
    fetchMock.mockResolvedValueOnce(mockResponse(200, body));
    const res = await getChallenge();
    const [url, init] = lastCall();
    expect(url).toBe(`${BASE}/v1/challenge/today`);
    expect(init.method).toBe('GET');
    expect(res).toEqual(body);
  });

  it('throws ApiError on 401 UNAUTHENTICATED', async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse(401, { error: { code: 'UNAUTHENTICATED', message: 'sign in' } }),
    );
    await expect(getChallenge()).rejects.toBeInstanceOf(ApiError);
  });
});

describe('sendMessage', () => {
  it('POSTs /messages with JSON body and parses 200', async () => {
    fetchMock.mockResolvedValueOnce(mockResponse(200, { reply: 'Oh nice', warmth: 2, remaining: 8 }));
    const res = await sendMessage('s1', '  hello  ');
    const [url, init] = lastCall();
    expect(url).toBe(`${BASE}/v1/sessions/s1/messages`);
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    expect(init.body).toBe(JSON.stringify({ text: 'hello' })); // trimmed
    expect(res).toEqual({ reply: 'Oh nice', warmth: 2, remaining: 8 });
  });

  it('rejects empty text client-side without calling fetch', async () => {
    await expect(sendMessage('s1', '   ')).rejects.toMatchObject({ code: 'INVALID_BODY' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('throws ApiError on 409 TURN_LIMIT', async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse(409, { error: { code: 'TURN_LIMIT', message: 'done' } }),
    );
    await expect(sendMessage('s1', 'hi')).rejects.toMatchObject({ code: 'TURN_LIMIT', status: 409 });
  });
});

describe('endSession', () => {
  it('POSTs /end and parses 200', async () => {
    fetchMock.mockResolvedValueOnce(mockResponse(200, { session_id: 's1', status: 'scored' }));
    const res = await endSession('s1');
    const [url, init] = lastCall();
    expect(url).toBe(`${BASE}/v1/sessions/s1/end`);
    expect(init.method).toBe('POST');
    expect(res).toEqual({ session_id: 's1', status: 'scored' });
  });

  it('throws ApiError on 409 SESSION_NOT_OPEN', async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse(409, { error: { code: 'SESSION_NOT_OPEN', message: 'not open' } }),
    );
    await expect(endSession('s1')).rejects.toMatchObject({ code: 'SESSION_NOT_OPEN' });
  });
});

describe('getResult', () => {
  it('returns pending on 202 (poll again)', async () => {
    fetchMock.mockResolvedValueOnce(mockResponse(202, { status: 'scoring' }));
    const res = await getResult('s1');
    const [url, init] = lastCall();
    expect(url).toBe(`${BASE}/v1/sessions/s1/result`);
    expect(init.method).toBe('GET');
    expect(res).toEqual({ status: 'pending', state: 'scoring' });
  });

  it('returns scored result (objects for win/fix/moment) on 200', async () => {
    const scored = {
      score: 100,
      passed: true,
      win: { text: 'You asked a great question', quote: 'What brings you here?' },
      fix: { text: 'Follow up sooner', anchor: 'message 3' },
      moment: { text: 'Sam opened up', quote: 'Actually, yeah…' },
      signals: { open_questions: 3 },
      template_fallback: false,
    };
    fetchMock.mockResolvedValueOnce(mockResponse(200, scored));
    const res = await getResult('s1');
    expect(res).toEqual({ status: 'scored', result: scored });
    if (res.status === 'scored') {
      expect(res.result.win.quote).toBe('What brings you here?');
      expect(res.result.fix.anchor).toBe('message 3');
    }
  });

  it('throws ApiError on 404', async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse(404, { error: { code: 'NOT_FOUND', message: 'gone' } }),
    );
    await expect(getResult('s1')).rejects.toBeInstanceOf(ApiError);
  });
});

describe('deleteMyData', () => {
  it('DELETEs /v1/me/data and resolves on 204', async () => {
    fetchMock.mockResolvedValueOnce(mockResponse(204, undefined));
    await expect(deleteMyData()).resolves.toBeUndefined();
    const [url, init] = lastCall();
    expect(url).toBe(`${BASE}/v1/me/data`);
    expect(init.method).toBe('DELETE');
  });

  it('throws ApiError on 401 UNAUTHENTICATED', async () => {
    fetchMock.mockResolvedValueOnce(
      mockResponse(401, { error: { code: 'UNAUTHENTICATED', message: 'sign in' } }),
    );
    await expect(deleteMyData()).rejects.toMatchObject({ code: 'UNAUTHENTICATED', status: 401 });
  });
});
