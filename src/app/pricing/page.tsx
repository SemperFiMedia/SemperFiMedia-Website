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
    label: 'ESSENTIALS',
    name: 'Essentials',
    price: '$3,500',
    priceNote: 'flat',
    includes: [
      '6 hours of wedding-day coverage',
      'Marine Certified Cinematographer (TJ at the helm)',
      '4K cinema cameras + cinema primes',
      'Drone aerials (where permitted)',
      'Professional sound (lavs + boom)',
      'Music licensing for socials & online',
      '4–5 minute cinematic highlight film',
      'USB delivery + Free YouTube + Facebook premiere',
    ],
  },
  {
    label: 'CINEMATIC',
    name: 'Cinematic',
    price: '$5,000',
    priceNote: 'flat',
    includes: [
      '8 hours of wedding-day coverage',
      'Marine Certified Cinematographer + Documentary Certified 2nd shooter',
      '4K cinema cameras + cinema primes',
      'Drone aerials (where permitted)',
      'Professional sound (lavs + boom)',
      'Music licensing for socials & online',
      '1-minute social teaser film',
      '6–8 minute cinematic highlight film',
      'Full ceremony cut',
      'USB delivery + Free YouTube + Facebook premiere',
    ],
    highlighted: true,
  },
  {
    label: 'HEIRLOOM',
    name: 'Heirloom',
    price: '$8,000',
    priceNote: 'flat',
    includes: [
      '10 hours of wedding-day coverage',
      'Marine Certified Cinematographer + Documentary Certified 2nd shooter + assistant',
      '4K cinema cameras + cinema primes',
      'Drone aerials (where permitted)',
      'Professional sound (lavs + boom)',
      'Music licensing for socials & online',
      '1-minute social teaser film',
      '8–12 minute Netflix-documentary-style story film',
      'Full ceremony + reception cut',
      'Bridesmaid + groomsman interview reel',
      'Parent USB sets (2 included)',
      '48-hour wedding teaser for socials',
      'USB delivery + Free YouTube + Facebook premiere',
    ],
  },
];

const WEDDING_ADDONS = [
  { name: 'Proposal Film', price: '$1,500', note: 'Capture the actual proposal moment.' },
  { name: 'Engagement Story Film', price: '$2,500', note: 'Posed engagement session, cinematic edit.' },
  { name: 'Wedding Teaser Film (Netflix-Style)', price: '$3,000', note: 'Pre-wedding doc with prep + interviews.' },
  { name: 'Rehearsal Dinner Film', price: '$3,000', note: '4 hrs coverage, 45-min film + speeches.' },
  { name: 'One-Minute Teaser Film', price: '$400', note: 'Built for socials.' },
  { name: 'Ceremony Film Edit', price: '$850', note: 'Full multi-cam ceremony cut.' },
  { name: 'Storybook Player', price: '$250', note: 'Premium gift-box video player.' },
  { name: 'Hard Drive with Raw Footage', price: '$250', note: 'Every frame, on a drive.' },
  { name: 'Additional Hours', price: '$350/hr', note: 'Day running long? Add coverage.' },
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
            <DataLabel className="mb-3">CINEMA WEDDINGS · NETFLIX-DOCUMENTARY STYLE</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Three tiers, flat pricing, every package includes USB delivery + free YouTube +
              Facebook premiere + full music licensing.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {WEDDING_TIERS.map((tier) => (
                <PricingTier key={tier.name} {...tier} href="/weddings" />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">WEDDING ADD-ONS</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Stack any of these onto your tier. Bundle Proposal + Engagement, Proposal + Wedding
              Teaser, or Engagement + Wedding Teaser and save $500 per pair.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {WEDDING_ADDONS.map((addon) => (
                <div
                  key={addon.name}
                  className="flex flex-col border border-bone/15 bg-gunpowder/80 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg italic">{addon.name}</h3>
                    <div className="font-serif text-xl text-brass">{addon.price}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-muted">{addon.note}</p>
                </div>
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
