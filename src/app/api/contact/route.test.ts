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

describe('POST /api/contact', () => {
  beforeEach(() => {
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: 'abc' }, error: null });
  });

  it('rejects invalid payload', async () => {
    const res = await POST(makeRequest({ name: 'x' }));
    expect(res.status).toBe(400);
  });

  it('sends email with validated payload', async () => {
    const payload = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      service: 'corporate',
      message: 'I need a corporate video for my company.',
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
    };
    const res = await POST(makeRequest(payload));
    expect(res.status).toBe(500);
  });
});
