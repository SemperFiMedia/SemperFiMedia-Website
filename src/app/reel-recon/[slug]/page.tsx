import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { RatingPanel } from '@/components/reel-recon/rating-panel';
import { reelReconPortableComponents } from '@/components/reel-recon/portable-components';
import { CommentsSection } from '@/components/reel-recon/comments/comments-section';
import {
  getReelReconReviewBySlug,
  getRelatedReelReconReviews,
} from '@/sanity/queries';
import { urlForImage } from '@/sanity/image';
import { buildReelReconJsonLd, formatScore, isReviewed } from '@/lib/reel-recon';
import { env } from '@/lib/env';

type RouteProps = { params: Promise<{ slug: string }> };

// The root layout reads cookies() (consent state) — a dynamic API — which makes
// static rendering impossible. Render this route dynamically so it never attempts
// static generation (which throws DYNAMIC_SERVER_USAGE when built with no reviews).
export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  // releaseDate is a Sanity `date` (no time component). Parsed as UTC midnight,
  // so format in UTC to avoid rendering one day early in US timezones.
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const review = await getReelReconReviewBySlug(slug);
  if (!review) return { title: 'Not Found' };
  const title = review.seoTitle || `${review.filmTitle} — Reel Recon Review`;
  const description = review.seoDescription || review.excerpt;
  const image = review.coverImage ?? review.poster;
  const builder = image ? urlForImage(image) : null;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: review.publishedAt,
      authors: review.author ? [review.author] : undefined,
      images: builder ? [builder.width(1200).height(630).url()] : [],
    },
  };
}

export default async function ReelReconReviewPage({ params }: RouteProps) {
  const { slug } = await params;
  const review = await getReelReconReviewBySlug(slug);
  if (!review) notFound();

  const related = await getRelatedReelReconReviews(slug, 3);
  const body = Array.isArray(review.body) ? (review.body as PortableTextBlock[]) : null;
  const posterUrl = review.poster ? urlForImage(review.poster)?.width(800).url() : null;
  const jsonLdImage = review.coverImage ?? review.poster;
  const jsonLdImageUrl = jsonLdImage ? urlForImage(jsonLdImage)?.width(1200).url() ?? null : null;
  const jsonLd = buildReelReconJsonLd(review, env.siteUrl, jsonLdImageUrl);

  const meta = [
    review.releaseDate ? formatDate(review.releaseDate) : null,
    review.runtime ? `${review.runtime} min` : null,
    review.whereToWatch,
    review.director ? `Dir. ${review.director}` : null,
  ].filter(Boolean);

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <header className="bg-black px-6 pt-28 pb-12 md:px-12 md:pt-36">
          <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 md:grid-cols-[300px_1fr] md:items-start">
            {posterUrl ? (
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded">
                <Image
                  src={posterUrl}
                  alt={review.filmTitle}
                  fill
                  sizes="(min-width: 768px) 300px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-[2/3] w-full rounded bg-gradient-to-br from-dusk-teal to-texas-umber" />
            )}
            <div>
              <DataLabel className="mb-4 text-brass">
                Reel Recon
                {isReviewed(review) ? ` · ${formatScore(review.overallRating)}/10` : ' · Anticipated'}
              </DataLabel>
              <h1 className="font-serif text-4xl italic leading-[1.05] md:text-6xl">
                {review.filmTitle}
              </h1>
              {meta.length > 0 && (
                <p className="mt-4 text-sm uppercase tracking-wider text-bone-muted">
                  {meta.join(' · ')}
                </p>
              )}
              {review.excerpt && (
                <p className="mt-6 text-lg leading-relaxed text-bone-muted">{review.excerpt}</p>
              )}
              <div className="mt-8">
                <RatingPanel review={review} />
              </div>
            </div>
          </div>
        </header>

        {body && (
          <section className="bg-gunpowder px-6 py-16 md:px-12 md:py-24">
            <div className="mx-auto max-w-[720px] text-lg">
              <PortableText value={body} components={reelReconPortableComponents} />
            </div>
          </section>
        )}
        <CommentsSection slug={review.slug.current} />

        {related.length > 0 && (
          <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-24">
            <div className="mx-auto max-w-[1200px]">
              <DataLabel className="mb-8">More Reel Recon</DataLabel>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {related.map((r) => {
                  const rPoster = r.poster ? urlForImage(r.poster)?.width(400).url() : null;
                  return (
                    <Link
                      key={r._id}
                      href={`/reel-recon/${r.slug.current}`}
                      className="group flex flex-col"
                    >
                      {rPoster ? (
                        <div className="relative aspect-[2/3] overflow-hidden rounded">
                          <Image
                            src={rPoster}
                            alt={r.filmTitle}
                            fill
                            sizes="(min-width: 768px) 33vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[2/3] rounded bg-gradient-to-br from-dusk-teal to-texas-umber" />
                      )}
                      <DataLabel tone="muted" className="mt-3 text-[10px]">
                        {isReviewed(r) ? `${formatScore(r.overallRating)}/10` : 'Anticipated'}
                      </DataLabel>
                      <h3 className="mt-1 font-serif text-lg italic transition-colors group-hover:text-brass">
                        {r.filmTitle}
                      </h3>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              We don&apos;t just watch films. We make them.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bone-muted">
              Cinematic video for brands, weddings, and stories worth telling. Book a free
              discovery call and let&apos;s talk about your project.
            </p>
            <div className="mt-10">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
