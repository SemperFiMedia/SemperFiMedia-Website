import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { getAllReelReconReviews } from '@/sanity/queries';
import { urlForImage } from '@/sanity/image';
import { formatScore, isReviewed } from '@/lib/reel-recon';
import type { ReelReconReview } from '@/sanity/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Reel Recon — Movie Reviews from a Marine Cinematographer | Semper Fi Media',
  description:
    'TJ Gutierrez — former Marine and working cinematographer — rates new films on craft, action realism, story, and sound. Honest movie reviews, scored out of 10.',
};

function ScoreBadge({ review }: { review: ReelReconReview }) {
  if (isReviewed(review)) {
    return (
      <span className="absolute right-3 top-3 rounded bg-brass px-2 py-1 font-serif text-lg italic text-gunpowder">
        {formatScore(review.overallRating)}
      </span>
    );
  }
  return (
    <span className="data-label absolute right-3 top-3 rounded bg-black/70 px-2 py-1 text-[10px] text-brass">
      Anticipated
    </span>
  );
}

export default async function ReelReconIndexPage() {
  const reviews = await getAllReelReconReviews();
  const [hero, ...rest] = reviews;

  return (
    <>
      <Nav />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">Reel Recon</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Movies, rated
              <br />
              by a Marine
              <br />
              behind the lens.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              A former Marine and working cinematographer scouts the new releases — scoring
              craft, action realism, story, and sound out of 10. No fluff. Recon before you
              spend the ticket.
            </p>
          </div>
        </section>

        {reviews.length === 0 ? (
          <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-bone-muted">
                First recon drops soon. Follow us on{' '}
                <a
                  href="https://www.instagram.com/semperfimediallc/"
                  className="text-brass underline"
                >
                  Instagram
                </a>{' '}
                for updates.
              </p>
            </div>
          </section>
        ) : (
          <>
            {hero && (
              <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
                <div className="mx-auto max-w-[1200px]">
                  <DataLabel className="mb-6">Latest</DataLabel>
                  <Link
                    href={`/reel-recon/${hero.slug.current}`}
                    className="group grid grid-cols-1 gap-8 md:grid-cols-[320px_1fr] md:items-center"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded">
                      {hero.poster ? (
                        <Image
                          src={urlForImage(hero.poster)?.width(640).url() ?? ''}
                          alt={hero.filmTitle}
                          fill
                          sizes="(min-width: 768px) 320px, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-dusk-teal to-texas-umber" />
                      )}
                      <ScoreBadge review={hero} />
                    </div>
                    <div>
                      <DataLabel tone="muted" className="text-[11px]">
                        {isReviewed(hero)
                          ? `Reviewed · ${formatScore(hero.overallRating)}/10`
                          : 'Anticipated'}
                      </DataLabel>
                      <h2 className="mt-3 font-serif text-3xl italic leading-tight md:text-5xl">
                        {hero.filmTitle}
                      </h2>
                      {hero.verdict && (
                        <p className="mt-4 font-serif text-xl italic text-brass">
                          {hero.verdict}
                        </p>
                      )}
                      {hero.excerpt && (
                        <p className="mt-4 text-bone-muted leading-relaxed">{hero.excerpt}</p>
                      )}
                      <span className="mt-6 inline-flex text-sm font-medium uppercase tracking-wider text-brass transition-colors group-hover:text-golden-hour">
                        Read the recon →
                      </span>
                    </div>
                  </Link>
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-24">
                <div className="mx-auto max-w-[1440px]">
                  <DataLabel className="mb-10">The Watchlist</DataLabel>
                  <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
                    {rest.map((review) => (
                      <Link
                        key={review._id}
                        href={`/reel-recon/${review.slug.current}`}
                        className="group flex flex-col"
                      >
                        <div className="relative aspect-[2/3] overflow-hidden rounded">
                          {review.poster ? (
                            <Image
                              src={urlForImage(review.poster)?.width(500).url() ?? ''}
                              alt={review.filmTitle}
                              fill
                              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-dusk-teal to-texas-umber" />
                          )}
                          <ScoreBadge review={review} />
                        </div>
                        <h3 className="mt-3 font-serif text-lg italic leading-tight transition-colors group-hover:text-brass">
                          {review.filmTitle}
                        </h3>
                        {review.verdict && (
                          <p className="mt-1 text-sm leading-snug text-bone-muted">
                            {review.verdict}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
