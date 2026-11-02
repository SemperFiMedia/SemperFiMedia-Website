import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';
import { ServiceJsonLd, BreadcrumbJsonLd } from '@/components/seo/structured-data';
import { CaseStudyTile } from '@/components/home/case-study-tile';
import { FilmmakingTabs } from '@/components/filmmaking/filmmaking-tabs';
import { getCaseStudiesInCategories } from '@/sanity/queries';
import type { CaseStudyCategory } from '@/sanity/types';

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: '/filmmaking' },
  title: 'Filmmaking Dallas — Movie Production, Short Films, Documentaries, Interviews',
  description:
    'Semper Fi Media filmmaking in Dallas–Fort Worth. On-set movie production, short films like the DallasWood series, documentaries, and sit-down interviews, shot and cut by a Marine-led crew.',
};

const TABS: { id: string; label: string; category: CaseStudyCategory; empty: string; ask: string }[] = [
  {
    id: 'movie-production',
    label: 'Movie Production',
    category: 'movie-production',
    empty: 'Feature and on-set production work is being added.',
    ask: 'Planning a movie shoot?',
  },
  {
    id: 'short-films',
    label: 'Short Films',
    category: 'short-film',
    empty: 'Short films are being added.',
    ask: 'Have a short film in mind?',
  },
  {
    id: 'documentaries',
    label: 'Documentaries',
    category: 'documentary',
    empty: 'No documentaries posted yet.',
    ask: 'Have a documentary in mind?',
  },
  {
    id: 'interviews',
    label: 'Interviews',
    category: 'interview',
    empty: 'No interviews posted yet.',
    ask: 'Need interviews filmed?',
  },
];

export default async function FilmmakingPage() {
  const films = await getCaseStudiesInCategories(TABS.map((t) => t.category));

  const tabs = TABS.map((tab) => {
    const items = films.filter((cs) => cs.category === tab.category);
    return {
      id: tab.id,
      label: tab.label,
      count: items.length,
      content:
        items.length === 0 ? (
          <div className="rounded border border-bone/10 px-6 py-16 text-center">
            <p className="text-bone-muted">{tab.empty}</p>
            <p className="mt-2 text-bone-muted">
              {tab.ask}{' '}
              <Link href="/contact" className="text-brass underline">
                Let&apos;s talk
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((caseStudy, index) => (
              <CaseStudyTile key={caseStudy._id} caseStudy={caseStudy} index={index} />
            ))}
          </div>
        ),
    };
  });

  return (
    <>
      <Nav />
      <ServiceJsonLd
        name="Filmmaking Dallas"
        description="Movie production, short films, documentaries, and interviews in Dallas–Fort Worth."
        url="https://semperfimedia.llc/filmmaking"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', href: '/' },
        { name: 'Filmmaking', href: '/filmmaking' },
      ]} />
      <main>
        <section className="bg-gradient-to-br from-gunpowder via-dusk-teal to-black px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">FILMMAKING · DFW</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Films with
              <br />
              a story to tell.
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-bone-muted">
              Movie sets, short films, documentaries, and sit-down interviews. From the
              DallasWood series to on-set work for film productions, every frame is shot and
              cut with the same Marine discipline we bring to every job.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BrassButton href="/contact">Talk about your film</BrassButton>
              <BrassButton href="/film-production" variant="outline">
                Crew day rates
              </BrassButton>
            </div>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <FilmmakingTabs tabs={tabs} />
          </div>
        </section>

        <section className="bg-black px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-4xl italic md:text-5xl">Making a film?</h2>
            <p className="mt-6 text-lg text-bone-muted">
              Free 30-minute discovery call. Tell us the story, the schedule, and the crew you
              need. We&apos;ll build the plan and quote it transparently.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
              <BrassButton href="/film-production" variant="outline">
                See crew day rates
              </BrassButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
