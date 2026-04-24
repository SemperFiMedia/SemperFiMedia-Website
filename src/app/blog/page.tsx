import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { getAllBlogPosts } from '@/sanity/queries';
import { urlForImage } from '@/sanity/image';
import type { BlogCategory } from '@/sanity/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'The Field Notes — Cinema, Gear, and Craft from Semper Fi Media',
  description:
    'Gear reviews, wedding guides, behind-the-scenes notes, and cinematography craft from a Marine-led Dallas production studio. Sony FX3, FX30, ARRI, lighting, lenses, and the work behind the work.',
};

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  gear: 'GEAR & CAMERAS',
  weddings: 'WEDDING GUIDES',
  bts: 'BEHIND THE SCENES',
  industry: 'INDUSTRY & CRAFT',
  'how-to': 'HOW-TO',
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();
  const [hero, ...rest] = posts;

  return (
    <>
      <Nav />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">THE FIELD NOTES</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Cinema, gear,
              <br />
              and the craft
              <br />
              behind the work.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Gear reviews, wedding guides, and the behind-the-scenes notes from Marine-led
              filmmaking in Dallas. Written between shoots, not between meetings.
            </p>
          </div>
        </section>

        {posts.length === 0 ? (
          <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-bone-muted">
                First post coming soon. Follow us on{' '}
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
                  <DataLabel className="mb-6">LATEST</DataLabel>
                  <Link
                    href={`/blog/${hero.slug.current}`}
                    className="group grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center"
                  >
                    {hero.coverImage ? (
                      <div className="relative aspect-video overflow-hidden rounded">
                        <Image
                          src={
                            urlForImage(hero.coverImage)?.width(1200).height(675).url() ?? ''
                          }
                          alt={hero.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded bg-gradient-to-br from-dusk-teal to-texas-umber" />
                    )}
                    <div>
                      <DataLabel tone="muted" className="text-[11px]">
                        {CATEGORY_LABELS[hero.category]} · {formatDate(hero.publishedAt)}
                        {hero.readingTime ? ` · ${hero.readingTime} min read` : ''}
                      </DataLabel>
                      <h2 className="mt-3 font-serif text-3xl italic leading-tight md:text-5xl">
                        {hero.title}
                      </h2>
                      {hero.excerpt && (
                        <p className="mt-5 text-bone-muted leading-relaxed">{hero.excerpt}</p>
                      )}
                      <span className="mt-6 inline-flex text-sm font-medium uppercase tracking-wider text-brass transition-colors group-hover:text-golden-hour">
                        Read the full post →
                      </span>
                    </div>
                  </Link>
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-24">
                <div className="mx-auto max-w-[1440px]">
                  <DataLabel className="mb-10">MORE FIELD NOTES</DataLabel>
                  <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((post) => (
                      <Link
                        key={post._id}
                        href={`/blog/${post.slug.current}`}
                        className="group flex flex-col"
                      >
                        {post.coverImage ? (
                          <div className="relative aspect-video overflow-hidden rounded">
                            <Image
                              src={
                                urlForImage(post.coverImage)?.width(800).height(450).url() ?? ''
                              }
                              alt={post.title}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video rounded bg-gradient-to-br from-dusk-teal to-texas-umber" />
                        )}
                        <DataLabel tone="muted" className="mt-4 text-[10px]">
                          {CATEGORY_LABELS[post.category]} · {formatDate(post.publishedAt)}
                          {post.readingTime ? ` · ${post.readingTime} min` : ''}
                        </DataLabel>
                        <h3 className="mt-2 font-serif text-xl italic leading-tight transition-colors group-hover:text-brass">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-3 text-sm leading-relaxed text-bone-muted">
                            {post.excerpt}
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
