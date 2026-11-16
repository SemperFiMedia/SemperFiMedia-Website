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

const TITLE = 'DJ, Club & Live Music Videographer in Dallas–Fort Worth';
const DESCRIPTION =
  'DJ sets, club nights and concerts filmed in Dallas–Fort Worth. Recap reels, vertical social cuts and multi-camera coverage, with clean audio off the board.';

export const metadata: Metadata = {
  alternates: { canonical: '/corporate/dj-events' },
  // Already 55 characters; the brand suffix would push it past what Google shows.
  title: { absolute: TITLE },
  description: DESCRIPTION,
};

const WHO = [
  'DJ sets, residencies and club nights',
  'Concerts and live bands, from bar stages to theaters',
  'Festivals and outdoor stages',
  'Album release shows and listening parties',
  'Promoters who need a recap video for the next flyer',
  'Artists who want the set, the crowd and backstage from one night',
];

const DELIVER = [
  {
    title: 'A recap reel cut to the music.',
    body: 'The hero cut is built on the beat, not laid over it. It is the video a venue or promoter asks to see when you pitch the next date.',
  },
  {
    title: 'Vertical cuts for Reels, TikTok and Shorts.',
    body: 'We shoot with the 9:16 crop in mind, so the vertical version is framed on purpose and is not a slice of a wide shot. Social cutdowns are included on Brand Film and can be added to any job.',
  },
  {
    title: 'Audio off the board.',
    body: 'Phone audio is why most live clips are unwatchable. We take a feed from the DJ mixer or the front-of-house board, record the room on a second track, and mix the two.',
  },
  {
    title: 'Cameras that see in the dark.',
    body: 'Club light is the look. Cinema cameras that hold a clean image in a dark room mean we do not wash out your dance floor with a video light.',
  },
  {
    title: 'One operator or a multi-camera crew.',
    body: 'A club night usually runs with one operator moving through the room. A concert or festival stage scales to locked-off wide shots plus roaming cameras. You pay for the coverage the show needs.',
  },
];

const FAQS = [
  corporateCostFaq('a DJ or concert recap video'),
  {
    q: 'What do we get?',
    a: 'A finished recap film, color graded and mixed: 60–90 seconds on Spotlight, 2–3 minutes on Brand Film. Vertical 9:16 cuts for Reels, TikTok and Shorts come with Brand Film and can be added to any job.',
  },
  {
    q: 'Can you use our music in the video?',
    a: 'Yes, if you own it or have the rights to it. A DJ set is mostly other artists’ music, and platforms can mute or block it, so for mixes we plan the edit around a track you can clear or a licensed one.',
  },
  TRAVEL_FAQ,
  BOOKING_FAQ,
  REVIEW_FAQ,
];

export default async function DjEventsPage() {
  const featured = await getCaseStudiesByCategory('events', 4, { newestFirst: true });
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name={TITLE}
        serviceType="DJ, concert and live music videography"
        description={DESCRIPTION}
        url="https://semperfimedia.llc/corporate/dj-events"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Corporate', href: '/corporate' },
          { name: 'DJ & Live Music', href: '/corporate/dj-events' },
        ]}
      />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · DJ, CLUB &amp; LIVE MUSIC</DataLabel>
            <h1 className="max-w-4xl font-serif text-4xl italic leading-[1.05] md:text-6xl">
              {TITLE}
            </h1>
            <p className="mt-5 font-serif text-2xl italic text-brass md:text-3xl">
              The set lasted two hours. The video books the next one.
            </p>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              DJ recap videos, club night recaps and concert videography for Dallas–Fort Worth
              artists, promoters and venues. We film the set, the crowd and the room, and cut it
              for the feed your next booking will look at.
            </p>
            <p className="mt-6 max-w-2xl text-sm text-bone-muted">
              <span className="text-brass">From {formatPrice(corporateStartingPrice())}.</span>{' '}
              Delivered on the Corporate tiers — {corporateTierPhrase()}.{' '}
              <Link href="/pricing#corporate" className="text-brass underline">
                See full pricing
              </Link>
              . Need a full music video instead?{' '}
              <Link href="/corporate/music-videos" className="text-brass underline">
                That is a different job
              </Link>
              .
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book live music coverage</BrassButton>
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
                DJ sets, club nights, concerts and festivals.
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
                Recap reels, social cuts, real audio.
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

        <HowItWorks shootDay="We load in before doors, patch into the board, and film the set, the crowd and the room for the whole coverage window." />

        <FieldNotes category="events" />

        <FaqSection
          eyebrow="DJ & LIVE MUSIC FAQ"
          heading="What artists and promoters ask first."
          items={FAQS}
        />

        <ServingArea eventType="DJ sets, club nights and concerts" />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">Got a date on the calendar?</h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Tell us the venue, the set times and where the video
              has to live — we&apos;ll build the coverage plan and quote it in writing.
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
