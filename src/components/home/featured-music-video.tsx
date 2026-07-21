import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { CinematicVideo } from '@/components/media/cinematic-video';
import { VideoJsonLd } from '@/components/seo/structured-data';

export const FEATURED_VIDEO_PLAYBACK_ID = 'AbrUiZ7cPm2CmYDPdbRXUopfqAqVTB01J9nZSWW701l1w';

const POSTER_URL =
  'https://image.mux.com/AbrUiZ7cPm2CmYDPdbRXUopfqAqVTB01J9nZSWW701l1w/thumbnail.webp';
const TITLE = 'Cut Up';
const ARTIST = 'Cole';
const DESCRIPTION =
  'The latest music video from Dallas artist Cole, "Cut Up" — shot, edited, and color-graded in-house by Semper Fi Media. This is what a $3,000 single-day music video shoot delivers.';

export function FeaturedMusicVideo() {
  return (
    <section
      className="bg-gunpowder px-6 py-20 md:px-12 md:py-28"
      aria-label="Featured music video"
    >
      <VideoJsonLd
        name='Cole — "Cut Up"'
        description={DESCRIPTION}
        thumbnailUrl={POSTER_URL}
        uploadDate="2026-06-04"
        embedUrl="https://stream.mux.com/AbrUiZ7cPm2CmYDPdbRXUopfqAqVTB01J9nZSWW701l1w.m3u8"
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
