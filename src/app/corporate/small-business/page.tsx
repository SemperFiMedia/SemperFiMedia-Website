import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: 'Small Business Video Production Dallas — Brand Films from $1,500',
  description:
    'Dallas small business video production. Cinema-grade brand films for restaurants, law firms, med spas, trades, and independent retailers. Big-agency polish at independent operator pricing. Starting at $1,500.',
};

const WHO = [
  'Dallas-area restaurants, bars, and hospitality',
  'Med spas, aesthetics clinics, dental practices, wellness studios',
  'Law firms, financial advisors, and professional services',
  'Trades: HVAC, flooring, contractors, custom fabrication',
  'Independent retail, salons, boutique fitness, specialty shops',
  'SaaS founders and DFW startups needing their first real brand film',
];

const WHY = [
  {
    title: 'Published pricing, no mystery.',
    body: 'Brand films start at $1,500. Full-day shoots run $3,500. Custom productions are quoted transparently after a discovery call. No "enterprise pricing" games.',
  },
  {
    title: 'The cinematic polish agencies charge $15k for.',
    body: "Sony FX3 cinema rigs, cinema primes, full audio and lighting kit on every shoot. We color grade to your brand — not to a generic template.",
  },
  {
    title: 'Built for independent operators.',
    body: "We understand small-business cash flow. We won't pitch you a $20k retainer when a one-time $3,500 film solves the problem. We scope the work to what you actually need.",
  },
  {
    title: 'One owner-operator across every project.',
    body: "TJ runs discovery, production, and post on every job. You don't get handed to a junior, bounced to a producer, or stuck in agency ticket queues.",
  },
];

export default function SmallBusinessPage() {
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Small Business Video Production Dallas"
        description="Cinema-grade brand films, commercials, and storytelling videos for Dallas–Fort Worth small businesses. Starting at $1,500. No agency markup."
        url="https://www.semperfimedia.llc/corporate/small-business"
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · SMALL BUSINESS</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Big-agency
              <br />
              polish.
              <br />
              Independent
              <br />
              operator pricing.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Cinema-grade brand films, commercials, and storytelling video for Dallas
              restaurants, trades, law firms, med spas, and independent retailers. Built by a
              Marine who knows you didn't start a business to write $15,000 video checks.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book a brand film</BrassButton>
              <BrassButton href="/pricing" variant="outline">
                See pricing
              </BrassButton>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">WHO WE WORK WITH</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                The businesses keeping Dallas independent.
              </h2>
              <ul className="mt-6 space-y-3 text-bone-muted">
                {WHO.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-brass">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <DataLabel className="mb-5">WHY SEMPER FI FOR YOUR BRAND</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Cinema craft. Real pricing. One call.
              </h2>
              <div className="mt-6 space-y-5">
                {WHY.map((item) => (
                  <div key={item.title}>
                    <h3 className="font-serif text-xl italic">{item.title}</h3>
                    <p className="mt-1 text-bone-muted leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">
              Tell us about the business.
            </h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Bring the story, the goals, the budget — we'll tell
              you exactly what we'd do with them.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/work" variant="outline">
                See Brand Work
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
