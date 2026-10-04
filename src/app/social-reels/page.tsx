import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { CinematicVideo } from '@/components/media/cinematic-video';
import { ServiceJsonLd } from '@/components/seo/structured-data';
import { muxVerticalPoster } from '@/lib/mux-image';
import { getSocialReels } from '@/sanity/queries';
import { formatPrice } from '@/lib/utils';
import { SOCIAL_REEL_PRICE, SOCIAL_REEL_PACKS } from '@/lib/social-reels';

const perReel = (price: number, count: number) =>
  price % count === 0
    ? `${formatPrice(price / count)} a reel.`
    : `About ${formatPrice(Math.round(price / count))} a reel.`;

const REEL_OPTIONS = [
  { label: 'ONE REEL', price: SOCIAL_REEL_PRICE, note: 'A single vertical cut for Instagram, TikTok, or Shorts.' },
  ...SOCIAL_REEL_PACKS.map((pack) => ({
    label: `${pack.count}-REEL PACK`,
    price: pack.price,
    note: perReel(pack.price, pack.count),
  })),
];

const REEL_OFFERS = [
  { name: 'Social Media Reel', description: 'One vertical 9:16 reel cut from existing footage', price: String(SOCIAL_REEL_PRICE) },
  ...SOCIAL_REEL_PACKS.map((pack) => ({
    name: `Social Media Reels — ${pack.count}-Pack`,
    description: `${pack.count} vertical 9:16 reels cut from existing footage`,
    price: String(pack.price),
  })),
];

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
        url="https://semperfimedia.llc/social-reels"
        offers={REEL_OFFERS}
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
                  // Poster comes from the video, not from Sanity: the uploaded
                  // stills for reels are landscape, and a landscape still in a
                  // 9:16 frame is what pushed these into 16:9 in the first place.
                  const posterUrl = reel.muxPlaybackId
                    ? muxVerticalPoster(reel.muxPlaybackId)
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

        <section
          id="pricing"
          className="scroll-mt-24 border-y border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-28"
          aria-label="Pricing"
        >
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-4">PRICING</DataLabel>
            <h2 className="mb-4 font-serif text-4xl italic leading-tight md:text-5xl">
              One rate for every reel we cut.
            </h2>
            <p className="mb-12 max-w-2xl leading-relaxed text-bone-muted">
              The same price whether the footage is a music video, a wedding, a conference talk,
              or a brand film. Pack rates apply automatically.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {REEL_OPTIONS.map((option) => (
                <div key={option.label} className="flex flex-col border border-bone/15 bg-black/40 p-6">
                  <DataLabel className="mb-2">{option.label}</DataLabel>
                  <div className="font-serif text-4xl text-brass">{formatPrice(option.price)}</div>
                  <p className="mt-3 text-sm text-bone-muted">{option.note}</p>
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
