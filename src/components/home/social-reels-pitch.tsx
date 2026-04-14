import Link from 'next/link';
import { DataLabel } from '@/components/primitives/data-label';
import { CinematicVideo } from '@/components/media/cinematic-video';
import { urlForImage } from '@/sanity/image';
import type { CaseStudy } from '@/sanity/types';

type Props = {
  reels: CaseStudy[];
};

export function SocialReelsPitch({ reels }: Props) {
  if (reels.length === 0) return null;

  return (
    <section
      className="bg-black px-6 py-20 md:px-12 md:py-28"
      aria-label="Social media reels service"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <DataLabel className="mb-4">NEW · SOCIAL MEDIA REELS</DataLabel>
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              The footage you own<br />already makes reels.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bone-muted">
              Music video, wedding, brand film — we cut your finished video into scroll-stopping
              9:16 reels with motion-blurred backdrops, beat-matched cuts, and captions that hook.
              One shoot. Ten pieces of social content.
            </p>
            <Link
              href="/social-reels"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-brass transition-colors hover:text-brass/80"
            >
              See reel work →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {reels.slice(0, 3).map((reel) => {
              const posterUrl = reel.poster
                ? urlForImage(reel.poster)?.width(360).height(640).url() ?? undefined
                : undefined;
              return reel.muxPlaybackId ? (
                <CinematicVideo
                  key={reel._id}
                  playbackId={reel.muxPlaybackId}
                  title={reel.title}
                  aspect="vertical"
                  poster={posterUrl}
                  autoPlay
                  muted
                  loop
                  className="rounded"
                />
              ) : (
                <div
                  key={reel._id}
                  className="aspect-[9/16] rounded bg-gradient-to-br from-dusk-teal to-texas-umber"
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
