import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd, BreadcrumbJsonLd } from '@/components/seo/structured-data';
import { FaqSection } from '@/components/seo/faq-section';
import { ServingArea } from '@/components/seo/serving-area';
import { NicheFeaturedWork } from '@/components/niche/featured-work';
import { HowItWorks } from '@/components/niche/how-it-works';
import { FieldNotes } from '@/components/blog/field-notes';
import { getCaseStudiesByCategory } from '@/sanity/queries';
import { corporateStartingPrice, corporateTierPhrase, formatPrice } from '@/lib/corporate';
import { BOOKING_FAQ, REVIEW_FAQ, TRAVEL_FAQ, corporateCostFaq } from '@/lib/event-faqs';

const TITLE = 'Gala, Fundraiser & Church Event Videographer in DFW';
const DESCRIPTION =
  'Gala, fundraiser and church event video in Dallas–Fort Worth. Clean speech audio, a recap film for your donors, and an appeal video ready for next year.';

export const metadata: Metadata = {
  alternates: { canonical: '/corporate/galas-and-fundraisers' },
  // Already 51 characters; the brand suffix would push it past what Google shows.
  title: { absolute: TITLE },
  description: DESCRIPTION,
};

const WHO = [
  'Nonprofit galas, benefit dinners and award nights',
  'Fundraisers, auctions and donor appreciation events',
  'Church events: anniversaries, conferences, baptisms, holiday services',
  'School banquets, graduations and booster events',
  'Veteran and first-responder organization dinners',
  'Capital campaign kickoffs and annual meetings',
];

const DELIVER = [
  {
    title: 'Every word of the program, clean.',
    body: 'The speeches are why the room is there. We put a microphone on the podium and the emcee, take a feed from the house board, and record both, so no testimony is lost to a bad channel.',
  },
  {
    title: 'A recap film for your donors.',
    body: 'A short film of the night, sent with the thank-you letter, shows the people who gave what their table paid for. It also shows the people who missed it what they missed.',
  },
  {
    title: 'Footage for next year’s appeal.',
    body: 'Interviews with honorees and the people you serve, filmed the same night, become the video that opens next year’s event. One night of filming, two jobs done.',
  },
  {
    title: 'Quiet in the room.',
    body: 'No lights in a guest’s face and no crew crossing in front of the stage during a prayer or a speech. A dinner program is filmed from the edges.',
  },
  {
    title: 'A price your board sees up front.',
    body: 'Our rates are published, so the number is in front of your board or finance committee before the first call. Larger productions are quoted in writing.',
  },
];

const FAQS = [
  corporateCostFaq('a gala or fundraiser video'),
  {
    q: 'What do we get?',
    a: 'A finished recap film of the event, color graded with licensed music: 60–90 seconds on Spotlight, 2–3 minutes on Brand Film. Full recordings of the speeches and vertical cuts for social can be added to the quote.',
  },
  {
    q: 'Can you film interviews during the event?',
    a: 'Yes. Give us a quiet corner and about fifteen minutes per person, and put the interviews on the run of show so honorees are not pulled away at the wrong moment.',
  },
  TRAVEL_FAQ,
  BOOKING_FAQ,
  REVIEW_FAQ,
];

export default async function GalasAndFundraisersPage() {
  const featured = await getCaseStudiesByCategory('faith', 4, { newestFirst: true });
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name={TITLE}
        serviceType="Gala, fundraiser and church event videography"
        description={DESCRIPTION}
        url="https://semperfimedia.llc/corporate/galas-and-fundraisers"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Corporate', href: '/corporate' },
          { name: 'Galas & Fundraisers', href: '/corporate/galas-and-fundraisers' },
        ]}
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · GALAS, FUNDRAISERS &amp; CHURCH EVENTS</DataLabel>
            <h1 className="max-w-4xl font-serif text-4xl italic leading-[1.05] md:text-6xl">
              {TITLE}
            </h1>
            <p className="mt-5 font-serif text-2xl italic text-brass md:text-3xl">
              One night raises the money. The film keeps raising it.
            </p>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Gala, fundraiser and church event videography for nonprofits, ministries and schools
              across Dallas–Fort Worth. The program recorded clean, the room filmed with respect,
              and a recap your donors will watch to the end.
            </p>
            <p className="mt-6 max-w-2xl text-sm text-bone-muted">
              <span className="text-brass">From {formatPrice(corporateStartingPrice())}.</span>{' '}
              Delivered on the Corporate tiers — {corporateTierPhrase()}.{' '}
              <Link href="/pricing#corporate" className="text-brass underline">
                See full pricing
              </Link>
              . Need a mission or testimony film instead?{' '}
              <Link href="/corporate/faith-and-community" className="text-brass underline">
                See Faith &amp; Community
              </Link>
              .
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book event coverage</BrassButton>
              <BrassButton href="/pricing" variant="outline">
                See pricing
              </BrassButton>
            </div>
          </div>
        </section>

        <NicheFeaturedWork
          eyebrow="FAITH & COMMUNITY WORK · DFW"
          heading="Recent events covered."
          caseStudies={featured}
        />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">BUILT FOR</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Galas, fundraisers and church events.
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
              <DataLabel className="mb-5">WHAT WE DELIVER</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                The program, the room, and next year&apos;s appeal.
              </h2>
              <div className="mt-6 space-y-5">
                {DELIVER.map((item) => (
                  <div key={item.title}>
                    <h3 className="font-serif text-xl italic">{item.title}</h3>
                    <p className="mt-1 leading-relaxed text-bone-muted">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <HowItWorks shootDay="We arrive before your guests, mic the podium and the emcee, and film the room, the program and the people from the first arrival to the last table." />

        <FieldNotes category="events" />

        <FaqSection
          eyebrow="GALA & FUNDRAISER FAQ"
          heading="What event chairs ask first."
          items={FAQS}
        />

        <ServingArea eventType="galas, fundraisers and church events" />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">Event date set?</h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Tell us the date, the venue and what the film has to
              do for your mission — we&apos;ll build the coverage plan and quote it in writing.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/work" variant="outline">
                See the Work
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
