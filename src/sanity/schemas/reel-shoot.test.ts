import { describe, it, expect } from 'vitest';
import { reelShoot } from './reel-shoot';

type Field = { name: string; type?: string; of?: { fields?: Field[] }[] };

describe('reelShoot schema', () => {
  it('is a document type named reelShoot', () => {
    expect(reelShoot.name).toBe('reelShoot');
    expect(reelShoot.type).toBe('document');
  });

  it('carries the fields the client reels page groups and orders by', () => {
    const names = (reelShoot.fields as Field[]).map((f) => f.name);
    for (const name of ['client', 'title', 'slug', 'nav', 'label', 'blurb', 'shootDate', 'reels']) {
      expect(names).toContain(name);
    }
  });

  it('dates every reel so newest work can lead without a code change', () => {
    const reels = (reelShoot.fields as Field[]).find((f) => f.name === 'reels');
    const reelFields = reels?.of?.[0]?.fields?.map((f) => f.name) ?? [];
    for (const name of ['title', 'credit', 'muxPlaybackId', 'aspect', 'cover', 'shotAt']) {
      expect(reelFields).toContain(name);
    }
  });
});
