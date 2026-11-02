import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { CinematicVideo } from '@/components/media/cinematic-video';
import { BreadcrumbJsonLd } from '@/components/seo/structured-data';
import { PricingJumpNav } from '@/components/pricing/jump-nav';
import { getReelShoots } from '@/sanity/queries';
import { reelCover } from '@/sanity/reel-cover';
import { FLEMING_CLIENT } from '@/lib/fleming';

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/social-reels/fleming-photos' },
  title: 'Fleming Photos — Behind-the-Scenes Model Shoot Reels | Semper Fi Media',
  description:
    'Behind-the-scenes reels Semper Fi Media filmed and cut for Fleming Photos: themed group shoots, western sets, fashion, and the photographers at work. Vertical reels for Instagram and TikTok.',
};

export default async function FlemingPhotosPage() {
  // Shoots come back newest first, reels inside each shoot newest first.
  const shoots = await getReelShoots(FLEMING_CLIENT);
  const reelCount = shoots.reduce((n, s) => n + s.reels.length, 0);

  return (
    <>
      <Nav />
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Social Media Reels', href: '/social-reels' },
        { name: 'Fleming Photos', href: '/social-reels/fleming-photos' },
      ]} />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SOCIAL REELS · CLIENT · FLEMING PHOTOS</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Behind the lens
              <br />
              with Fleming Photos.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-muted md:text-xl">
              We film the behind-the-scenes of Fleming Photos shoots — the models, the sets, and
              the photographers at work — and cut them into reels built for Instagram and TikTok.
            </p>
            {reelCount > 0 && (
              <p className="mt-4 text-sm text-bone-muted">
                <span className="text-brass">{reelCount} videos</span>, newest work first.
              </p>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Get BTS reels for your studio</BrassButton>
              <BrassButton href="/social-reels#pricing" variant="outline">
                Reel pricing
              </BrassButton>
            </div>
          </div>
        </section>

        {shoots.length > 0 && (
          <PricingJumpNav
            sections={shoots.map((s) => ({ id: s.slug.current, label: s.nav }))}
            ariaLabel="Jump to a shoot"
          />
        )}

        {shoots.map((shoot, i) => {
          const films = shoot.reels.filter((v) => v.aspect === 'video');
          const reels = shoot.reels.filter((v) => v.aspect !== 'video');
          // Whichever kind the shoot lists first goes on top, so a section can
          // lead with its newest reels instead of an older film.
          const reelsFirst = shoot.reels[0]?.aspect !== 'video';

          const filmGrid = films.length > 0 && (
            <div key="films" className={`grid grid-cols-1 gap-8 ${films.length > 1 ? 'lg:grid-cols-2' : ''}`}>
              {films.map((film) => (
                <figure key={film._key}>
                  <CinematicVideo
                    playbackId={film.muxPlaybackId}
                    title={film.title}
                    aspect="video"
                    poster={reelCover(film)}
                    className="rounded"
                  />
                  <figcaption className="mt-3 font-serif text-lg italic">{film.title}</figcaption>
                </figure>
              ))}
            </div>
          );

          const reelGrid = reels.length > 0 && (
            <div key="reels" className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {reels.map((reel) => (
                <figure key={reel._key} className="flex flex-col gap-3">
                  <CinematicVideo
                    playbackId={reel.muxPlaybackId}
                    title={reel.title}
                    aspect="vertical"
                    poster={reelCover(reel)}
                    className="rounded"
                  />
                  <figcaption>
                    {reel.credit && (
                      <DataLabel tone="muted" className="text-[10px]">
                        {reel.credit}
                      </DataLabel>
                    )}
                    <p className="mt-1 font-serif text-lg italic">{reel.title}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          );

          return (
            <section
              key={shoot._id}
              id={shoot.slug.current}
              className={`scroll-mt-24 px-6 py-20 md:px-12 md:py-24 ${i % 2 === 0 ? 'bg-black' : 'bg-gunpowder'}`}
              aria-label={shoot.title}
            >
              <div className="mx-auto max-w-[1440px]">
                <div className="mb-10 max-w-3xl md:mb-14">
                  <DataLabel className="mb-4">{shoot.label}</DataLabel>
                  <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
                    {shoot.title}
                  </h2>
                  {shoot.blurb && <p className="mt-4 text-bone-muted">{shoot.blurb}</p>}
                </div>

                <div className="flex flex-col gap-12">
                  {reelsFirst ? [reelGrid, filmGrid] : [filmGrid, reelGrid]}
                </div>
              </div>
            </section>
          );
        })}

        <section className="bg-gradient-to-br from-texas-umber via-golden-hour to-bone px-6 py-20 text-gunpowder md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-6xl">
              Run a photo studio?
            </h2>
            <p className="mt-6 text-lg" style={{ color: '#2a1a08' }}>
              Your shoots are already content. We film the session and hand you reels for every
              model and every look.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/social-reels" variant="outline">
                All social reels
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
