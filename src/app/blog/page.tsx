import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { getAllBlogPosts } from '@/sanity/queries';
import { urlForImage } from '@/sanity/image';
import { BlogPostCard, coverAlt, formatPostDate } from '@/components/blog/post-card';
import { BlogCategoryNav } from '@/components/blog/category-nav';
import { BLOG_CATEGORIES } from '@/lib/blog-categories';

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/blog' },
  title: 'The Field Notes — Cinema, Gear, and Craft from Semper Fi Media',
  description:
    'Gear reviews, wedding guides, behind-the-scenes notes, and cinematography craft from a Marine-led Dallas production studio. Sony FX3, FX30, ARRI, lighting, lenses, and the work behind the work.',
};

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

        <BlogCategoryNav />

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
                          alt={coverAlt(hero)}
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
                        {BLOG_CATEGORIES[hero.category]?.label} · {formatPostDate(hero.publishedAt)}
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
                      <BlogPostCard key={post._id} post={post} />
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
