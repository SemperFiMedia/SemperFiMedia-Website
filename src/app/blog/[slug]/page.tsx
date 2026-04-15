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
import { getBlogPostBySlug, getAllBlogPosts, getRelatedBlogPosts } from '@/sanity/queries';
import { urlForImage } from '@/sanity/image';
import { env } from '@/lib/env';
import type { BlogCategory } from '@/sanity/types';

type RouteProps = { params: Promise<{ slug: string }> };

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  gear: 'GEAR & CAMERAS',
  weddings: 'WEDDING GUIDES',
  bts: 'BEHIND THE SCENES',
  industry: 'INDUSTRY & CRAFT',
  'how-to': 'HOW-TO',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const builder = post.coverImage ? urlForImage(post.coverImage) : null;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: builder ? [builder.width(1200).height(630).url()] : [],
    },
  };
}

const portableComponents = {
  types: {
    image: ({ value }: { value: { asset?: { _ref: string }; alt?: string } }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value)?.width(1600).url();
      if (!url) return null;
      return (
        <figure className="my-10">
          <div className="relative aspect-video w-full overflow-hidden rounded">
            <Image
              src={url}
              alt={value.alt ?? ''}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
            />
          </div>
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-12 mb-4 font-serif text-3xl italic leading-tight">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-10 mb-3 font-serif text-2xl italic">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-8 border-l-2 border-brass pl-6 font-serif text-xl italic text-bone">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 leading-relaxed text-bone-muted">{children}</p>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children?: React.ReactNode;
      value?: { href?: string };
    }) => (
      <a
        href={value?.href}
        className="text-brass underline hover:text-golden-hour"
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-5 list-disc space-y-2 pl-6 text-bone-muted">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-6 text-bone-muted">{children}</ol>
    ),
  },
};

export default async function BlogPostPage({ params }: RouteProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(post.category, slug, 3);
  const body = Array.isArray(post.body) ? (post.body as PortableTextBlock[]) : null;
  const coverBuilder = post.coverImage ? urlForImage(post.coverImage) : null;
  const coverUrl = coverBuilder ? coverBuilder.width(2000).url() : null;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author ?? 'TJ Gutierrez',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Semper Fi Media',
      url: env.siteUrl,
    },
    image: coverUrl ? [coverUrl] : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${env.siteUrl}/blog/${post.slug.current}`,
    },
  };

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main>
        <article>
          <header className="bg-black px-6 pt-28 pb-10 md:px-12 md:pt-36">
            <div className="mx-auto max-w-[900px]">
              <DataLabel className="mb-5">
                {CATEGORY_LABELS[post.category]} · {formatDate(post.publishedAt)}
                {post.readingTime ? ` · ${post.readingTime} min read` : ''}
              </DataLabel>
              <h1 className="font-serif text-4xl italic leading-[1.05] md:text-6xl">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-6 text-lg leading-relaxed text-bone-muted md:text-xl">
                  {post.excerpt}
                </p>
              )}
              <div className="mt-8 border-t border-bone/10 pt-5">
                <div className="font-medium text-bone">{post.author ?? 'TJ Gutierrez'}</div>
                {post.authorTitle && (
                  <div className="text-sm text-bone-muted">{post.authorTitle}</div>
                )}
              </div>
            </div>
          </header>

          {coverUrl && (
            <section className="px-6 pb-10 md:px-12">
              <div className="mx-auto max-w-[1200px]">
                <div className="relative aspect-video w-full overflow-hidden rounded">
                  <Image
                    src={coverUrl}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1200px) 1200px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </section>
          )}

          {body && (
            <section className="bg-gunpowder px-6 py-16 md:px-12 md:py-24">
              <div className="mx-auto max-w-[720px] text-lg">
                <PortableText value={body} components={portableComponents} />
              </div>
            </section>
          )}
        </article>

        {related.length > 0 && (
          <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-24">
            <div className="mx-auto max-w-[1200px]">
              <DataLabel className="mb-8">KEEP READING</DataLabel>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {related.map((r) => (
                  <Link key={r._id} href={`/blog/${r.slug.current}`} className="group flex flex-col">
                    {r.coverImage ? (
                      <div className="relative aspect-video overflow-hidden rounded">
                        <Image
                          src={urlForImage(r.coverImage)?.width(600).height(338).url() ?? ''}
                          alt={r.title}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video rounded bg-gradient-to-br from-dusk-teal to-texas-umber" />
                    )}
                    <DataLabel tone="muted" className="mt-3 text-[10px]">
                      {CATEGORY_LABELS[r.category]} · {formatDate(r.publishedAt)}
                    </DataLabel>
                    <h3 className="mt-2 font-serif text-lg italic transition-colors group-hover:text-brass">
                      {r.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              Like the craft? Hire the craft.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bone-muted">
              Gear reviews are nice. Real cinematic work is better. Book a free discovery call
              and let&apos;s talk about your film.
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
