import { SectionHeader } from '@/components/section-header/section-header';
import { CaseStudyTile } from './case-study-tile';
import type { CaseStudy } from '@/sanity/types';

type Props = {
  caseStudies: CaseStudy[];
};

export function FeaturedWork({ caseStudies }: Props) {
  return (
    <section className="bg-gunpowder px-6 py-20 md:px-12 md:py-28" aria-label="Featured work">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeader
          label="RECENT WORK · 2023 – 2026"
          title="Selected Films"
          action={{ href: '/work', label: 'View All Work' }}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((caseStudy, index) => (
            <CaseStudyTile key={caseStudy._id} caseStudy={caseStudy} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
