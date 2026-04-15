import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd } from '@/components/seo/structured-data';
import { NicheFeaturedWork } from '@/components/niche/featured-work';
import { TestimonialsGrid } from '@/components/social-proof/testimonials-grid';
import { WeddingConfigurator } from '@/components/weddings/wedding-configurator';
import { ProposalForm } from '@/components/weddings/proposal-form';
import { getCaseStudiesByCategory, getAllTestimonials } from '@/sanity/queries';

export const metadata: Metadata = {
  title: 'Netflix Documentary Wedding Films Dallas — Cinema Wedding Videography',
  description:
    'Your wedding day, filmed like a Netflix documentary. Marine-led cinema wedding videography in Dallas–Fort Worth and destination. Three packages from $3,500 — full transparency, no hidden fees.',
};

const PROCESS = [
  {
    n: '01',
    title: 'Discovery Call',
    body: 'A free 30-minute call. We map the day — venue, ceremony, key family, the moments you can\'t miss. No pressure, no upsell. You leave with a plan.',
  },
  {
    n: '02',
    title: 'Film Day',
    body: 'TJ leads the crew. Cinema cameras, documentary craft, zero interruptions to your day. We work the room like guests, not paparazzi. The film is built while you live the day.',
  },
  {
    n: '03',
    title: 'The Story',
    body: 'Your wedding edited like a Netflix documentary — real moments, intimate pacing, soundtrack-driven. Delivered in 4–8 weeks. Replayed for 50 years.',
  },
];

const FAQ = [
  {
    q: 'How far in advance should we book?',
    a: 'For peak Texas wedding season (March–June, September–November), book 6–9 months out. Off-peak weddings can sometimes be booked 2–3 months out. The discovery call is free regardless of date.',
  },
  {
    q: 'Do you travel for destination weddings?',
    a: 'Yes. Destination weddings outside Dallas–Fort Worth are quoted with travel, lodging, and any per diem. We\'ve filmed in Texas, regional Mexico, and beyond. Tell us where on the discovery call.',
  },
  {
    q: 'How long until we get our film?',
    a: 'Standard delivery is 4–8 weeks for the cinematic highlight. The Heirloom tier includes a 48-hour social teaser so you have something to share immediately. Rush delivery is available for an added fee.',
  },
  {
    q: 'Will we get the raw footage?',
    a: 'Raw footage is available as an add-on ($250 hard drive) or as part of a full Raw Footage Buyout (priced to transfer all media rights). Most couples don\'t need the raw — but if you want it, we deliver it.',
  },
  {
    q: 'What if it rains?',
    a: 'We pivot. Cinema cameras handle weather, drone flies on the next clear window, and indoor backup plans get scoped on the discovery call. Texas weather doesn\'t kill weddings — bad planning does.',
  },
  {
    q: 'Do you film LGBTQ+ weddings?',
    a: 'Absolutely. Every couple, every story, full craft. Always Faithful means always.',
  },
  {
    q: 'What\'s the deposit?',
    a: '50% to lock the date. Remaining balance due one week before the wedding day. We accept ACH, card (industry-standard processing fee), or check.',
  },
  {
    q: 'Can we add packages or change tiers later?',
    a: 'Yes. Upgrades and add-ons are welcome up to 30 days before the wedding day. Bundle discounts apply when combining add-ons (Proposal + Engagement, Engagement + Wedding Teaser, etc.) — ask on the discovery call.',
  },
];

const WHY = [
  {
    title: 'Marine-led, owner-operator.',
    body: 'TJ is on every shoot — never handed off to a junior, never bounced through an account manager. United States Marine veteran. Every wedding handled with the respect we\'d give our own family.',
  },
  {
    title: 'Documentary-first, not highlight-reel.',
    body: 'We don\'t cut to pop-song templates. Your film is built like a short documentary — character, pacing, soundtrack, story arc. Netflix-style craft for a day worth that level of work.',
  },
  {
    title: 'Published pricing. No mystery invoicing.',
    body: 'Every tier and every add-on is published — no "request a quote" gatekeeping. What you read is what you pay. The only surprises are in your film.',
  },
  {
    title: 'Cinema-grade kit on every wedding.',
    body: 'Sony FX3 cinema cameras, cinema primes, lavs + boom audio, drone (where permitted), professional color grade. The same kit luxury studios charge $15k+ for — at independent operator pricing.',
  },
];

export default async function WeddingsPage() {
  const [featured, testimonials] = await Promise.all([
    getCaseStudiesByCategory('wedding', 4),
    getAllTestimonials(),
  ]);

  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Netflix Documentary Wedding Films Dallas"
        description="Marine-led cinema wedding videography in Dallas–Fort Worth and destination. Documentary-style wedding films from $3,500."
        url="https://www.semperfimedia.llc/weddings"
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">CINEMA WEDDINGS · DALLAS / DFW / DESTINATION</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Your wedding day,
              <br />
              filmed like a
              <br />
              Netflix documentary.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted md:text-xl">
              Cinema cameras. Real moments. The day rendered the way it actually felt — not a
              checklist highlight reel. Marine-led, owner-operator, transparently priced from
              $3,500.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book a Discovery Call</BrassButton>
              <BrassButton href="#films" variant="outline">
                See Wedding Films
              </BrassButton>
            </div>
          </div>
        </section>

        <section className="bg-black px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <DataLabel className="mb-6">THE #1 POST-WEDDING REGRET</DataLabel>
            <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
              The photos freeze the day.
              <br />
              <span className="text-brass">The film lets you live it again.</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-bone-muted">
              The most common regret couples have after the wedding isn&apos;t the venue, the dress,
              or the food. It&apos;s not having a film. Photos catch a moment. A film catches the
              day — your dad&apos;s face during the toast, the way your bridesmaid laughed at the
              speech, the first three notes of your first-dance song. Semper Fi Media films your
              wedding like a Netflix documentary. Real, intimate, cinematic.
            </p>
          </div>
        </section>

        <div id="films" />
        <NicheFeaturedWork
          eyebrow="WEDDING FILMS · DFW & DESTINATION"
          heading="Recent wedding work."
          caseStudies={featured}
        />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-4">YOUR WEDDING IN THREE STEPS</DataLabel>
            <h2 className="mb-12 font-serif text-4xl italic leading-tight md:text-5xl">
              Stress-free from discovery to delivery.
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {PROCESS.map((step) => (
                <div key={step.n} className="border-l border-brass/40 pl-6">
                  <div className="data-label text-brass">{step.n}</div>
                  <h3 className="mt-3 font-serif text-2xl italic">{step.title}</h3>
                  <p className="mt-3 text-bone-muted leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <WeddingConfigurator />

        <section
          className="border-t border-brass/15 bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 py-20 md:px-12 md:py-28"
          aria-label="Get a custom AI proposal"
        >
          <div className="mx-auto max-w-[900px]">
            <DataLabel className="mb-4 text-brass">AI-WRITTEN · DELIVERED IN 30 SECONDS</DataLabel>
            <h2 className="mb-4 font-serif text-4xl italic leading-tight md:text-5xl">
              Want a personalized proposal,
              <br />
              written for your day?
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-bone-muted">
              Tell us about your wedding in a few sentences. Our AI — trained on Semper Fi
              Media&apos;s pricing, packages, and brand voice — drafts a custom proposal in TJ&apos;s
              voice and emails it to your inbox. Tier recommendation, add-on suggestions, the
              specific moments we&apos;ll capture for you. Read it tonight, book the call tomorrow.
            </p>
            <ProposalForm />
          </div>
        </section>

        <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-4">WHY SEMPER FI MEDIA</DataLabel>
            <h2 className="mb-12 font-serif text-4xl italic leading-tight md:text-5xl">
              Built different. On purpose.
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {WHY.map((item) => (
                <div key={item.title}>
                  <h3 className="font-serif text-2xl italic">{item.title}</h3>
                  <p className="mt-3 text-bone-muted leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-brass/15 bg-gunpowder px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px]">
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

        <TestimonialsGrid
          testimonials={testimonials}
          eyebrow="MORE REVIEWS"
          heading="Real couples. Real reviews."
          limit={6}
        />

        <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px]">
            <DataLabel className="mb-4">WEDDING FAQ</DataLabel>
            <h2 className="mb-10 font-serif text-4xl italic leading-tight md:text-5xl">
              The questions every couple asks.
            </h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group border-b border-bone/10 pb-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl italic transition-colors hover:text-brass">
                    {item.q}
                    <span className="text-brass transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-bone-muted leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-texas-umber via-golden-hour to-bone px-6 py-20 text-gunpowder md:px-12 md:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-4xl italic leading-tight md:text-6xl">
              Let&apos;s film a wedding worth re-watching.
            </h2>
            <p className="mt-6 text-lg" style={{ color: '#2a1a08' }}>
              Free 30-minute discovery call. Bring the date, the venue, the vision — we&apos;ll
              build the coverage plan and lock the date.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
