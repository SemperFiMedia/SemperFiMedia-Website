import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { PricingTier } from '@/components/pricing/pricing-tier';
import { PricingJumpNav } from '@/components/pricing/jump-nav';
import { ServiceJsonLd, BreadcrumbJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Film Production Dallas — Day Rates, Crew-for-Hire, Full Kit Pricing',
  description:
    'Transparent film production day rates for Dallas–Fort Worth. Solo Operator ($1,500), B-Cam Day ($2,500), Full Crew Day ($5,500). Crew-for-hire, Sony FX3/A7S III cinema kit, lighting packages, and transparent production insurance pass-through. Built for networks, agencies, and production companies hiring DFW local crew.',
};

const FILM_PRODUCTION_TIERS = [
  {
    label: 'SOLO',
    name: 'Solo Operator Day',
    price: '$1,500',
    priceNote: '10-hour day',
    includes: [
      'TJ as DP / operator — 10 hours on location',
      'Sony FX3 or A7S III + SmallRig cinema cage + Sigma Art lens set',
      'Rode NTG shotgun + wireless lavalier + pro monitor',
      'SmallRig RC 260B LED lighting kit + stands',
      'Owned slider for steady-motion coverage',
      'Hollyland wireless client monitoring',
    ],
  },
  {
    label: 'POPULAR',
    name: 'B-Cam Day',
    price: '$2,500',
    priceNote: '10-hour day',
    includes: [
      'TJ as DP + 1 freelance camera operator',
      'Dual Sony package (FX3 + A7S III, color-matched)',
      'Full Rode audio kit (wireless lavs + boom + shotgun)',
      'SmallRig LED lighting kit (owned)',
      'Slider + gimbal for motion work',
      'Hollyland dual-channel client monitoring',
      '10-hour day',
    ],
    highlighted: true,
  },
  {
    label: 'FULL CREW',
    name: 'Full Crew Day',
    price: '$5,500',
    priceNote: '10-hour day',
    includes: [
      'TJ as DP + 1st AC + Sound Mixer + Gaffer',
      'Dual Sony FX3 + A7S III, matte box, follow focus, shoulder rigs',
      'Pro audio mixer kit (lavs + boom + 32-bit recorder)',
      'SmallRig lighting package (owned) led by Gaffer',
      'Slider + gimbal + DJI drone available',
      'Hollyland multi-channel client monitoring',
      'HMI / SkyPanel packages optional à la carte',
    ],
  },
];

const FILM_PRODUCTION_CREW = [
  { name: 'DP / Cinematographer (TJ)', price: '$1,500', note: '10-hour day. Sony FX3/A7S III cinema kit included.' },
  { name: 'Camera Operator', price: '$800', note: '10-hour day. DFW freelance roster.' },
  { name: '1st AC', price: '$650', note: 'Focus puller, camera build, media management.' },
  { name: '2nd AC', price: '$475', note: 'Slate, batteries, camera support.' },
  { name: 'Sound Mixer (w/ kit)', price: '$900', note: 'Mixer, wireless lavs, boom, recorder.' },
  { name: 'Boom Op', price: '$550', note: 'Dedicated boom operator for dialogue scenes.' },
  { name: 'Gaffer', price: '$650', note: 'Lead lighting, meter reads, power management.' },
  { name: 'Key Grip', price: '$600', note: 'Lead grip: stands, flags, dolly, rigging.' },
  { name: 'Grip / Electric', price: '$475', note: 'Day-player grip or electric support.' },
  { name: 'PA', price: '$200', note: 'Runner, set support, craft logistics.' },
  { name: 'Drone Pilot (Part 107)', price: '$1,200', note: 'FAA-licensed pilot + DJI drone package.' },
];

const FILM_PRODUCTION_KITS = [
  { name: 'Sony A7S III Kit', price: '$175', note: 'Body + Sigma Art primes + monitor + media.' },
  { name: 'Sony FX3 Kit', price: '$225', note: 'Body + Sigma Art primes + monitor + media.' },
  { name: 'Dual Sony Package', price: '$350', note: 'FX3 + A7S III, matched color, full lens set.' },
  { name: 'Small Lighting Package', price: '$250', note: 'SmallRig RC 260B + stands + diffusion (owned).' },
  { name: 'Mid Lighting Package', price: '$1,200', note: 'SkyPanels + HMI + grip cable (rental pass-through).' },
  { name: 'Large Lighting Package', price: '$2,500', note: '3-ton truck, multi-HMI, dolly (rental pass-through).' },
];

const FILM_PRODUCTION_LOGISTICS = [
  { name: 'Overtime', price: '1.5× / 2×', note: '1.5× after 10 hrs, 2× after 12 hrs.' },
  { name: 'Meal Penalty', price: '$35', note: 'Per crew member, per half-hour past the 6-hour mark.' },
  { name: 'Prep Day / Tech Scout', price: '50%', note: 'Half rate for prep, scout, or wrap-only days.' },
  { name: 'Travel Day', price: '50%', note: 'Half rate for days spent traveling to location.' },
  { name: 'Mileage (beyond 30 mi)', price: '$0.75/mi', note: 'Beyond the 30-mile downtown Dallas zone.' },
  { name: 'Per Diem (multi-day)', price: '$75/day', note: 'M&IE only. Lodging billed at cost.' },
  { name: 'Rush Delivery', price: 'Quoted', note: 'Faster than the 2–4 week standard turnaround.' },
  { name: 'Raw Footage Buyout', price: '100%', note: 'Of project cost. Transfers all media rights.' },
];

const SECTIONS = [
  { id: 'day-rates', label: 'Day Rates' },
  { id: 'crew-rates', label: 'Crew' },
  { id: 'kits', label: 'Kits' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'insurance', label: 'Insurance' },
];

export default function FilmProductionPage() {
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Film Production Day Rates Dallas — Semper Fi Media"
        description="Transparent film production day rates, crew-for-hire, and full Sony cinema kit pricing for networks, agencies, and production companies hiring DFW local crew."
        url="https://www.semperfimedia.llc/film-production"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Film Production', href: '/film-production' },
      ]} />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">FILM PRODUCTION · DAY RATES &amp; CREW</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              DFW crew.
              <br />
              Cinema kit.
              <br />
              Transparent rates.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Published day rates for networks, production companies, agencies, and directors
              hiring DFW local crew. Sony hybrid cinema kit (same sensor family as the
              Netflix-approved FX6), Marine-certified DP, DaVinci Resolve color pipeline, and a
              full freelance roster on call. Insurance billed transparently as per-shoot
              pass-through.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book a production</BrassButton>
              <BrassButton href="#day-rates" variant="outline">
                See day rates
              </BrassButton>
            </div>
          </div>
        </section>

        <PricingJumpNav sections={SECTIONS} />

        <section id="day-rates" className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">DAY RATES · THREE TIERS</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              Three pre-built day-rate tiers. Solo for lean shoots, B-Cam for dual-camera
              coverage, Full Crew for network-grade productions. Or build your own crew à la
              carte below.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {FILM_PRODUCTION_TIERS.map((tier) => (
                <PricingTier key={tier.name} {...tier} href="/contact" />
              ))}
            </div>
          </div>
        </section>

        <section id="crew-rates" className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">À LA CARTE · CREW DAY RATES</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Build your own crew. Every role priced transparently per 10-hour day. DFW local,
              right-to-work, non-union (IATSE-adjacent by request).
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {FILM_PRODUCTION_CREW.map((role) => (
                <div
                  key={role.name}
                  className="flex flex-col border border-bone/15 bg-gunpowder/80 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg italic">{role.name}</h3>
                    <div className="font-serif text-xl text-brass">{role.price}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-muted">{role.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="kits" className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">À LA CARTE · CAMERA &amp; LIGHTING</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Sony FX3 and A7S III — same sensor family as the Netflix-approved FX6, S-Log3, 4K
              120p, DaVinci pipeline. Small lighting is our owned SmallRig kit; mid and large are
              transparent rental pass-through.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {FILM_PRODUCTION_KITS.map((kit) => (
                <div
                  key={kit.name}
                  className="flex flex-col border border-bone/15 bg-gunpowder/80 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg italic">{kit.name}</h3>
                    <div className="font-serif text-xl text-brass">{kit.price}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-muted">{kit.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="logistics" className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">LOGISTICS &amp; ADD-ONS</DataLabel>
            <p className="mb-10 max-w-2xl text-bone-muted">
              Standard production-industry conventions, published openly. Overtime, travel, and
              per-diem line items every line producer expects to see on a quote.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {FILM_PRODUCTION_LOGISTICS.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col border border-bone/15 bg-gunpowder/80 p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg italic">{item.name}</h3>
                    <div className="font-serif text-xl text-brass">{item.price}</div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-bone-muted">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="insurance" className="scroll-mt-32 border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <DataLabel className="mb-3">INSURANCE · COVERAGE &amp; COI POLICY</DataLabel>
            <p className="mb-10 max-w-3xl text-bone-muted">
              Production insurance billed transparently per shoot day — no hidden markup, no
              mystery fees. Equipment coverage is always on us. Upgraded network-grade limits
              available on request.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">PER-PRODUCTION INSURANCE</DataLabel>
                <h3 className="font-serif text-2xl italic">$175–$295 / shoot day</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Covers $1M per occurrence / $2M aggregate general liability plus workers&apos;
                  comp for the shoot day. Pass-through pricing — Solo Day $175, B-Cam Day $225,
                  Full Crew Day $295. Your production pays actual cost; we don&apos;t mark it up.
                  $2M / $4M network-grade upgrade available (+$100–$150/day).
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">EQUIPMENT COVERAGE</DataLabel>
                <h3 className="font-serif text-2xl italic">Always included</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Semper Fi Media carries year-round inland marine coverage on all owned cameras,
                  lighting, audio, and grip gear. Your production doesn&apos;t pay extra for gear
                  protection — that&apos;s on us.
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">WORKERS&apos; COMP</DataLabel>
                <h3 className="font-serif text-2xl italic">Included on crewed shoots</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Workers compensation coverage bundled into the per-production policy on every
                  shoot day we crew. No additional pass-through, no mystery fee, no production
                  that walks away uncovered.
                </p>
              </div>

              <div className="flex flex-col border border-bone/15 bg-gunpowder/80 p-8">
                <DataLabel className="mb-3">COI CERTIFICATES</DataLabel>
                <h3 className="font-serif text-2xl italic">Free · 24-hour turnaround</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone-muted">
                  Additional-insured certificates issued within 24 hours of booking confirmation
                  with zero admin fee. Most DFW shops charge $25–$75 per cert. We don&apos;t —
                  producing a piece of paper shouldn&apos;t be a profit center.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">
              Networks, agencies, production companies.
            </h2>
            <p className="mt-6 text-lg text-bone-muted">
              Hiring DFW crew? Book a 15-minute production call. Tell us the scope, dates, and
              scale — we&apos;ll quote a crew, a kit, and an insurance line transparently.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Production Call →</BrassButton>
              <BrassButton href="/pricing" variant="outline">
                See Overall Pricing Hub
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
