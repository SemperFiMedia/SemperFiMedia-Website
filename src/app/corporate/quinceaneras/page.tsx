import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd, BreadcrumbJsonLd } from '@/components/seo/structured-data';
import { NicheFeaturedWork } from '@/components/niche/featured-work';
import { getCaseStudiesByCategory } from '@/sanity/queries';

export const metadata: Metadata = {
  title: 'Quinceañera Videographer Dallas — Cinematic Quinces in DFW',
  description:
    'Dallas–Fort Worth quinceañera videography. Cinema-grade quince films, father-daughter dance coverage, court choreography, and social reels. Marine-led craft at independent operator pricing.',
};

const WHO = [
  'Quinceañeras across the Dallas–Fort Worth metroplex',
  'Families planning traditional or modern quinces',
  'Multi-venue days (Mass → reception → after-party)',
  'Full court choreography and surprise dance reveal coverage',
  'Bilingual families — filmmakers who respect the tradition and the language',
  'Destination quinces (Texas, regional Mexico, beyond) — quoted separately',
];

const WHY = [
  {
    title: 'We understand the tradition.',
    body: "The changing of the shoes, the vals, the court, the surprise dance, the toast — these aren't just scenes on a shot list. They're the whole reason the film exists. We know what to protect and when to step back.",
  },
  {
    title: 'Cinema craft, not event-videographer workflow.',
    body: 'Your quinceañera film should feel like a cinema wedding — cinematic lenses, careful color, real music licensing. Not a highlight reel cut over a pop song. We treat a quince the same way we treat our signature wedding tier.',
  },
  {
    title: 'Social reels that make the cousins share.',
    body: 'Hero film for the family. Vertical social reels for the quinceañera. The fifteen-year-old wants something to post the next morning — we build that into every package.',
  },
  {
    title: 'Scalable coverage for the day.',
    body: 'Standard quince runs solo-operator with a second angle locked off. Larger days with surprise dance reveals, multi-venue logistics, or extended receptions scale up to a full crew.',
  },
];

export default async function QuinceanerasPage() {
  const featured = await getCaseStudiesByCategory('quinceanera', 4);
  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Quinceañera Videographer Dallas"
        description="Cinematic quinceañera videography in Dallas–Fort Worth. Cinema-grade quince films covering the Mass, court choreography, surprise dance, and reception."
        url="https://www.semperfimedia.llc/corporate/quinceaneras"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Corporate', href: '/corporate' },
        { name: 'Quinceañeras', href: '/corporate/quinceaneras' },
      ]} />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">SERVICE · QUINCEAÑERAS</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              A film worthy
              <br />
              of the day
              <br />
              she turns fifteen.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Cinema-grade quinceañera videography for Dallas–Fort Worth families. Mass, court,
              vals, surprise dance, reception — every tradition captured the way the family
              will want to remember it, and the quinceañera will actually want to share.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Book a quinceañera</BrassButton>
              <BrassButton href="/pricing" variant="outline">
                See pricing
              </BrassButton>
            </div>
          </div>
        </section>

        <NicheFeaturedWork
          eyebrow="QUINCEAÑERA WORK · DFW"
          heading="Recent quinces, the way they actually happened."
          caseStudies={featured}
        />

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <DataLabel className="mb-5">WHO WE WORK WITH</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Families who take the day seriously.
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
              <DataLabel className="mb-5">WHY SEMPER FI FOR YOUR QUINCE</DataLabel>
              <h2 className="font-serif text-3xl italic md:text-4xl">
                Respect for tradition. Cinema-grade finish.
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
              Date on the calendar?
            </h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Bring the date, the venue, the vision — we&apos;ll
              build the coverage plan and lock the date.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/work" variant="outline">
                See Quince Work
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
