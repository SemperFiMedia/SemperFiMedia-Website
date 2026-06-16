# Reel Recon Movie Reviews — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone "Reel Recon" movie-review section (Sanity content type + `/reel-recon` routes + nav + sitemap + SEO structured data), independent of the existing `/blog`.

**Architecture:** A new Sanity document type `reelReconReview` powers an index page and a dynamic detail page that mirror the existing `/blog` patterns. Pure, testable logic (status detection, score formatting, JSON-LD) lives in `src/lib/reel-recon.ts`; presentation lives in route files and a `RatingPanel` component. Reviewed films emit schema.org `Review` (star rich-results); anticipated films emit `Article`.

**Tech Stack:** Next.js 16.2.3 (App Router, async `params`), React 19, Sanity (`next-sanity`), Tailwind 4, Vitest 4 + Testing Library (harness scaffolded but no config/tests exist yet — Task 1 sets it up).

**Spec:** `docs/superpowers/specs/2026-06-15-reel-recon-movie-reviews-design.md`

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `vitest.config.ts` | Vitest config (jsdom, `@` alias) — none exists yet | Create |
| `src/sanity/types.ts` | Add `ReelReconStatus`, `ReelReconSubRatings`, `ReelReconReview` | Modify |
| `src/lib/reel-recon.ts` | Pure helpers: labels, `isReviewed`, `formatScore`, `buildReelReconJsonLd` | Create |
| `src/lib/reel-recon.test.ts` | Unit tests for the helpers | Create |
| `src/sanity/schemas/reel-recon-review.ts` | Sanity document schema | Create |
| `src/sanity/schemas/reel-recon-review.test.ts` | Structural test for the schema | Create |
| `src/sanity/schemas/index.ts` | Register the new schema | Modify |
| `src/sanity/queries.ts` | GROQ queries for reviews | Modify |
| `src/components/reel-recon/rating-panel.tsx` | Rating panel (reviewed vs pending) | Create |
| `src/components/reel-recon/rating-panel.test.tsx` | Component render test | Create |
| `src/components/reel-recon/portable-components.tsx` | Portable Text render config for review bodies | Create |
| `src/app/reel-recon/[slug]/page.tsx` | Review detail route | Create |
| `src/app/reel-recon/page.tsx` | Review index route | Create |
| `src/components/nav/nav.tsx` | Add desktop nav link | Modify |
| `src/components/nav/nav-drawer.tsx` | Add mobile drawer link | Modify |
| `src/app/sitemap.ts` | Add `/reel-recon` + per-review URLs | Modify |

---

## Task 1: Test harness setup (Vitest config)

The repo lists Vitest + Testing Library in `devDependencies` and a `"test": "vitest run"` script, but has **no config and no tests**. Vitest needs a config for the `@/` alias and jsdom. This task creates it and proves the harness runs.

**Files:**
- Create: `vitest.config.ts`
- Create (temporary): `src/lib/__harness_check__.test.ts`

- [ ] **Step 1: Create the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

- [ ] **Step 2: Write a temporary smoke test**

Create `src/lib/__harness_check__.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('test harness', () => {
  it('runs and resolves the @ alias environment', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 3: Run it**

Run: `npm test`
Expected: PASS — 1 passed (1 test). If it errors on config, fix `vitest.config.ts` before continuing.

- [ ] **Step 4: Delete the smoke test**

Delete `src/lib/__harness_check__.test.ts` (it has served its purpose).

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts
git commit -m "test: add vitest config (jsdom + @ alias)"
```

---

## Task 2: Add Reel Recon types

**Files:**
- Modify: `src/sanity/types.ts` (append at end of file)

- [ ] **Step 1: Append the types**

Add to the end of `src/sanity/types.ts`:

```ts
export type ReelReconStatus = 'anticipated' | 'reviewed';

export type ReelReconSubRatings = {
  cinematography?: number;
  actionRealism?: number;
  story?: number;
  sound?: number;
};

export type ReelReconReview = {
  _id: string;
  filmTitle: string;
  slug: { current: string };
  status: ReelReconStatus;
  poster?: { asset: { _ref: string } };
  coverImage?: { asset: { _ref: string } };
  releaseDate?: string;
  runtime?: number;
  director?: string;
  genres?: string[];
  whereToWatch?: string;
  overallRating?: number;
  subRatings?: ReelReconSubRatings;
  verdict?: string;
  excerpt?: string;
  body?: unknown;
  publishedAt: string;
  featured?: boolean;
  author?: string;
  authorTitle?: string;
  readingTime?: number;
  seoTitle?: string;
  seoDescription?: string;
};
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/sanity/types.ts
git commit -m "feat: add ReelReconReview types"
```

---

## Task 3: Pure helpers (TDD)

**Files:**
- Create: `src/lib/reel-recon.ts`
- Test: `src/lib/reel-recon.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/reel-recon.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import {
  SUB_RATING_LABELS,
  isReviewed,
  formatScore,
  buildReelReconJsonLd,
} from './reel-recon';
import type { ReelReconReview } from '@/sanity/types';

const base: ReelReconReview = {
  _id: 'r1',
  filmTitle: 'Test Film',
  slug: { current: 'test-film' },
  status: 'reviewed',
  overallRating: 8,
  director: 'Jane Doe',
  excerpt: 'A short take.',
  publishedAt: '2026-06-15T00:00:00.000Z',
};

describe('SUB_RATING_LABELS', () => {
  it('lists the four craft scores in display order', () => {
    expect(SUB_RATING_LABELS.map((s) => s.key)).toEqual([
      'cinematography',
      'actionRealism',
      'story',
      'sound',
    ]);
  });
});

describe('isReviewed', () => {
  it('is true when reviewed with a numeric overall score', () => {
    expect(isReviewed({ status: 'reviewed', overallRating: 8 })).toBe(true);
  });
  it('is false when anticipated', () => {
    expect(isReviewed({ status: 'anticipated', overallRating: undefined })).toBe(false);
  });
  it('is false when reviewed but no score yet', () => {
    expect(isReviewed({ status: 'reviewed', overallRating: undefined })).toBe(false);
  });
});

describe('formatScore', () => {
  it('renders integers without decimals', () => {
    expect(formatScore(8)).toBe('8');
  });
  it('renders one decimal for fractional scores', () => {
    expect(formatScore(8.5)).toBe('8.5');
  });
  it('renders an em dash for missing scores', () => {
    expect(formatScore(undefined)).toBe('—');
  });
});

describe('buildReelReconJsonLd', () => {
  it('emits a Review with reviewRating when reviewed', () => {
    const ld = buildReelReconJsonLd(base, 'https://example.com') as Record<string, unknown>;
    expect(ld['@type']).toBe('Review');
    expect((ld.reviewRating as Record<string, unknown>).ratingValue).toBe(8);
    expect((ld.reviewRating as Record<string, unknown>).bestRating).toBe(10);
    expect((ld.itemReviewed as Record<string, unknown>)['@type']).toBe('Movie');
    expect(ld.url).toBe('https://example.com/reel-recon/test-film');
  });
  it('emits an Article with no rating when anticipated', () => {
    const anticipated: ReelReconReview = {
      ...base,
      status: 'anticipated',
      overallRating: undefined,
    };
    const ld = buildReelReconJsonLd(anticipated, 'https://example.com') as Record<string, unknown>;
    expect(ld['@type']).toBe('Article');
    expect(ld.reviewRating).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/lib/reel-recon.test.ts`
Expected: FAIL — cannot resolve module `./reel-recon` / functions not defined.

- [ ] **Step 3: Implement the helpers**

Create `src/lib/reel-recon.ts`:

```ts
import type { ReelReconReview, ReelReconSubRatings } from '@/sanity/types';

export const SUB_RATING_LABELS: { key: keyof ReelReconSubRatings; label: string }[] = [
  { key: 'cinematography', label: 'Cinematography' },
  { key: 'actionRealism', label: 'Action / Realism' },
  { key: 'story', label: 'Story' },
  { key: 'sound', label: 'Sound' },
];

export function isReviewed(
  review: Pick<ReelReconReview, 'status' | 'overallRating'>,
): boolean {
  return review.status === 'reviewed' && typeof review.overallRating === 'number';
}

export function formatScore(value: number | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

export function buildReelReconJsonLd(
  review: ReelReconReview,
  siteUrl: string,
): Record<string, unknown> {
  const url = `${siteUrl}/reel-recon/${review.slug.current}`;
  const author = { '@type': 'Person', name: review.author ?? 'TJ Gutierrez' };
  const publisher = { '@type': 'Organization', name: 'Semper Fi Media', url: siteUrl };

  if (isReviewed(review)) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      name: review.seoTitle || `${review.filmTitle} — Reel Recon Review`,
      itemReviewed: {
        '@type': 'Movie',
        name: review.filmTitle,
        ...(review.director
          ? { director: { '@type': 'Person', name: review.director } }
          : {}),
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.overallRating,
        bestRating: 10,
        worstRating: 1,
      },
      author,
      publisher,
      datePublished: review.publishedAt,
      ...(review.excerpt ? { reviewBody: review.excerpt } : {}),
      url,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: review.seoTitle || review.filmTitle,
    description: review.excerpt,
    datePublished: review.publishedAt,
    author,
    publisher,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/lib/reel-recon.test.ts`
Expected: PASS — all tests green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/reel-recon.ts src/lib/reel-recon.test.ts
git commit -m "feat: add reel-recon helpers (status, score, json-ld)"
```

---

## Task 4: Sanity schema

**Files:**
- Create: `src/sanity/schemas/reel-recon-review.ts`
- Test: `src/sanity/schemas/reel-recon-review.test.ts`
- Modify: `src/sanity/schemas/index.ts`

- [ ] **Step 1: Write the failing structural test**

Create `src/sanity/schemas/reel-recon-review.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { reelReconReview } from './reel-recon-review';

describe('reelReconReview schema', () => {
  it('is a document type named reelReconReview', () => {
    expect(reelReconReview.name).toBe('reelReconReview');
    expect(reelReconReview.type).toBe('document');
  });
  it('defines the core fields', () => {
    const fieldNames = (reelReconReview.fields as { name: string }[]).map((f) => f.name);
    for (const name of [
      'filmTitle',
      'slug',
      'status',
      'poster',
      'overallRating',
      'subRatings',
      'verdict',
      'body',
      'publishedAt',
    ]) {
      expect(fieldNames).toContain(name);
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/sanity/schemas/reel-recon-review.test.ts`
Expected: FAIL — cannot resolve `./reel-recon-review`.

- [ ] **Step 3: Create the schema**

Create `src/sanity/schemas/reel-recon-review.ts`:

```ts
import { defineType, defineField } from 'sanity';
import { portableTextBlock } from './portable-text';

export const reelReconReview = defineType({
  name: 'reelReconReview',
  title: 'Reel Recon Review',
  type: 'document',
  fields: [
    defineField({ name: 'filmTitle', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'filmTitle', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      type: 'string',
      initialValue: 'anticipated',
      options: {
        layout: 'radio',
        list: [
          { title: 'Anticipated (not yet reviewed)', value: 'anticipated' },
          { title: 'Reviewed (full rating live)', value: 'reviewed' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'poster',
      title: 'Film Poster (portrait)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image (landscape, optional — falls back to poster)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'releaseDate', type: 'date' }),
    defineField({ name: 'runtime', title: 'Runtime (minutes)', type: 'number' }),
    defineField({ name: 'director', type: 'string' }),
    defineField({ name: 'genres', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'whereToWatch',
      title: 'Where to Watch',
      type: 'string',
      description: 'e.g. "In theaters", "Disney+", "Netflix".',
    }),
    defineField({
      name: 'overallRating',
      title: 'Overall Rating (0–10)',
      type: 'number',
      description: 'Leave blank while status is Anticipated.',
      validation: (r) => r.min(0).max(10),
    }),
    defineField({
      name: 'subRatings',
      title: 'Craft Sub-Ratings (0–10)',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'cinematography',
          type: 'number',
          validation: (r) => r.min(0).max(10),
        }),
        defineField({
          name: 'actionRealism',
          title: 'Action / Realism',
          type: 'number',
          validation: (r) => r.min(0).max(10),
        }),
        defineField({ name: 'story', type: 'number', validation: (r) => r.min(0).max(10) }),
        defineField({ name: 'sound', type: 'number', validation: (r) => r.min(0).max(10) }),
      ],
    }),
    defineField({
      name: 'verdict',
      type: 'string',
      description: 'One punchy line. While Anticipated, use "Pending — full review on release."',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'Renders on the index and as the meta description.',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [portableTextBlock, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'publishedAt', type: 'datetime', validation: (r) => r.required() }),
    defineField({
      name: 'featured',
      type: 'boolean',
      initialValue: false,
      description: 'Pin to the top of the Reel Recon index.',
    }),
    defineField({ name: 'author', type: 'string', initialValue: 'TJ Gutierrez' }),
    defineField({
      name: 'authorTitle',
      type: 'string',
      initialValue: 'Founder · Marine Cinematographer',
    }),
    defineField({
      name: 'readingTime',
      type: 'number',
      description: 'Approximate reading time in minutes.',
    }),
    defineField({
      name: 'seoTitle',
      type: 'string',
      description: 'Override for the tab title and Google result. Blank uses film title.',
    }),
    defineField({
      name: 'seoDescription',
      type: 'text',
      rows: 2,
      description: 'Override for the meta description. Blank uses excerpt.',
    }),
  ],
});
```

- [ ] **Step 4: Register the schema**

Modify `src/sanity/schemas/index.ts` to:

```ts
import { caseStudy } from './case-study';
import { blogPost } from './blog-post';
import { reelReconReview } from './reel-recon-review';
import { testimonial } from './testimonial';
import { client } from './client';

export const schemaTypes = [caseStudy, blogPost, reelReconReview, testimonial, client];
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/sanity/schemas/reel-recon-review.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/sanity/schemas/reel-recon-review.ts src/sanity/schemas/reel-recon-review.test.ts src/sanity/schemas/index.ts
git commit -m "feat: add reelReconReview Sanity schema"
```

---

## Task 5: GROQ queries

**Files:**
- Modify: `src/sanity/queries.ts`

- [ ] **Step 1: Update the type import**

In `src/sanity/queries.ts`, change the existing types import (line 4) to add `ReelReconReview`:

```ts
import type { CaseStudy, Testimonial, Client, BlogPost, ReelReconReview } from './types';
```

- [ ] **Step 2: Append the queries**

Add to the end of `src/sanity/queries.ts`:

```ts
export async function getAllReelReconReviews(): Promise<ReelReconReview[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    groq`*[_type == "reelReconReview" && defined(publishedAt)] | order(featured desc, publishedAt desc){
      _id, filmTitle, slug, status, poster, coverImage, releaseDate, runtime, director, genres,
      whereToWatch, overallRating, subRatings, verdict, excerpt, publishedAt, featured, readingTime
    }`,
  );
}

export async function getReelReconReviewBySlug(slug: string): Promise<ReelReconReview | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch(
    groq`*[_type == "reelReconReview" && slug.current == $slug][0]{
      _id, filmTitle, slug, status, poster, coverImage, releaseDate, runtime, director, genres,
      whereToWatch, overallRating, subRatings, verdict, excerpt, body, publishedAt, featured,
      author, authorTitle, readingTime, seoTitle, seoDescription
    }`,
    { slug },
  );
}

export async function getRelatedReelReconReviews(
  excludeSlug: string,
  limit = 3,
): Promise<ReelReconReview[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    groq`*[_type == "reelReconReview" && slug.current != $excludeSlug && defined(publishedAt)]
      | order(publishedAt desc)[0...$limit]{
      _id, filmTitle, slug, status, poster, coverImage, overallRating, verdict, excerpt, publishedAt
    }`,
    { excludeSlug, limit },
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/queries.ts
git commit -m "feat: add reel-recon GROQ queries"
```

---

## Task 6: RatingPanel component (TDD)

**Files:**
- Create: `src/components/reel-recon/rating-panel.tsx`
- Test: `src/components/reel-recon/rating-panel.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/reel-recon/rating-panel.test.tsx`:

```tsx
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { RatingPanel } from './rating-panel';
import type { ReelReconReview } from '@/sanity/types';

afterEach(cleanup);

const reviewed: ReelReconReview = {
  _id: 'r1',
  filmTitle: 'Test Film',
  slug: { current: 'test-film' },
  status: 'reviewed',
  overallRating: 8.5,
  subRatings: { cinematography: 9, actionRealism: 8, story: 7, sound: 8 },
  verdict: 'Sharp and relentless.',
  publishedAt: '2026-06-15T00:00:00.000Z',
};

describe('RatingPanel', () => {
  it('shows the overall score and verdict when reviewed', () => {
    render(<RatingPanel review={reviewed} />);
    expect(screen.getByText('8.5')).toBeTruthy();
    expect(screen.getByText('Sharp and relentless.')).toBeTruthy();
    expect(screen.getByText('Cinematography')).toBeTruthy();
  });

  it('shows a pending state when anticipated', () => {
    const anticipated: ReelReconReview = {
      ...reviewed,
      status: 'anticipated',
      overallRating: undefined,
      subRatings: undefined,
      verdict: 'Pending — full review on release.',
    };
    render(<RatingPanel review={anticipated} />);
    expect(screen.getByText(/rating pending/i)).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/reel-recon/rating-panel.test.tsx`
Expected: FAIL — cannot resolve `./rating-panel`.

- [ ] **Step 3: Implement the component**

Create `src/components/reel-recon/rating-panel.tsx`:

```tsx
import { DataLabel } from '@/components/primitives/data-label';
import { SUB_RATING_LABELS, formatScore, isReviewed } from '@/lib/reel-recon';
import type { ReelReconReview } from '@/sanity/types';

export function RatingPanel({ review }: { review: ReelReconReview }) {
  if (!isReviewed(review)) {
    return (
      <div className="rounded border border-brass/30 bg-black/40 p-6">
        <DataLabel className="text-brass">Rating Pending</DataLabel>
        <p className="mt-3 text-bone-muted">
          TJ&apos;s full breakdown and score drop once the film is out. Check back after release.
        </p>
      </div>
    );
  }

  const sub = review.subRatings ?? {};

  return (
    <div className="rounded border border-brass/30 bg-black/40 p-6">
      <div className="flex items-end gap-3">
        <span className="font-serif text-6xl italic leading-none text-brass">
          {formatScore(review.overallRating)}
        </span>
        <span className="mb-1 text-lg text-bone-muted">/ 10</span>
      </div>
      {review.verdict && (
        <p className="mt-4 font-serif text-xl italic text-bone">{review.verdict}</p>
      )}
      <ul className="mt-6 space-y-3">
        {SUB_RATING_LABELS.map(({ key, label }) => {
          const value = sub[key];
          if (typeof value !== 'number') return null;
          return (
            <li key={key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-bone-muted">{label}</span>
                <span className="font-medium text-bone">{formatScore(value)}/10</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-bone/10">
                <div
                  className="h-full rounded-full bg-brass"
                  style={{ width: `${Math.max(0, Math.min(10, value)) * 10}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/reel-recon/rating-panel.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/reel-recon/rating-panel.tsx src/components/reel-recon/rating-panel.test.tsx
git commit -m "feat: add RatingPanel component"
```

---

## Task 7: Portable Text components for reviews

Mirrors the blog's inline Portable Text config (same theme styling) as a reusable module for the review body. Self-contained; does not modify the blog.

**Files:**
- Create: `src/components/reel-recon/portable-components.tsx`

- [ ] **Step 1: Create the module**

Create `src/components/reel-recon/portable-components.tsx`:

```tsx
import Image from 'next/image';
import { urlForImage } from '@/sanity/image';

export const reelReconPortableComponents = {
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
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/reel-recon/portable-components.tsx
git commit -m "feat: add reel-recon portable text components"
```

---

## Task 8: Review detail route

**Files:**
- Create: `src/app/reel-recon/[slug]/page.tsx`

- [ ] **Step 1: Create the detail page**

Create `src/app/reel-recon/[slug]/page.tsx`:

```tsx
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
import {
  getReelReconReviewBySlug,
  getAllReelReconReviews,
  getRelatedReelReconReviews,
} from '@/sanity/queries';
import { urlForImage } from '@/sanity/image';
import { buildReelReconJsonLd, formatScore, isReviewed } from '@/lib/reel-recon';
import { env } from '@/lib/env';

type RouteProps = { params: Promise<{ slug: string }> };

export const revalidate = 60;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function generateStaticParams() {
  const reviews = await getAllReelReconReviews();
  return reviews.map((r) => ({ slug: r.slug.current }));
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
  const jsonLd = buildReelReconJsonLd(review, env.siteUrl);

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
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/reel-recon/[slug]/page.tsx
git commit -m "feat: add reel-recon review detail route"
```

---

## Task 9: Review index route

**Files:**
- Create: `src/app/reel-recon/page.tsx`

- [ ] **Step 1: Create the index page**

Create `src/app/reel-recon/page.tsx`:

```tsx
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
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/reel-recon/page.tsx
git commit -m "feat: add reel-recon index route"
```

---

## Task 10: Navigation links

**Files:**
- Modify: `src/components/nav/nav.tsx`
- Modify: `src/components/nav/nav-drawer.tsx`

- [ ] **Step 1: Add the desktop nav link**

In `src/components/nav/nav.tsx`, update the `LINKS` array to insert Reel Recon after Blog:

```ts
const LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/corporate', label: 'Corporate' },
  { href: '/weddings', label: 'Weddings' },
  { href: '/social-reels', label: 'Social' },
  { href: '/blog', label: 'Blog' },
  { href: '/reel-recon', label: 'Reel Recon' },
  { href: '/about', label: 'About' },
] as const;
```

- [ ] **Step 2: Add the mobile drawer link**

In `src/components/nav/nav-drawer.tsx`, in the `SECTIONS` array, add Reel Recon to the `Main` section's `links` (after the `/blog` entry):

```ts
      { href: '/blog', label: 'The Field Notes' },
      { href: '/reel-recon', label: 'Reel Recon — Movie Reviews' },
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/nav/nav.tsx src/components/nav/nav-drawer.tsx
git commit -m "feat: add Reel Recon to site navigation"
```

---

## Task 11: Sitemap

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Import the query**

In `src/app/sitemap.ts`, update the queries import (line 3):

```ts
import { getAllCaseStudies, getAllBlogPosts, getAllReelReconReviews } from '@/sanity/queries';
```

- [ ] **Step 2: Add the static route**

In the `STATIC_ROUTES` array, add `'/reel-recon'` after `'/blog'`:

```ts
  '/blog',
  '/reel-recon',
  '/shoots',
```

- [ ] **Step 3: Fetch and map review URLs**

Update the `Promise.all` destructuring and add review entries. Replace the body of the `sitemap` function's data fetch and return:

```ts
  const [cases, posts, reviews] = await Promise.all([
    getAllCaseStudies().then((cs) => cs.filter((c) => !c.isPlaceholder)),
    getAllBlogPosts(),
    getAllReelReconReviews(),
  ]);
```

Then add this entries block alongside `blogEntries` (before the `return`):

```ts
  const reelReconEntries = reviews.map((review) => ({
    url: `${env.siteUrl}/reel-recon/${review.slug.current}`,
    lastModified: review.publishedAt ? new Date(review.publishedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
```

And update the final return to include them:

```ts
  return [...staticEntries, ...spanishEntries, ...caseEntries, ...blogEntries, ...reelReconEntries];
```

- [ ] **Step 4: Typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add reel-recon URLs to sitemap"
```

---

## Task 12: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS — all reel-recon unit/component tests green, no failures.

- [ ] **Step 2: Typecheck the whole project**

Run: `npm run typecheck`
Expected: PASS (no errors).

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: Build succeeds. `/reel-recon` and `/reel-recon/[slug]` appear in the route output. With no Sanity content locally, the index renders the empty-state and `generateStaticParams` yields no slugs — this is expected and must not error.

- [ ] **Step 4: Manual smoke (dev server)**

Run: `npm run dev`, then open `http://localhost:3000/reel-recon`.
Expected: Index page renders with the hero copy and empty-state (or seeded content if Studio has a doc). Nav shows the "Reel Recon" link. No console errors.

- [ ] **Step 5: Commit (only if Steps 1–4 surfaced fixes)**

```bash
git add -A
git commit -m "fix: address reel-recon verification findings"
```

---

## Task 13: Author the launch review in Sanity Studio (manual)

This is a content step, not code. Done in Sanity Studio at `/studio` once deployed (or via `npx sanity` locally). The page code already handles both empty and populated states.

- [ ] **Step 1: Create the document**

In Studio, create a new **Reel Recon Review** with the verified metadata for *The Punisher: One Last Kill*:
- `filmTitle`: "The Punisher: One Last Kill"
- `status`: **Reviewed**
- `whereToWatch`: "Disney+"
- `director`: "Reinaldo Marcus Green"
- `genres`: ["Action", "Crime", "Superhero"]
- `releaseDate`: (the confirmed 2026 Disney+ date)
- `poster`: upload the official poster
- `publishedAt`: now
- `featured`: true

- [ ] **Step 2: Add TJ's real scores**

Fill `overallRating` and `subRatings` (Cinematography, Action / Realism, Story, Sound) and `verdict` from **TJ's actual viewing**. Do not invent these.

- [ ] **Step 3: Body copy**

Claude drafts the ~600–900 word body in TJ's voice from TJ's notes; mark any unverified specifics with a `[TJ: confirm]` placeholder for him to resolve before publishing. (Tracked separately from this build per the spec.)

- [ ] **Step 4: Verify live**

Visit `/reel-recon` and `/reel-recon/the-punisher-one-last-kill`. Confirm the score, sub-score bars, verdict, and body render, and that the page source contains a `Review` JSON-LD block with `reviewRating`.

---

## Self-Review Notes

- **Spec coverage:** schema (Task 4), routes (Tasks 8–9), nav (Task 10), status-aware SEO/JSON-LD (Task 3 + 8), sitemap (Task 11), launch content (Task 13). Comments/auth correctly excluded.
- **Type consistency:** `ReelReconReview`, `isReviewed`, `formatScore`, `buildReelReconJsonLd`, `SUB_RATING_LABELS`, `RatingPanel`, `reelReconPortableComponents` are defined once and referenced with identical names throughout.
- **No placeholders:** every code step contains complete code; the only intentional `[TJ: confirm]` markers live in the manual content task, by design.
