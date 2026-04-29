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
      fromEmail: 'hello@semperfimedia.llc',
      toEmail: 'hello@semperfimedia.llc',
    },
  },
}));

import { POST } from './route';

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/referral', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/referral — bot defense', () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: 'abc' }, error: null });
  });

  it('silently drops when honeypot is filled', async () => {
    const res = await POST(
      makeRequest({
        referrerName: 'xUkGJgFM',
        referrerEmail: 'spam@example.com',
        coupleName: 'bDAbLHEi',
        coupleEmail: 'la.z.er@gmail.com',
        loadedAt: Date.now() - 5_000,
        website: 'http://spammer.example.com',
      }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('silently drops when submitted under 3s after page load', async () => {
    const res = await POST(
      makeRequest({
        referrerName: 'Bot McBotface',
        referrerEmail: 'bot@example.com',
        coupleName: 'Couple Couplerson',
        coupleEmail: 'couple@example.com',
        loadedAt: Date.now() - 500,
      }),
    );
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('silently drops when no loadedAt timestamp is present', async () => {
    const res = await POST(
      makeRequest({
        referrerName: 'Bot McBotface',
        referrerEmail: 'bot@example.com',
        coupleName: 'Couple Couplerson',
        coupleEmail: 'couple@example.com',
      }),
    );
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
