import { describe, it, expect, vi, beforeEach } from 'vitest';

const getSessionUser = vi.fn();
const createComment = vi.fn();
const listComments = vi.fn();

vi.mock('@/lib/auth/session', () => ({ getSessionUser: () => getSessionUser() }));
vi.mock('@/lib/comments/service', () => ({
  createComment: (...a: unknown[]) => createComment(...a),
  listComments: (...a: unknown[]) => listComments(...a),
  DbUnavailableError: class extends Error {},
  ReplyDepthError: class extends Error {},
}));
vi.mock('@/lib/db', () => ({ hasDb: true }));

import { GET, POST } from './route';

function ctx(slug: string) {
  return { params: Promise.resolve({ slug }) };
}
function postReq(body: unknown) {
  return new Request('http://localhost/api/reel-recon/x/comments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  getSessionUser.mockReset();
  createComment.mockReset();
  listComments.mockReset();
});

describe('GET comments', () => {
  it('returns the list for a slug', async () => {
    listComments.mockResolvedValue([]);
    const res = await GET(new Request('http://localhost/x'), ctx('the-punisher'));
    expect(res.status).toBe(200);
    expect(listComments).toHaveBeenCalledWith('the-punisher');
  });
});

describe('POST comments', () => {
  it('401 when not signed in', async () => {
    getSessionUser.mockResolvedValue(null);
    const res = await POST(postReq({ body: 'hi' }), ctx('the-punisher'));
    expect(res.status).toBe(401);
  });
  it('403 when blocked', async () => {
    getSessionUser.mockResolvedValue({ id: 'u1', role: 'user', isBlocked: true });
    const res = await POST(postReq({ body: 'hi' }), ctx('the-punisher'));
    expect(res.status).toBe(403);
  });
  it('400 on invalid body', async () => {
    getSessionUser.mockResolvedValue({ id: 'u1', role: 'user', isBlocked: false });
    const res = await POST(postReq({ body: '   ' }), ctx('the-punisher'));
    expect(res.status).toBe(400);
  });
  it('201 on success', async () => {
    getSessionUser.mockResolvedValue({ id: 'u1', role: 'user', isBlocked: false });
    createComment.mockResolvedValue({ id: 'c1', body: 'hi' });
    const res = await POST(postReq({ body: 'hi' }), ctx('the-punisher'));
    expect(res.status).toBe(201);
    expect(createComment).toHaveBeenCalled();
  });
});
