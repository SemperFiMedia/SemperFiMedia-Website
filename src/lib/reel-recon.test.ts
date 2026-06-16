import { describe, it, expect } from 'vitest';
import {
  SUB_RATING_LABELS,
  isReviewed,
  formatScore,
  buildReelReconJsonLd,
} from './reel-recon';
import type { ReelReconReview } from '@/sanity/types';

const base: ReelReconReview = {
  _id: 'r1',
  filmTitle: 'Test Film',
  slug: { current: 'test-film' },
  status: 'reviewed',
  overallRating: 8,
  director: 'Jane Doe',
  excerpt: 'A short take.',
  publishedAt: '2026-06-15T00:00:00.000Z',
};

describe('SUB_RATING_LABELS', () => {
  it('lists the four craft scores in display order', () => {
    expect(SUB_RATING_LABELS.map((s) => s.key)).toEqual([
      'cinematography',
      'actionRealism',
      'story',
      'sound',
    ]);
  });
});

describe('isReviewed', () => {
  it('is true when reviewed with a numeric overall score', () => {
    expect(isReviewed({ status: 'reviewed', overallRating: 8 })).toBe(true);
  });
  it('is false when anticipated', () => {
    expect(isReviewed({ status: 'anticipated', overallRating: undefined })).toBe(false);
  });
  it('is false when reviewed but no score yet', () => {
    expect(isReviewed({ status: 'reviewed', overallRating: undefined })).toBe(false);
  });
});

describe('formatScore', () => {
  it('renders integers without decimals', () => {
    expect(formatScore(8)).toBe('8');
  });
  it('renders one decimal for fractional scores', () => {
    expect(formatScore(8.5)).toBe('8.5');
  });
  it('renders an em dash for missing scores', () => {
    expect(formatScore(undefined)).toBe('—');
  });
});

describe('buildReelReconJsonLd', () => {
  it('emits a Review with reviewRating when reviewed', () => {
    const ld = buildReelReconJsonLd(base, 'https://example.com') as Record<string, unknown>;
    expect(ld['@type']).toBe('Review');
    expect((ld.reviewRating as Record<string, unknown>).ratingValue).toBe(8);
    expect((ld.reviewRating as Record<string, unknown>).bestRating).toBe(10);
    expect((ld.itemReviewed as Record<string, unknown>)['@type']).toBe('Movie');
    expect(ld.url).toBe('https://example.com/reel-recon/test-film');
  });
  it('emits an Article with no rating when anticipated', () => {
    const anticipated: ReelReconReview = {
      ...base,
      status: 'anticipated',
      overallRating: undefined,
    };
    const ld = buildReelReconJsonLd(anticipated, 'https://example.com') as Record<string, unknown>;
    expect(ld['@type']).toBe('Article');
    expect(ld.reviewRating).toBeUndefined();
  });
});
