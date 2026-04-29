import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendMock = vi.fn();

vi.mock('resend', () => ({
  Resend: vi.fn(function (this: { emails: { send: typeof sendMock } }) {
    this.emails = { send: sendMock };
  }),
}));

vi.mock('@/lib/env', () => ({
  env: {
    resend: {
      apiKey: 'test-key',
      toEmail: 'hello@semperfimedia.llc',
    },
  },
}));

import { POST } from './route';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// 5 seconds before "now" — clears the 3s time-trap.
const humanLoadedAt = () => Date.now() - 5000;

describe('POST /api/contact', () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: 'abc' }, error: null });
  });

  it('rejects invalid payload', async () => {
    // loadedAt is set so the request gets past the bot defense and reaches Zod.
    const res = await POST(makeRequest({ name: 'x', loadedAt: humanLoadedAt() }));
    expect(res.status).toBe(400);
  });

  it('sends email with validated payload', async () => {
    const payload = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      service: 'corporate',
      message: 'I need a corporate video for my company.',
      loadedAt: humanLoadedAt(),
    };
    const res = await POST(makeRequest(payload));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledOnce();
    const firstCall = sendMock.mock.calls[0];
    expect(firstCall?.[0]?.to).toBe('hello@semperfimedia.llc');
  });

  it('returns 500 if Resend errors', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'boom' } });
    const payload = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      service: 'wedding',
      message: 'Wedding inquiry test message content.',
      loadedAt: humanLoadedAt(),
    };
    const res = await POST(makeRequest(payload));
    expect(res.status).toBe(500);
  });

  it('silently drops submissions where the honeypot is filled', async () => {
    const payload = {
      name: 'xUkGJgFMibkUDUrmzBWHM',
      email: 'spam@example.com',
      service: 'corporate',
      message: 'mfSaoEbBWiwHeyzFrOa more text to clear length minimum',
      loadedAt: humanLoadedAt(),
      website: 'http://spammer.example.com',
    };
    const res = await POST(makeRequest(payload));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('silently drops submissions that arrive faster than a human can fill the form', async () => {
    const payload = {
      name: 'Bot McBotface',
      email: 'bot@example.com',
      service: 'corporate',
      message: 'This message arrived under 3 seconds after page load.',
      loadedAt: Date.now() - 500,
    };
    const res = await POST(makeRequest(payload));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('silently drops submissions with no loadedAt timestamp at all', async () => {
    const payload = {
      name: 'Bot McBotface',
      email: 'bot@example.com',
      service: 'corporate',
      message: 'No loadedAt at all — likely scripted, no JS execution.',
    };
    const res = await POST(makeRequest(payload));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMock).not.toHaveBeenCalled();
  });
});
