import { describe, it, expect } from 'vitest';
import { reelReconReview } from './reel-recon-review';

describe('reelReconReview schema', () => {
  it('is a document type named reelReconReview', () => {
    expect(reelReconReview.name).toBe('reelReconReview');
    expect(reelReconReview.type).toBe('document');
  });
  it('defines the core fields', () => {
    const fieldNames = (reelReconReview.fields as { name: string }[]).map((f) => f.name);
    for (const name of [
      'filmTitle',
      'slug',
      'status',
      'poster',
      'overallRating',
      'subRatings',
      'verdict',
      'body',
      'publishedAt',
    ]) {
      expect(fieldNames).toContain(name);
    }
  });
});
