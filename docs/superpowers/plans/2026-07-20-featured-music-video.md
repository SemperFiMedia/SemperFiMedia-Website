# Featured Music Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Featured Music Video" section to the homepage that showcases Cole's "Cut Up" via a Mux-hosted player, with SEO structured data, converting into the music-video service page.

**Architecture:** Upload the final render to Mux (REST API, local script) to get a playback ID. Build a static server component `FeaturedMusicVideo` that reuses existing primitives (`DataLabel`, `BrassButton`, `CinematicVideo`) and the existing `VideoJsonLd` helper. Insert it into `page.tsx` after the featured-work grid, wrapped in `<Reveal>`.

**Tech Stack:** Next.js (see `AGENTS.md` — read `node_modules/next/dist/docs/` before writing framework code), React server components, Mux (`@mux/mux-player-react` + Mux Video REST API), Vitest + React Testing Library, Tailwind.

---

## File Structure

- **Create** `src/components/home/featured-music-video.tsx` — the section component (static content, hardcoded playback ID + poster + copy).
- **Create** `src/components/home/featured-music-video.test.tsx` — render test.
- **Modify** `src/app/page.tsx` — import and render `FeaturedMusicVideo` between `FeaturedWork` and `DualFunnel`, inside `<Reveal>`.
- **Reuse (no change)** `src/components/seo/structured-data.tsx` — `VideoJsonLd` already exists.
- **Reuse (no change)** `src/components/media/cinematic-video.tsx`, `src/components/primitives/{data-label,brass-button}.tsx`, `src/components/primitives/reveal.tsx`.
- **Temporary** `scripts/upload-mux.mjs` — one-time upload helper (kept in repo for future re-uploads; not imported by app code).

---

## Task 1: Upload "Cut Up" to Mux and capture the playback ID

This is an operational task (not TDD) — it produces the constants Task 2 hardcodes.

**Files:**
- Create: `scripts/upload-mux.mjs`

- [ ] **Step 1: Write the upload script**

Create `scripts/upload-mux.mjs`. It reads Mux creds from `.env.local`, creates a direct upload, PUTs the file, then polls the asset until `ready`.

```js
// scripts/upload-mux.mjs
// Usage: node scripts/upload-mux.mjs "<absolute-path-to-.mov>"
import { readFileSync, createReadStream, statSync } from 'node:fs';
import { basename } from 'node:path';

// --- load MUX creds from .env.local (no dotenv dependency) ---
function loadEnv() {
  const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const env = loadEnv();
const ID = env.MUX_TOKEN_ID;
const SECRET = env.MUX_TOKEN_SECRET;
if (!ID || !SECRET) throw new Error('Missing MUX_TOKEN_ID / MUX_TOKEN_SECRET in .env.local');
const AUTH = 'Basic ' + Buffer.from(`${ID}:${SECRET}`).toString('base64');

const filePath = process.argv[2];
if (!filePath) throw new Error('Pass the video file path as the first argument');
const size = statSync(filePath).size;
console.log(`Uploading ${basename(filePath)} (${(size / 1e6).toFixed(0)} MB)`);

// 1) create direct upload
const uploadRes = await fetch('https://api.mux.com/video/v1/uploads', {
  method: 'POST',
  headers: { Authorization: AUTH, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cors_origin: '*',
    new_asset_settings: { playback_policy: ['public'], encoding_tier: 'smart' },
  }),
});
if (!uploadRes.ok) throw new Error(`create upload failed: ${uploadRes.status} ${await uploadRes.text()}`);
const { data: upload } = await uploadRes.json();
console.log('Upload id:', upload.id);

// 2) PUT the file to the signed URL
const put = await fetch(upload.url, {
  method: 'PUT',
  headers: { 'Content-Type': 'video/quicktime', 'Content-Length': String(size) },
  body: createReadStream(filePath),
  duplex: 'half',
});
if (!put.ok) throw new Error(`file PUT failed: ${put.status} ${await put.text()}`);
console.log('File uploaded. Waiting for asset to be created…');

// 3) poll the upload until it has an asset_id, then poll the asset until ready
async function getJson(url) {
  const r = await fetch(url, { headers: { Authorization: AUTH } });
  if (!r.ok) throw new Error(`${url} -> ${r.status} ${await r.text()}`);
  return (await r.json()).data;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let assetId;
for (let i = 0; i < 60 && !assetId; i++) {
  const u = await getJson(`https://api.mux.com/video/v1/uploads/${upload.id}`);
  assetId = u.asset_id;
  if (!assetId) await sleep(2000);
}
if (!assetId) throw new Error('Timed out waiting for asset_id');
console.log('Asset id:', assetId);

let asset;
for (let i = 0; i < 150; i++) {
  asset = await getJson(`https://api.mux.com/video/v1/assets/${assetId}`);
  if (asset.status === 'ready') break;
  if (asset.status === 'errored') throw new Error('Asset errored: ' + JSON.stringify(asset.errors));
  process.stdout.write(`\r  status: ${asset.status} (${i})   `);
  await sleep(4000);
}
console.log('\nStatus:', asset.status);

const playbackId = asset.playback_ids?.[0]?.id;
console.log('\n==== RESULT ====');
console.log('PLAYBACK_ID :', playbackId);
console.log('DURATION_S  :', asset.duration);
console.log('THUMBNAIL   :', `https://image.mux.com/${playbackId}/thumbnail.webp`);
console.log('================');
```

- [ ] **Step 2: Run the upload**

Run (from `site/`):
```bash
node scripts/upload-mux.mjs "I:/Business Drive/Small Businesses/Cole/Cut Up Music Video/Cole - Cut Up (Final Color Render).mov"
```
Expected: prints an upload id, an asset id, `status: ready`, and a `==== RESULT ====` block with `PLAYBACK_ID`, `DURATION_S`, and `THUMBNAIL`. **Record these three values** — Task 2 uses them.

- [ ] **Step 3: Sanity-check the playback works**

Open `https://image.mux.com/<PLAYBACK_ID>/thumbnail.webp` in a browser. Expected: a frame from the video renders (confirms the asset is public and ready). If it 404s, the asset isn't ready or the playback policy isn't public — re-check Step 2 output.

- [ ] **Step 4: Commit the script**

```bash
git add scripts/upload-mux.mjs
git commit -m "chore: add Mux direct-upload script for featured video"
```

---

## Task 2: Build the `FeaturedMusicVideo` component (TDD)

**Files:**
- Create: `src/components/home/featured-music-video.tsx`
- Test: `src/components/home/featured-music-video.test.tsx`

Substitute `<PLAYBACK_ID>`, `<DURATION_S>` from Task 1 where indicated.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/home/featured-music-video.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@mux/mux-player-react', () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="mux-player" data-playback-id={props.playbackId as string} />
  ),
}));

import { FeaturedMusicVideo, FEATURED_VIDEO_PLAYBACK_ID } from './featured-music-video';

describe('FeaturedMusicVideo', () => {
  it('renders the featured film title and artist', () => {
    render(<FeaturedMusicVideo />);
    expect(screen.getByText(/cut up/i)).toBeInTheDocument();
    expect(screen.getByText(/cole/i)).toBeInTheDocument();
  });

  it('renders the Mux player with the featured playback id', () => {
    render(<FeaturedMusicVideo />);
    expect(screen.getByTestId('mux-player')).toHaveAttribute(
      'data-playback-id',
      FEATURED_VIDEO_PLAYBACK_ID,
    );
  });

  it('links to the music video service page', () => {
    render(<FeaturedMusicVideo />);
    const cta = screen.getByRole('link', { name: /music video work/i });
    expect(cta).toHaveAttribute('href', '/corporate/music-videos');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/home/featured-music-video.test.tsx`
Expected: FAIL — cannot resolve `./featured-music-video` (module doesn't exist yet).

- [ ] **Step 3: Write the component**

Replace `PASTE_PLAYBACK_ID` and `PASTE_DURATION_SECONDS` with the Task 1 values. Poster: default to the Mux thumbnail; if a color-graded still looks better, place it in `public/` and set `POSTER_URL` to that path instead.

```tsx
// src/components/home/featured-music-video.tsx
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { CinematicVideo } from '@/components/media/cinematic-video';
import { VideoJsonLd } from '@/components/seo/structured-data';
import { env } from '@/lib/env';

export const FEATURED_VIDEO_PLAYBACK_ID = 'PASTE_PLAYBACK_ID';
const POSTER_URL = `https://image.mux.com/${FEATURED_VIDEO_PLAYBACK_ID}/thumbnail.webp`;
const DURATION_SECONDS = PASTE_DURATION_SECONDS;

const TITLE = 'Cut Up';
const ARTIST = 'Cole';
const DESCRIPTION =
  'The latest music video from Dallas artist Cole, "Cut Up" — shot, edited, and color-graded in-house by Semper Fi Media. This is what a $3,000 single-day music video shoot delivers.';

function isoDuration(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  return `PT${Math.floor(s / 60)}M${s % 60}S`;
}

export function FeaturedMusicVideo() {
  return (
    <section
      className="bg-gunpowder px-6 py-20 md:px-12 md:py-28"
      aria-label={`Featured music video: ${ARTIST} — ${TITLE}`}
    >
      <VideoJsonLd
        name={`${ARTIST} — "${TITLE}"`}
        description={DESCRIPTION}
        thumbnailUrl={POSTER_URL}
        uploadDate="2026-06-04"
        embedUrl={`https://stream.mux.com/${FEATURED_VIDEO_PLAYBACK_ID}.m3u8`}
      />
      <div className="mx-auto max-w-[1440px]">
        <DataLabel className="mb-4">FEATURED FILM · MUSIC VIDEO</DataLabel>
        <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
          {ARTIST} — &ldquo;{TITLE}&rdquo;
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-muted">
          {DESCRIPTION}
        </p>
        <div className="mt-10">
          <CinematicVideo
            playbackId={FEATURED_VIDEO_PLAYBACK_ID}
            title={`${ARTIST} — ${TITLE}`}
            poster={POSTER_URL}
            aspect="video"
            className="rounded"
          />
        </div>
        <div className="mt-8">
          <BrassButton href="/corporate/music-videos">See music video work →</BrassButton>
        </div>
      </div>
    </section>
  );
}

// isoDuration + DURATION_SECONDS reserved for future VideoObject `duration` field;
// keep the constant so the render date/length stay documented alongside the asset.
void isoDuration;
void DURATION_SECONDS;
void env;
```

> Note: if lint flags the unused `isoDuration`/`DURATION_SECONDS`/`env`, wire `duration: isoDuration(DURATION_SECONDS)` into the `VideoJsonLd` call by adding a `duration` prop to `VideoProps` in `structured-data.tsx` and passing it. Simplest path: pass `duration={isoDuration(DURATION_SECONDS)}` and extend `VideoProps` with an optional `duration?: string`. Remove the three `void` lines and the `env` import if unused.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/home/featured-music-video.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/home/featured-music-video.tsx src/components/home/featured-music-video.test.tsx
git commit -m "feat: add FeaturedMusicVideo homepage section"
```

---

## Task 3: Add `duration` to `VideoJsonLd` and wire it in (optional cleanup)

Only do this if you kept the `duration` improvement from Task 2's note. Otherwise skip to Task 4.

**Files:**
- Modify: `src/components/seo/structured-data.tsx:101-122`
- Modify: `src/components/home/featured-music-video.tsx`

- [ ] **Step 1: Extend `VideoProps` and pass through `duration`**

In `structured-data.tsx`, change the `VideoProps` type and helper:

```tsx
type VideoProps = {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string;
};

export function VideoJsonLd(props: VideoProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    ...props,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: Pass `duration` from the component**

In `featured-music-video.tsx`, add `duration={isoDuration(DURATION_SECONDS)}` to the `<VideoJsonLd>` call and delete the `void isoDuration;` / `void DURATION_SECONDS;` / `void env;` lines and the unused `env` import.

- [ ] **Step 3: Re-run the component test**

Run: `npx vitest run src/components/home/featured-music-video.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 4: Commit**

```bash
git add src/components/seo/structured-data.tsx src/components/home/featured-music-video.tsx
git commit -m "feat: include VideoObject duration in featured video JSON-LD"
```

---

## Task 4: Integrate into the homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Import the component**

In `src/app/page.tsx`, add near the other `home/` imports (after the `FeaturedWork` import, line ~5):

```tsx
import { FeaturedMusicVideo } from '@/components/home/featured-music-video';
```

- [ ] **Step 2: Render it after the featured-work grid**

Locate this block (around lines 47-51):

```tsx
        {caseStudies.length > 0 && (
          <Reveal>
            <FeaturedWork caseStudies={caseStudies} />
          </Reveal>
        )}
```

Immediately after the closing `)}` of that block and before `<Reveal><DualFunnel /></Reveal>`, insert:

```tsx
        <Reveal>
          <FeaturedMusicVideo />
        </Reveal>
```

- [ ] **Step 3: Typecheck + full test run**

Run: `npx tsc --noEmit && npx vitest run`
Expected: no TS errors; all tests pass (including the 3 new ones).

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: no errors in the two changed/new files.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: render featured music video on homepage after work grid"
```

---

## Task 5: Manual verification

- [ ] **Step 1: Run the dev server**

Run: `npm run dev`, open `http://localhost:3000`.

- [ ] **Step 2: Visual + behavior check**

Confirm: the "FEATURED FILM · MUSIC VIDEO" section appears **after** the work grid and **before** the funnel; the poster frame shows before play; clicking play streams the video **with sound**; the brass "See music video work →" button navigates to `/corporate/music-videos`.

- [ ] **Step 3: Validate structured data**

View page source, copy the `VideoObject` JSON-LD block, paste into Google's Rich Results Test (https://search.google.com/test/rich-results). Expected: a valid "Video" item detected, no errors.

- [ ] **Step 4: Final production build**

Run: `npm run build`
Expected: build succeeds with no errors.

---

## Self-Review

- **Spec coverage:**
  - Placement after work grid, before funnel → Task 4. ✅
  - Mux delivery, hardcoded playback ID → Task 1 + Task 2. ✅
  - Click-to-play with sound (no autoplay/mute) → Task 2 (`CinematicVideo` with no `autoPlay`/`muted` props; defaults are `false`). ✅
  - Poster = Mux thumbnail or still → Task 2 `POSTER_URL` with documented swap. ✅
  - SEO copy (eyebrow/title/description/CTA) → Task 2 constants. ✅
  - `VideoObject` JSON-LD → Task 2 (reuses existing `VideoJsonLd`), enriched in Task 3. ✅
  - Component test mirroring `home/` patterns → Task 2 test. ✅
- **Placeholder scan:** `PASTE_PLAYBACK_ID` / `PASTE_DURATION_SECONDS` are explicit substitution points filled from Task 1 output, not vague TODOs. No other placeholders.
- **Type consistency:** `FEATURED_VIDEO_PLAYBACK_ID` exported from the component and imported in the test — names match. `CinematicVideo` props (`playbackId`, `title`, `poster`, `aspect`, `className`) match `cinematic-video.tsx`. `VideoJsonLd` props match `structured-data.tsx` (Task 3 extends it consistently). `BrassButton href` matches its `LinkProps`.
