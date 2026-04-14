import Link from 'next/link';
import Image from 'next/image';
import { urlForImage } from '@/sanity/image';
import { DataLabel } from '@/components/primitives/data-label';
import type { CaseStudy } from '@/sanity/types';

const CATEGORY_LABELS: Record<CaseStudy['category'], string> = {
  tactical: 'TACTICAL',
  faith: 'FAITH & COMMUNITY',
  'small-business': 'SMALL BUSINESS',
  music: 'MUSIC VIDEO',
  wedding: 'WEDDING',
  'real-estate': 'REAL ESTATE',
  tv: 'TV / BROADCAST',
};

type Props = {
  caseStudy: CaseStudy;
  index: number;
};

function resolvePosterUrl(caseStudy: CaseStudy): string | null {
  if (caseStudy.posterUrl) return caseStudy.posterUrl;
  if (!caseStudy.poster) return null;
  const builder = urlForImage(caseStudy.poster);
  return builder ? builder.width(1200).height(675).url() : null;
}

export function CaseStudyTile({ caseStudy, index }: Props) {
  const posterUrl = resolvePosterUrl(caseStudy);
  const paddedIndex = String(index + 1).padStart(2, '0');
  const href = caseStudy.isPlaceholder ? '/work' : `/work/${caseStudy.slug.current}`;

  return (
    <Link
      href={href}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-dusk-teal to-texas-umber">
        {posterUrl && (
          <Image
            src={posterUrl}
            alt={caseStudy.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
        <DataLabel className="absolute left-3 top-3 text-[10px]">
          {paddedIndex} · {CATEGORY_LABELS[caseStudy.category]}
        </DataLabel>
        <div className="absolute inset-x-3 bottom-3 font-serif text-lg italic md:text-xl">
          {caseStudy.title}
        </div>
      </div>
      <DataLabel tone="muted" className="mt-3 text-[10px]">
        {caseStudy.client}
      </DataLabel>
    </Link>
  );
}
