import { describe, it, expect } from 'vitest';
import { sha256Hex, normalizeAndHash } from './hash';

describe('sha256Hex', () => {
  it('produces a stable hex digest', async () => {
    const out = await sha256Hex('hello');
    expect(out).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('returns empty string for empty input', async () => {
    expect(await sha256Hex('')).toBe('');
  });
});

describe('normalizeAndHash', () => {
  it('lowercases + trims email before hashing', async () => {
    const a = await normalizeAndHash('  Test@Example.com  ');
    const b = await normalizeAndHash('test@example.com');
    expect(a).toBe(b);
    expect(a).toHaveLength(64);
  });

  it('returns empty string for empty/whitespace', async () => {
    expect(await normalizeAndHash('')).toBe('');
    expect(await normalizeAndHash('   ')).toBe('');
  });
});
