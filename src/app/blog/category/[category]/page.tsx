import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { BreadcrumbJsonLd } from '@/components/seo/structured-data';
import { BlogPostCard } from '@/components/blog/post-card';
import { BlogCategoryNav } from '@/components/blog/category-nav';
import { getBlogPostsByCategory } from '@/sanity/queries';
import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_SLUGS,
  blogCategoryHref,
  isBlogCategory,
} from '@/lib/blog-categories';

type RouteProps = { params: Promise<{ category: string }> };

export const revalidate = 60;
// Only the seven known categories exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { category } = await params;
  if (!isBlogCategory(category)) return { title: 'Not Found' };
  const hub = BLOG_CATEGORIES[category];
  return {
    alternates: { canonical: blogCategoryHref(category) },
    title: hub.metaTitle,
    description: hub.metaDescription,
  };
}

export default async function BlogCategoryPage({ params }: RouteProps) {
  const { category } = await params;
  if (!isBlogCategory(category)) notFound();
  const hub = BLOG_CATEGORIES[category];
  const posts = await getBlogPostsByCategory(category);

  return (
    <>
      <Nav />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'The Field Notes', href: '/blog' },
          { name: hub.h1, href: blogCategoryHref(category) },
        ]}
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-20">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">
              <Link href="/blog" className="hover:text-golden-hour">
                THE FIELD NOTES
              </Link>{' '}
              · {hub.label}
            </DataLabel>
            <h1 className="max-w-4xl font-serif text-4xl italic leading-[1.05] md:text-6xl">
              {hub.h1}
            </h1>
            <div className="mt-8 max-w-2xl space-y-4 text-lg text-bone-muted">
              {hub.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium uppercase tracking-wider">
              {hub.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brass underline underline-offset-4 transition-colors hover:text-golden-hour"
                  >
                    {link.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <BlogCategoryNav current={category} />

        <section className="bg-black px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            {posts.length === 0 ? (
              <p className="mx-auto max-w-2xl text-center text-bone-muted">
                The first guides in this category are being written now. Until they post, the
                pages linked above cover the service itself, or{' '}
                <Link href="/blog" className="text-brass underline">
                  read every Field Note
                </Link>
                .
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogPostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              Done reading? Let&apos;s plan the shoot.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bone-muted">
              Free 30-minute discovery call. Bring the date, the venue and what you need the film
              to do.
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
