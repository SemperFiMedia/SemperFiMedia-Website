import Link from 'next/link';
import { DataLabel } from '@/components/primitives/data-label';
import { BlogPostCard } from '@/components/blog/post-card';
import { getBlogPostsByCategory } from '@/sanity/queries';
import { BLOG_CATEGORIES, blogCategoryHref } from '@/lib/blog-categories';
import type { BlogCategory } from '@/sanity/types';

/**
 * "From The Field Notes": the three newest posts in a category, shown on that
 * category's service page. Renders nothing until the category has a post.
 */
export async function FieldNotes({ category }: { category: BlogCategory }) {
  const posts = await getBlogPostsByCategory(category, 3);
  if (posts.length === 0) return null;
  return (
    <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <DataLabel className="mb-4">FROM THE FIELD NOTES</DataLabel>
        <h2 className="mb-10 font-serif text-3xl italic leading-tight md:text-4xl">
          Read before you book.
        </h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
        <Link
          href={blogCategoryHref(category)}
          className="mt-10 inline-flex text-sm font-medium uppercase tracking-wider text-brass transition-colors hover:text-golden-hour"
        >
          All {BLOG_CATEGORIES[category].name.toLowerCase()} guides →
        </Link>
      </div>
    </section>
  );
}
