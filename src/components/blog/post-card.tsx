import Link from 'next/link';
import Image from 'next/image';
import { DataLabel } from '@/components/primitives/data-label';
import { urlForImage } from '@/sanity/image';
import { BLOG_CATEGORIES } from '@/lib/blog-categories';
import type { BlogPost } from '@/sanity/types';

export function formatPostDate(iso: string, month: 'short' | 'long' = 'short') {
  return new Date(iso).toLocaleDateString('en-US', { month, day: 'numeric', year: 'numeric' });
}

/** Alt text for a post's cover: the author's, else the post title. Never empty. */
export const coverAlt = (post: Pick<BlogPost, 'title' | 'coverImage'>) =>
  post.coverImage?.alt?.trim() || post.title;

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug.current}`} className="group flex flex-col">
      {post.coverImage ? (
        <div className="relative aspect-video overflow-hidden rounded">
          <Image
            src={urlForImage(post.coverImage)?.width(800).height(450).url() ?? ''}
            alt={coverAlt(post)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-video rounded bg-gradient-to-br from-dusk-teal to-texas-umber" />
      )}
      <DataLabel tone="muted" className="mt-4 text-[10px]">
        {BLOG_CATEGORIES[post.category]?.label} · {formatPostDate(post.publishedAt)}
        {post.readingTime ? ` · ${post.readingTime} min` : ''}
      </DataLabel>
      <h3 className="mt-2 font-serif text-xl italic leading-tight transition-colors group-hover:text-brass">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-3 text-sm leading-relaxed text-bone-muted">{post.excerpt}</p>
      )}
    </Link>
  );
}
