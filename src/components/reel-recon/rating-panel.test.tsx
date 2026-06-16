import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { RatingPanel } from './rating-panel';
import type { ReelReconReview } from '@/sanity/types';

afterEach(cleanup);

const reviewed: ReelReconReview = {
  _id: 'r1',
  filmTitle: 'Test Film',
  slug: { current: 'test-film' },
  status: 'reviewed',
  overallRating: 8.5,
  subRatings: { cinematography: 9, actionRealism: 8, story: 7, sound: 8 },
  verdict: 'Sharp and relentless.',
  publishedAt: '2026-06-15T00:00:00.000Z',
};

describe('RatingPanel', () => {
  it('shows the overall score and verdict when reviewed', () => {
    render(<RatingPanel review={reviewed} />);
    expect(screen.getByText('8.5')).toBeTruthy();
    expect(screen.getByText('Sharp and relentless.')).toBeTruthy();
    expect(screen.getByText('Cinematography')).toBeTruthy();
  });

  it('shows a pending state when anticipated', () => {
    const anticipated: ReelReconReview = {
      ...reviewed,
      status: 'anticipated',
      overallRating: undefined,
      subRatings: undefined,
      verdict: 'Pending — full review on release.',
    };
    render(<RatingPanel review={anticipated} />);
    expect(screen.getByText(/rating pending/i)).toBeTruthy();
  });
});
