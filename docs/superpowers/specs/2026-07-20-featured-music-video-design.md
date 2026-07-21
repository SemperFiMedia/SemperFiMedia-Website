# Featured Music Video — Homepage Section

**Date:** 2026-07-20
**Status:** Approved (design)
**Branch:** `feat/featured-music-video`

## Goal

Debut Cole's music video "Cut Up" as the featured/main music video on the Semper Fi
Media homepage. Keep the existing showreel hero untouched; add a dedicated section
that showcases the film and converts the emotional hook into the $3,000 music-video
service.

## Source assets

Folder: `I:\Business Drive\Small Businesses\Cole\Cut Up Music Video\`

- **`Cole - Cut Up (Final Color Render).mov`** (308 MB) — the final render to publish.
- Color-graded stills (`Still 2026-06-05 …jpg`) — poster-frame candidates.
- Vertical cuts, album audio, BTS/Pics — not used in this feature.
- YouTube reference: `https://youtu.be/9TX9YD7rgyQ` (ID `9TX9YD7rgyQ`) — not embedded;
  Mux is the delivery path.

## Decisions

- **Placement:** New homepage section, inserted **after `FeaturedWork`** (the case-study
  grid) and **before `DualFunnel`**. Flow: hero → work grid → featured film → funnel.
- **Delivery:** **Mux** (self-hosted), matching the site's hero and case studies. Chosen
  over YouTube embed because page-load speed is effectively a tie (both defer until in
  view), while Mux stays on-brand (brass player, no YouTube logo, no suggested videos on
  end) and tracks play/progress analytics.
- **Data source:** **Hardcoded** playback ID + poster in the component. Single featured
  film; no Sanity modeling needed now. Easy to migrate to Sanity later if desired.
- **Playback behavior:** Click-to-play (NOT autoplay) — the video has sound. Poster frame
  shown before play so the section looks intentional. 16:9 aspect, brass accent
  (`#D4A057`), lazy-mounted like the other `CinematicVideo` instances.

## Copy (SEO-optimized)

- **Eyebrow:** `FEATURED FILM · MUSIC VIDEO`
- **Title:** Cole — "Cut Up"
- **Description:** "The latest music video from Dallas artist **Cole**, "Cut Up" — shot,
  edited, and color-graded in-house by Semper Fi Media. This is what a $3,000 single-day
  music video shoot delivers."
- **CTA:** "See music video work →" → `/corporate/music-videos`

## Components

### `FeaturedMusicVideo` (`src/components/home/featured-music-video.tsx`)

- Server component (static content). Renders section chrome: eyebrow (`DataLabel`),
  title, description, the `CinematicVideo` player, and the `BrassButton` CTA.
- Reuses existing primitives: `DataLabel`, `BrassButton`, `CinematicVideo`.
- Props: none required for v1 (hardcoded). Playback ID and poster live as module
  constants so a future swap is a one-line edit.
- Wrapped in `<Reveal>` on the homepage for the scroll-in animation, consistent with
  sibling sections.

### Structured data (`VideoObject` JSON-LD)

- Add a `VideoObjectJsonLd` helper to `src/components/seo/structured-data.tsx`
  (alongside the existing `ServiceJsonLd` / `BreadcrumbJsonLd`).
- Fields: `name` ("Cut Up"), `description`, `thumbnailUrl` (Mux thumbnail or uploaded
  still), `uploadDate`, `contentUrl`/`embedUrl` as applicable, `duration` (ISO 8601 if
  known). Makes the video eligible for Google video rich results.

## Data flow

1. Mux upload script (one-time, local) uploads the `.mov` via the Mux REST API using
   `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` from `.env.local`:
   - `POST /video/v1/uploads` → signed upload URL
   - `PUT` file to signed URL
   - poll `GET /video/v1/assets/{id}` until `status: ready` → capture **playback ID**
     and asset **duration**.
2. Poster: use Mux's generated thumbnail (`https://image.mux.com/{playbackId}/thumbnail.webp`)
   OR upload one color-graded still. Decide at build time based on which looks better.
3. Playback ID + poster + duration are hardcoded into `FeaturedMusicVideo` and the
   JSON-LD.

## Rendering / integration

- `src/app/page.tsx`: import `FeaturedMusicVideo`, render it inside `<Reveal>` between
  the `FeaturedWork` block and `DualFunnel`.
- No new Sanity queries, env vars, or routes.

## Testing

- Component render test (Vitest + RTL) mirroring existing `home/` component tests:
  asserts eyebrow, title, description, CTA href (`/corporate/music-videos`), and that the
  `CinematicVideo` receives the hardcoded playback ID.
- Manual: run the site locally, confirm the section appears after the work grid, poster
  shows before play, click-to-play works with sound, CTA links correctly, and JSON-LD
  validates (Google Rich Results Test).

## Out of scope (YAGNI)

- Sanity modeling / CMS-managed featured video.
- Using the vertical cuts, BTS, or album audio.
- Autoplay / muted-loop behavior (this is a click-to-play film with sound).
- Changing the existing homepage hero showreel.
