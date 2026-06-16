# Reel Recon — Movie Reviews Blog (Design Spec)

**Date:** 2026-06-15
**Status:** Approved design — ready for implementation plan
**Author:** TJ Gutierrez / Semper Fi Media (designed with Claude Code)

## Summary

A new, standalone movie-review content series called **Reel Recon** — TJ Gutierrez
(founder, former Marine, cinematographer) rating films through a craft-and-realism
lens. It is intentionally **separate** from the existing cinematography `/blog` so the
two feeds never mix. Goal: recurring, opinionated, SEO-friendly content that drives
organic film-related search traffic to the domain.

The launch post is a **full review** (`status = reviewed`) of *The Punisher: One Last Kill*
— a Marvel Television Special that released on Disney+ in 2026 — with TJ's real scores and
verdict live from day one. *Spider-Man: Brand New Day* becomes a later `anticipated` post.

**Out of scope for this project** (deferred to a separate design cycle): the discussion /
comments system, Google sign-in, user accounts, and any database. This project is
Sanity + Next.js pages only — no auth, no DB.

## Goals

- Ship a distinct Reel Recon section live quickly to start capturing film search traffic.
- Establish a reusable review content type with a signature rating system.
- Show off TJ's Marine-cinematographer expertise as the differentiator.
- Emit correct SEO structured data (star rich-results for full reviews; article markup
  for pre-release anticipation posts — never fake ratings).

## Non-Goals

- Comments, discussion threads, Google/OAuth login, user accounts (separate project).
- Any database or persistent user-write storage.
- Automated movie metadata fetching (TMDB/IMDb API). Metadata is entered manually.
- Refactoring the existing `/blog`. Reel Recon is additive and independent.

## Architecture Decision

**Chosen:** A brand-new Sanity document type (`reelReconReview`) with its own route tree
at `/reel-recon`, mirroring the existing `/blog` + `/blog/[slug]` patterns.

**Rejected alternatives:**
- *Add a category + rating fields to existing `blogPost`* — mixes movie reviews into the
  cinematography feed and bloats one schema with fields that apply only half the time.
  The user explicitly wants the series separate.
- *Third-party embed (Letterboxd, etc.)* — provides no SEO value to the owned domain,
  defeating the purpose.

## Components

### 1. Sanity schema: `reelReconReview`

New file `src/sanity/schemas/reel-recon-review.ts`, registered in
`src/sanity/schemas/index.ts`. Fields:

| Field | Type | Notes |
|---|---|---|
| `filmTitle` | string (required) | e.g. "Spider-Man: Brand New Day" |
| `slug` | slug (required) | auto-generated from `filmTitle` |
| `status` | string enum (required) | `anticipated` \| `reviewed` |
| `poster` | image (hotspot) | manually uploaded film poster (editorial/commentary) |
| `releaseDate` | date | |
| `runtime` | number | minutes |
| `director` | string | |
| `genres` | array of string | |
| `whereToWatch` | string | e.g. "In theaters", "Disney+" |
| `overallRating` | number (0–10) | **optional**; blank while `anticipated` |
| `subRatings` | object | each 0–10, optional: `cinematography`, `actionRealism`, `story`, `sound` |
| `verdict` | string | one-line punch; "Pending — full review on release" while anticipated |
| `excerpt` | text | index card + meta description |
| `coverImage` | image (hotspot) | optional; falls back to poster |
| `body` | array | reuses existing `portableTextBlock` + image (shared rich-text) |
| `publishedAt` | datetime (required) | |
| `featured` | boolean (default false) | pins to top of index |
| `author` | string (default "TJ Gutierrez") | |
| `authorTitle` | string (default "Founder · Marine Cinematographer") | |
| `readingTime` | number | optional, minutes |
| `seoTitle` | string | optional SEO override |
| `seoDescription` | text | optional SEO override |

Sub-rating labels (display): **Cinematography, Action/Realism, Story, Sound.**
Scale: **0–10** for the overall score and each sub-score.

Studio note: validation should allow `overallRating`/`subRatings` to be empty when
`status == anticipated`, and prompt for them when `status == reviewed`.

### 2. GROQ queries

Add to `src/sanity/queries.ts`, mirroring the blog query shapes:
- `getAllReelReconReviews()` — `*[_type == "reelReconReview" && defined(publishedAt)] | order(featured desc, publishedAt desc)` returning card fields (incl. `status`, `overallRating`, `poster`).
- `getReelReconReviewBySlug(slug)` — full document incl. `body`, `subRatings`, SEO fields.
- `getRelatedReelReconReviews(excludeSlug, limit=3)` — latest others (optionally same genre later).

Add matching TypeScript types in `src/sanity/types.ts`.

### 3. Routes (Next.js App Router)

- `src/app/reel-recon/page.tsx` — index. Hero for featured/latest review; responsive grid
  of the rest. Each card: poster, film title, score badge **or** an "Anticipated" badge,
  excerpt. ISR revalidate 60s (matches `/blog`).
- `src/app/reel-recon/[slug]/page.tsx` — detail. `generateStaticParams` from all reviews.
  Layout: poster + title/metadata header → **rating panel** → `verdict` → Portable Text
  body → related reviews → existing "Book a Discovery Call" CTA.
  - **Rating panel (reviewed):** large overall score (X/10) + four labeled sub-score bars.
  - **Rating panel (anticipated):** "Rating pending — full review on release" state, no scores.
- Add **"Reel Recon"** to the site navigation.
- Styling reuses the existing Tailwind theme tokens (gunpowder, brass, bone, dusk-teal,
  etc.) and the existing PortableText component set. Visual polish handled during
  implementation via the frontend-design skill.

### 4. SEO / structured data

- **`reviewed`** posts: emit schema.org `Review` JSON-LD with `itemReviewed` of type
  `Movie` and a `reviewRating` (value = `overallRating`, bestRating 10) → eligible for
  Google star rich-results.
- **`anticipated`** posts: emit `Article` JSON-LD only — **no** `reviewRating` (Google
  penalizes ratings for unseen content). Target pre-release search terms.
- Per-page `metadata` from `seoTitle`/`seoDescription` with poster as the OG image.
- Include `/reel-recon` and `/reel-recon/[slug]` URLs in the sitemap.

### 5. Launch content — The Punisher: One Last Kill

Factual grounding (verified via web search, 2026-06-15): Marvel Television Special
Presentation on **Disney+**; Jon Bernthal returns as Frank Castle (also co-writer);
directed by **Reinaldo Marcus Green** (*King Richard*, *Bob Marley: One Love*); cast
includes Jason R. Moore, Judith Light, Chelsea Brea. Ties to the Netflix series / MCU.

- Document: `status = reviewed`, `whereToWatch = "Disney+"`, `releaseDate` set, poster
  uploaded, `director`/`genres`/`runtime` filled from confirmed metadata.
- **Ratings are TJ's** — `overallRating`, the four `subRatings`, and `verdict` come from
  TJ's actual viewing, not invented. Claude drafts prose around the numbers TJ supplies.
- Title (working): **"The Punisher: One Last Kill — A Marine Cinematographer's Verdict."**
- Body (~600–900 words) drafted by Claude in TJ's voice from TJ's notes/scores; TJ edits
  before publishing. Angle: former-Marine + cinematographer read on Bernthal's Frank
  Castle — combat realism/gun handling, how the action is staged and shot, lighting and
  tone, what lands and what doesn't. Tuned for post-release search ("Punisher One Last
  Kill review", etc.).
- **Content-integrity rule:** Claude must not fabricate specific shot/plot details it
  cannot verify. Where TJ hasn't supplied a specific observation, keep prose general or
  flag a `[TJ: confirm]` placeholder for him to fill.

**Future post (not this project):** *Spider-Man: Brand New Day* as an `anticipated`
preview — trailer breakdown, rating pending until release.

## Data Flow

1. TJ (or Claude-drafted) review authored in Sanity Studio (`/studio`).
2. Next.js fetches via GROQ through the existing `src/sanity/client.ts` (CDN, published
   perspective).
3. Index and detail pages render with ISR (60s) / SSG params, same as `/blog`.
4. Structured data + metadata emitted per page based on `status`.

## Error Handling / Edge Cases

- Unknown slug → Next.js `notFound()` (matches blog behavior).
- `anticipated` with stray rating values → UI ignores scores and shows the pending panel;
  JSON-LD stays `Article`.
- Missing `coverImage` → fall back to `poster`; missing both → themed placeholder.
- Empty series (no reviews yet) → index shows an empty-state message rather than erroring.

## Testing

- Follow existing project test setup (Vitest + Playwright).
- Unit: GROQ result → view-model mapping; JSON-LD builder picks `Review` vs `Article`
  by `status`; rating panel renders pending vs scored states.
- E2E (Playwright): `/reel-recon` lists the Spider-Man post with an "Anticipated" badge;
  detail page renders pending panel and body; nav link works.

## Open Items (intentionally deferred)

- Discussion / comments + Google sign-in → separate design + plan + build cycle.
- Optional later: genre-based related reviews; TMDB metadata import; "most anticipated"
  roundup pages.
