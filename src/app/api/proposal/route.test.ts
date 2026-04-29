import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendMock = vi.fn();
const messagesCreateMock = vi.fn();

vi.mock('resend', () => ({
  Resend: vi.fn(function (this: { emails: { send: typeof sendMock } }) {
    this.emails = { send: sendMock };
  }),
}));

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn(function (this: { messages: { create: typeof messagesCreateMock } }) {
    this.messages = { create: messagesCreateMock };
  }),
}));

vi.mock('@/lib/env', () => ({
  env: {
    anthropic: { apiKey: 'test-key', model: 'claude-test' },
    resend: {
      apiKey: 'test-key',
      fromEmail: 'hello@semperfimedia.llc',
      toEmail: 'hello@semperfimedia.llc',
    },
  },
}));

import { POST } from './route';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/proposal', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/proposal — bot defense', () => {
  beforeEach(() => {
    sendMock.mockReset();
    messagesCreateMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: 'abc' }, error: null });
  });

  it('silently drops when honeypot is filled (no Anthropic call, no email)', async () => {
    const res = await POST(
      makeRequest({
        name: 'xUkGJgFMibkUDUrmzBWHM',
        email: 'la.z.er.c.a.t.c.h.er@gmail.com',
        vision: 'kyltNlZWbHVDScMfmfRK random garbage submission text',
        loadedAt: Date.now() - 5_000,
        website: 'http://spammer.example.com',
      }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(messagesCreateMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('silently drops when submitted under 3s after page load', async () => {
    const res = await POST(
      makeRequest({
        name: 'Bot McBotface',
        email: 'bot@example.com',
        vision: 'submitted instantly, no human could fill this fast',
        loadedAt: Date.now() - 500,
      }),
    );
    expect(res.status).toBe(200);
    expect(messagesCreateMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('silently drops when no loadedAt timestamp is present', async () => {
    const res = await POST(
      makeRequest({
        name: 'Bot McBotface',
        email: 'bot@example.com',
        vision: 'no JS executed on the client = scripted bot',
      }),
    );
    expect(res.status).toBe(200);
    expect(messagesCreateMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });
});
