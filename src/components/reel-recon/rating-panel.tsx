import { DataLabel } from '@/components/primitives/data-label';
import { SUB_RATING_LABELS, formatScore, isReviewed } from '@/lib/reel-recon';
import type { ReelReconReview } from '@/sanity/types';

export function RatingPanel({ review }: { review: ReelReconReview }) {
  if (!isReviewed(review)) {
    return (
      <div className="rounded border border-brass/30 bg-black/40 p-6">
        <DataLabel className="text-brass">Rating Pending</DataLabel>
        <p className="mt-3 text-bone-muted">
          TJ&apos;s full breakdown and score drop once the film is out. Check back after release.
        </p>
      </div>
    );
  }

  const sub = review.subRatings ?? {};

  return (
    <div className="rounded border border-brass/30 bg-black/40 p-6">
      <div className="flex items-end gap-3">
        <span className="font-serif text-6xl italic leading-none text-brass">
          {formatScore(review.overallRating)}
        </span>
        <span className="mb-1 text-lg text-bone-muted">/ 10</span>
      </div>
      {review.verdict && (
        <p className="mt-4 font-serif text-xl italic text-bone">{review.verdict}</p>
      )}
      <ul className="mt-6 space-y-3">
        {SUB_RATING_LABELS.map(({ key, label }) => {
          const value = sub[key];
          if (typeof value !== 'number') return null;
          return (
            <li key={key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-bone-muted">{label}</span>
                <span className="font-medium text-bone">{formatScore(value)}/10</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-bone/10">
                <div
                  className="h-full rounded-full bg-brass"
                  style={{ width: `${Math.max(0, Math.min(10, value)) * 10}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
