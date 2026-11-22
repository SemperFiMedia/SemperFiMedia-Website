import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd, BreadcrumbJsonLd } from '@/components/seo/structured-data';
import { FaqSection } from '@/components/seo/faq-section';
import { ServingArea } from '@/components/seo/serving-area';
import { FieldNotes } from '@/components/blog/field-notes';
import { NicheFeaturedWork } from '@/components/niche/featured-work';
import { getCaseStudiesByCategory } from '@/sanity/queries';
import { BOOKING_FAQ, REVIEW_FAQ, TRAVEL_FAQ, corporateCostFaq } from '@/lib/event-faqs';
import { SESSION_CAPTURE_PRICE } from '@/lib/session-capture';
import { corporateStartingPrice, corporateTierPhrase, formatPrice } from '@/lib/corporate';

export const metadata: Metadata = {
  alternates: { canonical: '/corporate/conventions' },
  title: { absolute: 'Convention & Conference Videographer in Dallas–Fort Worth' },
  description:
    'Convention, conference and trade show video in Dallas–Fort Worth: recap reels, show-floor coverage, keynote recording and social cuts from one crew.',
};

const WHO = [
  'Horror, haunt, and dark arts conventions (Texas Haunters Convention, regional haunt industry events)',
  'Cosplay, anime, and pop culture cons (Otaku Odyssey, WeebCon, DFW and statewide)',
  'Comic cons, collectibles shows, and fan expos',
  'Gaming conventions, tabletop events, and esports tournaments',
  'Trade shows, industry expos, and professional conferences',
  'Recurring events that need a year-over-year recap reel for marketing',
];

const WHY = [
  {
    title: 'We understand the energy, because we film it every year.',
    body: "Convention coverage isn't a wedding. It's a crowd, a show floor, costumed attendees, vendor booths, and panels happening on three stages at once. We know how to read a floor, catch the atmosphere, and capture the moments your promoters will use to sell next year's tickets.",
  },
  {
    title: 'Recap reels cut for social, not just YouTube.',
    body: 'Your con recap has to live on Instagram, TikTok, and X if it\'s going to move tickets. Vertical social cuts come with Brand Film and can be added to any job, in the same color treatment and momentum as the hero recap.',
  },
  {
    title: 'Respect for attendees in costume.',
    body: "Cosplayers put enormous work into what they wear. We shoot them the way they deserve to be shot — with light, composition, and time — not as background B-roll. If they ask for their own footage back, we help them get it.",
  },
  {
    title: 'Scalable crew for the floor.',
    body: 'Small cons run solo-operator. Large cons (multi-stage, main-hall panel + show floor + celebrity signings) scale to a full crew with roaming shooters, wireless audio, and a board op. You pay for the coverage you actually need.',
  },
];

const FAQS = [
  corporateCostFaq('convention or conference video'),
  {
    q: 'Do you record keynotes and breakout sessions?',
    a: `Yes. A single session is a flat ${formatPrice(SESSION_CAPTURE_PRICE)} through Session Capture: 4K camera, audio off the house board, slides cut in. Coverage of the whole event is quoted on the Corporate tiers.`,
  },
  {
    q: 'Can an exhibitor hire you for booth video at a trade show?',
    a: 'Yes. Exhibitor and sponsor videos are quoted on the same Corporate tiers, and can be added to an organizer’s coverage or booked on their own.',
  },
  TRAVEL_FAQ,
  BOOKING_FAQ,
  REVIEW_FAQ,
];

// TJ's order for this page (Nov 22, 2026). The first one plays on the page; anything
// not listed follows, newest first.
const WORK_ORDER = [
  '2026-texas-haunters-convention',
  'vidsummit-2026',
  'otaku-odyssey-2026',
  'weebcon-2026',
];
const workRank = (slug: string) => {
  const i = WORK_ORDER.indexOf(slug);
  return i < 0 ? WORK_ORDER.length : i;
};

export default async function ConventionsPage() {
  const featured = (await getCaseStudiesByCategory('convention', 7, { newestFirst: true })).sort(
    (x, y) => workRank(x.slug.current) - workRank(y.slug.current),
  );
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Convention, Conference & Trade Show Videographer in Dallas–Fort Worth"
        serviceType="Convention, conference and trade show videography"
        description="Convention, conference and trade show coverage in Dallas–Fort Worth: recap reels, show-floor walkthroughs, keynote recording and social cuts."
        url="https://semperfimedia.llc/corporate/conventions"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Corporate', href: '/corporate' },
        { name: 'Conventions', href: '/corporate/conventions' },
      ]} />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · CONVENTIONS</DataLabel>
            <h1 className="max-w-4xl font-serif text-4xl italic leading-[1.05] md:text-6xl">
              Convention, Conference &amp; Trade Show Videographer in Dallas–Fort Worth
            </h1>
            <p className="mt-5 font-serif text-2xl italic text-brass md:text-3xl">
              The recap reel that sells next year&apos;s tickets.
            </p>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Convention, conference and trade show videography for Dallas–Fort Worth: horror
              cons, cosplay and anime cons, comic and pop culture expos, gaming events, industry
              conferences and expo floors. Cinematic recap footage that your promoters,
              exhibitors, and attendees will actually share.
            </p>
            <p className="mt-6 max-w-2xl text-sm text-bone-muted">
              <span className="text-brass">From {formatPrice(corporateStartingPrice())}.</span> Delivered on the Corporate
              tiers — {corporateTierPhrase()}.{' '}
              <Link href="/pricing#corporate" className="text-brass underline">
                See full pricing
              </Link>
              .
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book convention coverage</BrassButton>
              <BrassButton href="/pricing" variant="outline">
                See pricing
              </BrassButton>
            </div>
          </div>
        </section>

        <NicheFeaturedWork
          eyebrow="CONVENTION WORK · DFW"
          heading="Recent conventions covered."
          caseStudies={featured}
        />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">WHO WE COVER</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Events with real crowd energy.
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
              <DataLabel className="mb-5">WHY SEMPER FI FOR YOUR CON</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Show-floor discipline. Cinema-grade craft.
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

        <section className="border-t border-brass/15 bg-black px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-5">CONFERENCES · TRADE SHOWS · KEYNOTES</DataLabel>
            <h2 className="font-serif text-3xl italic md:text-4xl">
              Conference, trade show and keynote video in Dallas.
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
              <div>
                <h3 className="font-serif text-xl italic">Conference videography</h3>
                <p className="mt-2 leading-relaxed text-bone-muted">
                  General sessions, breakouts, networking and attendee interviews, cut into a
                  recap your marketing team can use to sell next year&apos;s registration.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl italic">Trade show videography</h3>
                <p className="mt-2 leading-relaxed text-bone-muted">
                  Show-floor coverage for organizers, plus booth and product videos for
                  exhibitors who want something to post while the show is still open.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl italic">Keynote recording</h3>
                <p className="mt-2 leading-relaxed text-bone-muted">
                  One talk, recorded properly: 4K camera, audio off the house board, slides cut
                  in. That is its own flat-rate service,{' '}
                  <Link href="/session-capture" className="text-brass underline">
                    Session Capture
                  </Link>
                  , from {formatPrice(SESSION_CAPTURE_PRICE)}.
                </p>
              </div>
            </div>
          </div>
        </section>

        <FieldNotes category="conventions" />

        <FaqSection eyebrow="CONVENTION & CONFERENCE FAQ" heading="What organizers ask first." items={FAQS} />

        <ServingArea eventType="conventions, conferences and trade shows" />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">
              Got a con date on the books?
            </h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Tell us the dates, the venue, the scope — we&apos;ll
              build the coverage plan and quote it transparently.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/work" variant="outline">
                See Convention Work
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
