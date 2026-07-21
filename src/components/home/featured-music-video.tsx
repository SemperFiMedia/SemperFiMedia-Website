import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { CinematicVideo } from '@/components/media/cinematic-video';
import { VideoJsonLd } from '@/components/seo/structured-data';
import { env } from '@/lib/env';

export const FEATURED_VIDEO_PLAYBACK_ID = 'AbrUiZ7cPm2CmYDPdbRXUopfqAqVTB01J9nZSWW701l1w';

// Branded music-video thumbnail (poster shown before play). Local path for the
// player; absolute URL for the JSON-LD thumbnail Google requires.
const POSTER_PATH = '/featured-cole-cut-up.webp';
const POSTER_URL = `${env.siteUrl}${POSTER_PATH}`;
const TITLE = 'Cut Up';
const ARTIST = 'Cole';
const DESCRIPTION =
  'The latest music video from Dallas artist Cole, "Cut Up" — shot, edited, and color-graded in-house by Semper Fi Media. This is what a $3,000 single-day music video shoot delivers.';

export function FeaturedMusicVideo() {
  return (
    <section
      className="bg-gunpowder px-6 py-20 md:px-12 md:py-28"
      aria-label='Featured music video: Cole — "Cut Up"'
    >
      <VideoJsonLd
        name='Cole — "Cut Up"'
        description={DESCRIPTION}
        thumbnailUrl={POSTER_URL}
        uploadDate="2026-06-04"
        contentUrl={`https://stream.mux.com/${FEATURED_VIDEO_PLAYBACK_ID}.m3u8`}
        duration="PT2M1S"
      />
      <div className="mx-auto max-w-[1440px]">
        <DataLabel className="mb-4">FEATURED FILM · MUSIC VIDEO</DataLabel>
        <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
          {ARTIST} &mdash; &ldquo;{TITLE}&rdquo;
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-muted">{DESCRIPTION}</p>
        <div className="mt-10">
          <CinematicVideo
            playbackId={FEATURED_VIDEO_PLAYBACK_ID}
            title="Cole — Cut Up"
            poster={POSTER_PATH}
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
