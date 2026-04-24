import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { getRecentShoots } from '@/sanity/queries';
import { urlForImage } from '@/sanity/image';
import type { CaseStudyCategory } from '@/sanity/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Recent Shoots — What We\'ve Been Filming | Semper Fi Media',
  description:
    'A live feed of recent Semper Fi Media projects across Dallas–Fort Worth — weddings, quinceañeras, music videos, brand films, and more. Updated as we wrap each shoot.',
};

const CATEGORY_LABELS: Record<CaseStudyCategory, string> = {
  tactical: 'Mission & Tactical',
  faith: 'Faith & Community',
  'small-business': 'Small Business',
  music: 'Music Video',
  wedding: 'Wedding',
  'real-estate': 'Real Estate',
  tv: 'TV / Broadcast',
  events: 'Event',
  convention: 'Convention',
  birthday: 'Birthday Party',
  quinceanera: 'Quinceañera',
  social: 'Social Reel',
};

function formatMonth(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default async function ShootsPage() {
  const shoots = await getRecentShoots(20);

  // Group by month
  const grouped = new Map<string, typeof shoots>();
  for (const cs of shoots) {
    if (!cs.publishedAt) continue;
    const month = formatMonth(cs.publishedAt);
    const arr = grouped.get(month) ?? [];
    arr.push(cs);
    grouped.set(month, arr);
  }

  return (
    <>
      <Nav />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">RECENT SHOOTS · LIVE FEED</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              What we&apos;ve
              <br />
              been filming.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-muted md:text-xl">
              A running timeline of recent Semper Fi Media projects across Dallas–Fort Worth.
              Wraps as soon as we wrap. If you&apos;re a venue, planner, or vendor — this is
              the list to bookmark.
            </p>
          </div>
        </section>

        {grouped.size === 0 ? (
          <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-bone-muted">
                Recent work coming soon.{' '}
                <Link href="/work" className="text-brass underline">
                  See the full archive →
                </Link>
              </p>
            </div>
          </section>
        ) : (
          <section className="bg-black px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto max-w-[1200px]">
              {Array.from(grouped.entries()).map(([month, items]) => (
                <div key={month} className="mb-16 md:mb-24">
                  <DataLabel className="mb-6 text-brass">{month.toUpperCase()}</DataLabel>
                  <div className="space-y-6">
                    {items.map((cs) => {
                      const posterUrl = cs.poster
                        ? urlForImage(cs.poster)?.width(600).height(400).url() ?? null
                        : null;
                      return (
                        <Link
                          key={cs._id}
                          href={`/work/${cs.slug.current}`}
                          className="group grid grid-cols-1 gap-6 border-l border-brass/20 pl-6 transition-colors hover:border-brass md:grid-cols-[200px_1fr] md:items-center md:pl-8"
                        >
                          {posterUrl ? (
                            <div className="relative aspect-[3/2] overflow-hidden rounded">
                              <Image
                                src={posterUrl}
                                alt={cs.title}
                                fill
                                sizes="(min-width: 768px) 200px, 100vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[3/2] rounded bg-gradient-to-br from-dusk-teal to-texas-umber" />
                          )}
                          <div>
                            <DataLabel tone="muted" className="text-[10px]">
                              {CATEGORY_LABELS[cs.category]} · {formatMonth(cs.publishedAt!)}
                            </DataLabel>
                            <h3 className="mt-1 font-serif text-2xl italic leading-tight transition-colors group-hover:text-brass md:text-3xl">
                              {cs.title}
                            </h3>
                            <p className="mt-1 text-sm text-bone-muted">{cs.client}</p>
                            {cs.summary && (
                              <p className="mt-3 text-sm leading-relaxed text-bone-muted line-clamp-2">
                                {cs.summary}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-gradient-to-br from-texas-umber via-golden-hour to-bone px-6 py-20 text-gunpowder md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              Want to be on this list?
            </h2>
            <p className="mt-6 text-lg" style={{ color: '#2a1a08' }}>
              Free 30-min discovery call. Always Faithful.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/work" variant="outline">
                See Full Archive
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
