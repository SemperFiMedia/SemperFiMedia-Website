import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { PricingTier } from '@/components/pricing/pricing-tier';

export const metadata: Metadata = {
  title: 'Pricing — Transparent Rates for Dallas Video Production',
  description:
    'Published pricing for cinema weddings, corporate video production, music videos, and event videography in Dallas–Fort Worth.',
};

const WEDDING_TIERS = [
  {
    label: 'STORY PACKAGE',
    name: 'Story',
    price: '$3,000',
    priceNote: '+ tax',
    includes: [
      '8 hours of coverage',
      '1 Certified CinemaStory Cinematographer',
      '1 Certified Assistant Cinematographer',
      'HD/4K cinematic cameras + drone',
      'Professional sound recording & design',
      'Music licensing for all online platforms',
      '4–5 minute story film in HD',
    ],
  },
  {
    label: 'SIGNATURE PACKAGE',
    name: 'Signature',
    price: '$5,000',
    priceNote: '+ tax',
    includes: [
      '10 hours of coverage',
      '1 Certified CinemaStory Cinematographer',
      '1 Certified Assistant Cinematographer',
      'HD/4K cinematic cameras + drone',
      'Professional sound recording & design',
      'Music licensing for all online platforms',
      '1-minute teaser film',
      '5–6 minute story film in HD',
    ],
    highlighted: true,
  },
  {
    label: 'CINEMA PACKAGE',
    name: 'Cinema',
    price: '$7,200',
    priceNote: '+ tax',
    includes: [
      '12 hours of coverage',
      '2 Certified CinemaStory Cinematographers',
      'Sony 4K cinematic cameras + drone',
      'Professional sound recording & design',
      'Music licensing for all online platforms',
      '1-minute teaser film',
      '8–10 minute story film in 4K',
    ],
  },
];

const CORPORATE_TIERS = [
  {
    label: 'ENTRY',
    name: 'Spotlight',
    price: '$1,500',
    priceNote: 'starting',
    includes: [
      'Half-day shoot (up to 4 hours)',
      '1 cinematographer',
      'Single location',
      '60–90 second finished film',
      '2 rounds of revisions',
    ],
  },
  {
    label: 'POPULAR',
    name: 'Brand Film',
    price: '$3,500',
    priceNote: 'starting',
    includes: [
      'Full-day shoot (up to 8 hours)',
      '1 cinematographer + 1 assistant',
      'Up to 2 locations',
      '2–3 minute finished film',
      'B-roll package + social cutdowns',
      '2 rounds of revisions',
    ],
    highlighted: true,
  },
  {
    label: 'FULL PRODUCTION',
    name: 'Full Production',
    price: 'Custom',
    priceNote: 'quoted',
    includes: [
      'Multi-day or multi-location shoots',
      'Full crew (DP + 2nd shooter + sound + drone)',
      'Pre-production + concept development',
      'Licensed music + custom color grade',
      'Case study-grade finish',
      'Rush delivery available',
    ],
  },
];

const MUSIC_VIDEO = {
  label: 'MUSIC VIDEO',
  name: 'Music Video',
  price: '$3,000',
  priceNote: 'fast turnaround',
  includes: [
    'Single-day shoot (up to 8 hours)',
    '1 cinematographer + drone',
    'Single location',
    '3–4 minute finished music video',
    'Color graded to track mood',
    '2 rounds of revisions',
    '14-day delivery',
  ],
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">PRICING · FULL TRANSPARENCY</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              No surprises.
              <br />
              Just the work.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Published rates across our most-requested services. Every package is quoted on
              trust — no hidden fees, no mystery invoicing. Custom work is quoted transparently
              after a discovery call.
            </p>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-10">CINEMA WEDDINGS</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {WEDDING_TIERS.map((tier) => (
                <PricingTier key={tier.name} {...tier} href="/weddings" />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-10">CORPORATE &amp; BRAND FILMS</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {CORPORATE_TIERS.map((tier) => (
                <PricingTier key={tier.name} {...tier} href="/corporate" />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-10">MUSIC VIDEOS · FAST TURNAROUND</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <PricingTier {...MUSIC_VIDEO} highlighted href="/corporate/music-videos" />
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-10">HOURLY SERVICES &amp; ADD-ONS</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">CONSULTING</DataLabel>
                <h3 className="font-serif text-2xl italic">Pre-Production</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl">$100</span>
                  <span className="text-sm text-bone-subtle">/ hour</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Treatment writing, shot list development, location scouts, and pre-production
                  meetings — billed hourly whether we're on Zoom or in person.
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">FULL RIGHTS</DataLabel>
                <h3 className="font-serif text-2xl italic">Raw Footage Buyout</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl">100%</span>
                  <span className="text-sm text-bone-subtle">of project cost</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Transfers all media rights of the raw files to you. Semper Fi Media retains
                  no rights to the footage — priced to protect future creative reuse.
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">ADDITIONAL REVISIONS</DataLabel>
                <h3 className="font-serif text-2xl italic">Extra Rounds</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl">$100</span>
                  <span className="text-sm text-bone-subtle">/ hour</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Every package includes 2 rounds of revisions. Additional rounds are billed
                  hourly. Most edits are tightened in under an hour.
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">EXPEDITED</DataLabel>
                <h3 className="font-serif text-2xl italic">Rush Delivery</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl">Quoted</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Need the cut faster than our standard 2–4 week turnaround? Tell us on the
                  discovery call and we'll quote the rush premium up front.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black px-6 py-16 text-center md:px-12 md:py-20">
          <p className="text-sm text-bone-subtle">
            Travel beyond Dallas–Fort Worth: $0.67/mile · Destination weddings quoted separately.
            Sales tax applied where required.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
