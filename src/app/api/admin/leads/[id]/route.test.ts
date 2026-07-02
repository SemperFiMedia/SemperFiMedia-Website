import { describe, it, expect, vi, beforeEach } from 'vitest';

const getSessionUser = vi.fn();
const updateLeadStatus = vi.fn();

vi.mock('@/lib/auth/session', () => ({ getSessionUser: () => getSessionUser() }));
vi.mock('@/lib/chatbot/leads-admin', () => ({
  updateLeadStatus: (...a: unknown[]) => updateLeadStatus(...a),
}));
vi.mock('@/lib/db', () => ({ hasDb: true }));

import { PATCH } from './route';

const LEAD_ID = '7f9c24e5-1a2b-4c3d-8e4f-5a6b7c8d9e0f';

function ctx(id: string) {
  return { params: Promise.resolve({ id }) };
}
const req = (body: unknown) =>
  new Request(`http://localhost/api/admin/leads/${LEAD_ID}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });

beforeEach(() => {
  getSessionUser.mockReset();
  updateLeadStatus.mockReset();
});

describe('PATCH lead status', () => {
  it('401 when not signed in', async () => {
    getSessionUser.mockResolvedValue(null);
    expect((await PATCH(req({ status: 'contacted' }), ctx(LEAD_ID))).status).toBe(401);
  });
  it('403 when not admin', async () => {
    getSessionUser.mockResolvedValue({ id: 'u1', role: 'user', isBlocked: false });
    expect((await PATCH(req({ status: 'contacted' }), ctx(LEAD_ID))).status).toBe(403);
  });
  it('400 on an unknown status value', async () => {
    getSessionUser.mockResolvedValue({ id: 'a1', role: 'admin', isBlocked: false });
    expect((await PATCH(req({ status: 'sold' }), ctx(LEAD_ID))).status).toBe(400);
    expect(updateLeadStatus).not.toHaveBeenCalled();
  });
  it('400 on a malformed body', async () => {
    getSessionUser.mockResolvedValue({ id: 'a1', role: 'admin', isBlocked: false });
    const badReq = new Request(`http://localhost/api/admin/leads/${LEAD_ID}`, {
      method: 'PATCH',
      body: 'not json',
    });
    expect((await PATCH(badReq, ctx(LEAD_ID))).status).toBe(400);
  });
  it('404 when the lead does not exist', async () => {
    getSessionUser.mockResolvedValue({ id: 'a1', role: 'admin', isBlocked: false });
    updateLeadStatus.mockResolvedValue(false);
    expect((await PATCH(req({ status: 'won' }), ctx(LEAD_ID))).status).toBe(404);
  });
  it('updates status as admin', async () => {
    getSessionUser.mockResolvedValue({ id: 'a1', role: 'admin', isBlocked: false });
    updateLeadStatus.mockResolvedValue(true);
    const res = await PATCH(req({ status: 'won' }), ctx(LEAD_ID));
    expect(res.status).toBe(200);
    expect(updateLeadStatus).toHaveBeenCalledWith(LEAD_ID, 'won');
  });
});
