import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { PricingTier } from '@/components/pricing/pricing-tier';
import { ServiceJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Cinema Wedding Videography — Dallas & Destination',
  description:
    'Cinema Wedding packages from $3,000. Dallas, Fort Worth, Forney, destination weddings. Three tiers, full transparency, cinematic craft.',
};

const TIERS = [
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

export default function WeddingsPage() {
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Cinema Wedding Videography Dallas"
        description="Cinema wedding videography in Dallas–Fort Worth and destination weddings. Three packages from $3,000."
        url="https://www.semperfimedia.llc/weddings"
      />
      <main>
        <section className="bg-gradient-to-br from-texas-umber via-golden-hour to-bone px-6 pt-28 pb-16 text-gunpowder md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <div className="data-label mb-6 text-gunpowder">FOR COUPLES</div>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              A film of
              <br />
              the day you
              <br />
              said yes.
            </h1>
            <p className="mt-8 max-w-2xl text-lg" style={{ color: '#2a1a08' }}>
              Cinema Wedding packages from $3,000. Three tiers, full transparency, no hidden fees.
              Destination weddings welcome.
            </p>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-10">PACKAGES</DataLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {TIERS.map((tier) => (
                <PricingTier key={tier.name} {...tier} />
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-bone-subtle">
              Destination weddings outside Dallas–Fort Worth: travel billed at $0.67/mile plus
              lodging where required. Custom packages available.
            </p>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl">
            <DataLabel className="mb-5">★★★★★ · GOOGLE REVIEW</DataLabel>
            <blockquote className="font-serif text-3xl italic leading-snug md:text-4xl">
              &ldquo;TJ and his crew were amazing! They were professional, organized and very
              detail oriented. He listened to my ideas and executed my vision. Thanks again for
              capturing those special moments with our family and friends!&rdquo;
            </blockquote>
            <DataLabel tone="muted" className="mt-6">
              SABRINA WEDDLES
            </DataLabel>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">
              Let&apos;s tell your love story.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Call</BrassButton>
              <BrassButton href="/work" variant="outline">
                See Wedding Films
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
