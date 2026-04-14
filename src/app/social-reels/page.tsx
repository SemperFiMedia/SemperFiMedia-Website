import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { CinematicVideo } from '@/components/media/cinematic-video';
import { ServiceJsonLd } from '@/components/seo/structured-data';
import { urlForImage } from '@/sanity/image';
import { getSocialReels } from '@/sanity/queries';

export const metadata: Metadata = {
  title: 'Social Media Reels — Dallas Video Production',
  description:
    'Vertical social media reels for Dallas businesses, artists, and event hosts. We cut your music video, wedding, corporate film, or event footage into scroll-stopping 9:16 reels for Instagram, TikTok, and YouTube Shorts.',
};

const DELIVERABLES = [
  {
    title: 'Music Video Cutdowns',
    body: 'Your 3-minute music video, reformatted into 5 vertical reels with motion-blurred backdrops, beat-synced cuts, and lyric overlays.',
  },
  {
    title: 'Event & Wedding Reels',
    body: 'Weddings, quinceañeras, milestone birthdays — condensed into scroll-stoppers family will actually share.',
  },
  {
    title: 'Corporate & Brand Shorts',
    body: 'Brand films repurposed as vertical hooks for paid social, LinkedIn, and recruiting campaigns.',
  },
  {
    title: 'Convention & B-Roll Packages',
    body: 'Dallas cosplay, horror, comic, and trade conventions — crowd energy cut tight for event recap reels.',
  },
];

export default async function SocialReelsPage() {
  const reels = await getSocialReels();

  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Social Media Reels — Dallas"
        description="Vertical 9:16 social media reel production and footage repurposing in Dallas–Fort Worth."
        url="https://www.semperfimedia.llc/social-reels"
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · SOCIAL REELS</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              The scroll stops<br />where your footage starts.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-bone-muted md:text-xl">
              We take your finished video — music video, wedding, brand film, event — and cut it
              into vertical 9:16 reels built for Instagram, TikTok, and YouTube Shorts. Motion-blurred
              backdrops, beat-matched cuts, captions burned in. The algorithm rewards the work.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Get a reel quote</BrassButton>
              <Link
                href="#examples"
                className="inline-flex items-center text-sm font-medium uppercase tracking-wider text-bone-muted transition-colors hover:text-bone"
              >
                See examples ↓
              </Link>
            </div>
          </div>
        </section>

        <section
          id="examples"
          className="bg-gunpowder px-6 py-20 md:px-12 md:py-28"
          aria-label="Social reel examples"
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-12 md:mb-16">
              <DataLabel className="mb-4">RECENT REELS</DataLabel>
              <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
                Built to stop a thumb.
              </h2>
            </div>
            {reels.length === 0 ? (
              <div className="rounded border border-bone/10 bg-black/40 px-8 py-16 text-center">
                <p className="text-bone-muted">
                  New reels coming soon.{' '}
                  <Link href="/contact" className="text-brass underline">
                    Get in touch
                  </Link>{' '}
                  to commission one for your next drop.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {reels.map((reel) => {
                  const posterUrl = reel.poster
                    ? urlForImage(reel.poster)?.width(540).height(960).url() ?? undefined
                    : undefined;
                  return (
                    <figure key={reel._id} className="flex flex-col gap-3">
                      {reel.muxPlaybackId ? (
                        <CinematicVideo
                          playbackId={reel.muxPlaybackId}
                          title={reel.title}
                          aspect="vertical"
                          poster={posterUrl}
                          className="rounded"
                        />
                      ) : (
                        <div className="aspect-[9/16] rounded bg-gradient-to-br from-dusk-teal to-texas-umber" />
                      )}
                      <figcaption>
                        <DataLabel tone="muted" className="text-[11px]">
                          {reel.client}
                        </DataLabel>
                        <p className="mt-1 font-serif text-lg italic">{reel.title}</p>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section
          className="bg-black px-6 py-20 md:px-12 md:py-28"
          aria-label="What you get"
        >
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-4">WHAT WE CUT</DataLabel>
            <h2 className="mb-12 font-serif text-4xl italic leading-tight md:text-5xl">
              Footage you already have,<br />reformatted for where attention lives.
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {DELIVERABLES.map((item) => (
                <div key={item.title} className="border-l border-brass/40 pl-6">
                  <h3 className="font-serif text-2xl italic">{item.title}</h3>
                  <p className="mt-3 text-bone-muted leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              Already have footage? Let's cut it.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-bone-muted">
              Most reel projects turn around in under a week. Send the source file — we'll
              send back scroll-stoppers.
            </p>
            <div className="mt-10">
              <BrassButton href="/contact">Book a reel</BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
