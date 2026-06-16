import type { ReelReconReview, ReelReconSubRatings } from '@/sanity/types';

export const SUB_RATING_LABELS: { key: keyof ReelReconSubRatings; label: string }[] = [
  { key: 'cinematography', label: 'Cinematography' },
  { key: 'actionRealism', label: 'Action / Realism' },
  { key: 'story', label: 'Story' },
  { key: 'sound', label: 'Sound' },
];

export function isReviewed(
  review: Pick<ReelReconReview, 'status' | 'overallRating'>,
): boolean {
  return review.status === 'reviewed' && typeof review.overallRating === 'number';
}

export function formatScore(value: number | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

export function buildReelReconJsonLd(
  review: ReelReconReview,
  siteUrl: string,
  imageUrl?: string | null,
): Record<string, unknown> {
  const url = `${siteUrl}/reel-recon/${review.slug.current}`;
  const author = { '@type': 'Person', name: review.author ?? 'TJ Gutierrez' };
  const publisher = { '@type': 'Organization', name: 'Semper Fi Media', url: siteUrl };

  if (isReviewed(review)) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      name: review.seoTitle || `${review.filmTitle} — Reel Recon Review`,
      itemReviewed: {
        '@type': 'Movie',
        name: review.filmTitle,
        ...(review.director
          ? { director: { '@type': 'Person', name: review.director } }
          : {}),
        ...(imageUrl ? { image: imageUrl } : {}),
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.overallRating,
        // Scale is 0–10 (the Sanity field allows a minimum of 0), so worstRating
        // must be 0 — a 0/10 review would otherwise sit below the declared minimum.
        bestRating: 10,
        worstRating: 0,
      },
      author,
      publisher,
      datePublished: review.publishedAt,
      ...(review.excerpt ? { reviewBody: review.excerpt } : {}),
      ...(imageUrl ? { image: imageUrl } : {}),
      url,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: review.seoTitle || review.filmTitle,
    description: review.excerpt,
    datePublished: review.publishedAt,
    author,
    publisher,
    ...(imageUrl ? { image: [imageUrl] } : {}),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}
