import { describe, it, expect, vi, beforeEach } from 'vitest';

const getSessionUser = vi.fn();
const getCommentOwner = vi.fn();
const softDeleteComment = vi.fn();

vi.mock('@/lib/auth/session', () => ({ getSessionUser: () => getSessionUser() }));
vi.mock('@/lib/comments/service', () => ({
  getCommentOwner: (...a: unknown[]) => getCommentOwner(...a),
  softDeleteComment: (...a: unknown[]) => softDeleteComment(...a),
}));
vi.mock('@/lib/db', () => ({ hasDb: true }));

import { DELETE } from './route';

function ctx(id: string) {
  return { params: Promise.resolve({ id }) };
}
const req = () => new Request('http://localhost/api/comments/c1', { method: 'DELETE' });

beforeEach(() => {
  getSessionUser.mockReset();
  getCommentOwner.mockReset();
  softDeleteComment.mockReset();
});

describe('DELETE comment', () => {
  it('401 when not signed in', async () => {
    getSessionUser.mockResolvedValue(null);
    expect((await DELETE(req(), ctx('c1'))).status).toBe(401);
  });
  it('403 when not owner and not admin', async () => {
    getSessionUser.mockResolvedValue({ id: 'u2', role: 'user', isBlocked: false });
    getCommentOwner.mockResolvedValue('u1');
    expect((await DELETE(req(), ctx('c1'))).status).toBe(403);
  });
  it('allows the author to delete own', async () => {
    getSessionUser.mockResolvedValue({ id: 'u1', role: 'user', isBlocked: false });
    getCommentOwner.mockResolvedValue('u1');
    expect((await DELETE(req(), ctx('c1'))).status).toBe(200);
    expect(softDeleteComment).toHaveBeenCalledWith('c1');
  });
  it('allows an admin to delete any', async () => {
    getSessionUser.mockResolvedValue({ id: 'admin', role: 'admin', isBlocked: false });
    getCommentOwner.mockResolvedValue('u1');
    expect((await DELETE(req(), ctx('c1'))).status).toBe(200);
  });
});
