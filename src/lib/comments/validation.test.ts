import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/env', () => ({
  env: { auth: { adminEmails: ['semperfimedia.tx@gmail.com'] } },
}));

import { commentInputSchema, isAdminEmail } from './validation';

describe('commentInputSchema', () => {
  it('accepts a valid top-level comment', () => {
    expect(commentInputSchema.safeParse({ body: 'Great breakdown of the action.' }).success).toBe(true);
  });
  it('accepts a reply with a parentId', () => {
    expect(
      commentInputSchema.safeParse({
        body: 'Agreed.',
        parentId: '11111111-1111-1111-1111-111111111111',
      }).success,
    ).toBe(true);
  });
  it('rejects an empty body', () => {
    expect(commentInputSchema.safeParse({ body: '   ' }).success).toBe(false);
  });
  it('rejects a body over 4000 chars', () => {
    expect(commentInputSchema.safeParse({ body: 'x'.repeat(4001) }).success).toBe(false);
  });
  it('rejects a non-uuid parentId', () => {
    expect(commentInputSchema.safeParse({ body: 'hi', parentId: 'nope' }).success).toBe(false);
  });
});

describe('isAdminEmail', () => {
  it('matches configured admin emails case-insensitively', () => {
    expect(isAdminEmail('SemperFiMedia.TX@gmail.com')).toBe(true);
  });
  it('rejects non-admin emails', () => {
    expect(isAdminEmail('random@example.com')).toBe(false);
  });
});
