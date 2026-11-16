import Link from 'next/link';
import { BLOG_CATEGORIES, BLOG_CATEGORY_SLUGS, blogCategoryHref } from '@/lib/blog-categories';
import type { BlogCategory } from '@/sanity/types';

/** Links to all seven category hubs. `current` marks the hub being viewed. */
export function BlogCategoryNav({ current }: { current?: BlogCategory }) {
  return (
    <nav
      aria-label="Blog categories"
      className="border-y border-brass/15 bg-black px-6 py-5 md:px-12"
    >
      <ul className="data-label mx-auto flex max-w-[1200px] flex-wrap gap-x-6 gap-y-3 text-[11px]">
        <li>
          <Link href="/blog" className="text-bone-muted transition-colors hover:text-brass">
            ALL POSTS
          </Link>
        </li>
        {BLOG_CATEGORY_SLUGS.map((slug) => (
          <li key={slug}>
            <Link
              href={blogCategoryHref(slug)}
              aria-current={slug === current ? 'page' : undefined}
              className={
                slug === current
                  ? 'text-brass'
                  : 'text-bone-muted transition-colors hover:text-brass'
              }
            >
              {BLOG_CATEGORIES[slug].label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
