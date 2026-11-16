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
import { corporateStartingPrice, formatPrice } from '@/lib/corporate';
import { REVIEW_FAQ, TRAVEL_FAQ } from '@/lib/event-faqs';

const TITLE = 'Arena, Coliseum & Stadium Event Video Production in Dallas';
const DESCRIPTION =
  'Multi-camera video production for arena, coliseum and stadium events in Dallas–Fort Worth: stage and crowd coverage, sponsor highlight reels and recap films.';

export const metadata: Metadata = {
  alternates: { canonical: '/corporate/arena-events' },
  // Already 58 characters; the brand suffix would push it past what Google shows.
  title: { absolute: TITLE },
  description: DESCRIPTION,
};

const WHO = [
  'Coliseum and arena shows: concerts, tournaments, graduations, ceremonies',
  'Stadium events and game-day productions',
  'Sponsor and partner activations on the concourse',
  'Award nights and keynotes on a main stage',
  'Touring productions that need a local Dallas crew',
  'Organizers who need a recap film and sponsor reels from the same night',
];

const DELIVER = [
  {
    title: 'Multi-camera coverage, planned on paper first.',
    body: 'A big room needs a camera plot: a locked-off wide, a stage camera on a long lens, and roaming operators in the crowd and on the concourse. We draw it before load-in so every position has a job.',
  },
  {
    title: 'Sponsor highlight reels.',
    body: 'Sponsors renew when they can see their name in the room. We film signage, activations and on-stage mentions on purpose, and cut each sponsor a short reel they can post.',
  },
  {
    title: 'The stage and the crowd.',
    body: 'The stage is half the story. The other half is the crowd reacting to it. Both get a dedicated camera, so the recap feels like being in the building.',
  },
  {
    title: 'Credentials, load-in and insurance handled.',
    body: 'Arenas run on rules: credential lists, dock times, approved camera positions, house-crew boundaries. We work inside them, send the crew list early, and get the venue a certificate of insurance before load-in.',
  },
  {
    title: 'Audio from the house feed.',
    body: 'We take program audio from the house board and record the room on separate tracks, so speeches are clear and the crowd still sounds like a crowd.',
  },
];

const FAQS = [
  {
    q: 'How much does arena event video production cost?',
    a: `It is custom quoted after a free 30-minute discovery call, because crew size, camera positions and hours change with the venue and the run of show. Single-operator event coverage starts on our Corporate tiers, from ${formatPrice(corporateStartingPrice())}; an arena is usually a full multi-camera crew.`,
  },
  {
    q: 'Can you provide a certificate of insurance?',
    a: 'Yes. Production insurance is arranged for the event and a certificate of insurance goes to the venue before load-in. The cost is itemized in the quote at actual cost, with no markup.',
  },
  {
    q: 'What do we get?',
    a: 'A recap film of the event, sponsor highlight reels, and vertical cuts for social, all from the same coverage. The exact list goes in the quote before you sign.',
  },
  TRAVEL_FAQ,
  {
    q: 'How far ahead should we book?',
    a: 'As soon as the date is on the venue calendar. Credential and camera-position requests have their own deadlines, so earlier is better. The 30-minute discovery call is free whether or not you book.',
  },
  REVIEW_FAQ,
];

export default async function ArenaEventsPage() {
  const featured = await getCaseStudiesByCategory('events', 4, { newestFirst: true });
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name={TITLE}
        serviceType="Arena, coliseum and stadium event video production"
        description={DESCRIPTION}
        url="https://semperfimedia.llc/corporate/arena-events"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Corporate', href: '/corporate' },
          { name: 'Arena Events', href: '/corporate/arena-events' },
        ]}
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · ARENA, COLISEUM &amp; STADIUM</DataLabel>
            <h1 className="max-w-4xl font-serif text-4xl italic leading-[1.05] md:text-6xl">
              {TITLE}
            </h1>
            <p className="mt-5 font-serif text-2xl italic text-brass md:text-3xl">
              Big room. Every angle covered.
            </p>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Multi-camera event coverage for arenas, coliseums and stadiums in Dallas–Fort Worth
              and across Texas. Stage, crowd and sponsors filmed by one crew, then cut into a recap
              film and the highlight reels your partners ask for.
            </p>
            <p className="mt-6 max-w-2xl text-sm text-bone-muted">
              <span className="text-brass">Custom quoted.</span> Arena work is a Full Production
              job, priced after a free 30-minute discovery call.{' '}
              <Link href="/pricing#corporate" className="text-brass underline">
                See how we price
              </Link>
              . Hiring local crew for a touring show?{' '}
              <Link href="/film-production" className="text-brass underline">
                Day rates are published
              </Link>
              .
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book arena coverage</BrassButton>
              <BrassButton href="/pricing" variant="outline">
                See pricing
              </BrassButton>
            </div>
          </div>
        </section>

        <NicheFeaturedWork
          eyebrow="LIVE EVENT WORK · DFW"
          heading="Recent events covered."
          caseStudies={featured}
        />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">BUILT FOR</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Coliseum, arena and stadium events.
              </h2>
              <ul className="mt-6 space-y-3 text-bone-muted">
                {WHO.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="text-brass">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-bone-muted">
                Running a convention or a conference instead? See{' '}
                <Link href="/corporate/conventions" className="text-brass underline">
                  convention and conference coverage
                </Link>
                .
              </p>
            </div>
            <div>
              <DataLabel className="mb-5">WHAT WE DELIVER</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Multi-camera coverage and sponsor reels.
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

        <HowItWorks shootDay="Crew call and load-in on the venue's schedule, cameras on their plotted positions, audio from the house feed, and one lead calling coverage for the whole show." />

        <FieldNotes category="events" />

        <FaqSection
          eyebrow="ARENA EVENT FAQ"
          heading="What organizers ask first."
          items={FAQS}
        />

        <ServingArea eventType="arena, coliseum and stadium events" />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">Date on the venue calendar?</h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Tell us the venue, the run of show and who the video
              is for — we&apos;ll build the camera plan and quote it in writing.
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
