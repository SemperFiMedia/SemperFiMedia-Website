import type { Metadata } from 'next';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { CaseStudyTile } from '@/components/home/case-study-tile';
import { getAllCaseStudies } from '@/sanity/queries';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Work — Films & Case Studies',
  description:
    'Selected films from Semper Fi Media. Corporate videos, cinema weddings, music videos, and tactical brand work across Dallas–Fort Worth.',
};

export default async function WorkPage() {
  const caseStudies = await getAllCaseStudies();

  return (
    <>
      <Nav />
      <main>
        <section className="bg-gradient-to-br from-gunpowder to-dusk-teal px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-6">ARCHIVE · ALL WORK</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">
              Selected Films.
            </h1>
          </div>
        </section>

        <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            {caseStudies.length === 0 ? (
              <p className="text-center text-bone-subtle">New case studies landing soon.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {caseStudies.map((caseStudy, index) => (
                  <CaseStudyTile key={caseStudy._id} caseStudy={caseStudy} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
