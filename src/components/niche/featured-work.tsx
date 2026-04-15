import Link from 'next/link';
import Image from 'next/image';
import { CinematicVideo } from '@/components/media/cinematic-video';
import { DataLabel } from '@/components/primitives/data-label';
import { urlForImage } from '@/sanity/image';
import type { CaseStudy } from '@/sanity/types';

type Props = {
  eyebrow: string;
  heading: string;
  caseStudies: CaseStudy[];
};

export function NicheFeaturedWork({ eyebrow, heading, caseStudies }: Props) {
  const hero = caseStudies[0];
  if (!hero) return null;
  const rest = caseStudies.slice(1);
  const heroPoster = hero.poster
    ? urlForImage(hero.poster)?.width(1600).height(900).url() ?? undefined
    : undefined;

  return (
    <section
      className="bg-black px-6 py-20 md:px-12 md:py-28"
      aria-label={`${heading} — selected work`}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 md:mb-14">
          <DataLabel className="mb-4">{eyebrow}</DataLabel>
          <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">{heading}</h2>
        </div>

        <Link
          href={`/work/${hero.slug.current}`}
          className="group block"
          aria-label={`${hero.title} — view case study`}
        >
          {hero.muxPlaybackId ? (
            <CinematicVideo
              playbackId={hero.muxPlaybackId}
              title={hero.title}
              aspect="video"
              poster={heroPoster}
              className="rounded"
            />
          ) : (
            <div className="aspect-video rounded bg-gradient-to-br from-dusk-teal to-texas-umber" />
          )}
          <div className="mt-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <DataLabel tone="muted" className="text-[11px]">
                {hero.client}
              </DataLabel>
              <h3 className="mt-1 font-serif text-2xl italic md:text-3xl">{hero.title}</h3>
              {hero.summary && (
                <p className="mt-2 max-w-2xl text-bone-muted">{hero.summary}</p>
              )}
            </div>
            <span className="text-sm font-medium uppercase tracking-wider text-brass transition-colors group-hover:text-golden-hour">
              Watch the case study →
            </span>
          </div>
        </Link>

        {rest.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((cs) => {
              const tilePoster = cs.poster
                ? urlForImage(cs.poster)?.width(800).height(450).url() ?? undefined
                : undefined;
              return (
                <Link
                  key={cs._id}
                  href={`/work/${cs.slug.current}`}
                  className="group block"
                  aria-label={`${cs.title} — view case study`}
                >
                  {tilePoster ? (
                    <div className="relative aspect-video overflow-hidden rounded">
                      <Image
                        src={tilePoster}
                        alt={cs.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video rounded bg-gradient-to-br from-dusk-teal to-texas-umber" />
                  )}
                  <div className="mt-3">
                    <DataLabel tone="muted" className="text-[10px]">
                      {cs.client}
                    </DataLabel>
                    <p className="mt-1 font-serif text-lg italic">{cs.title}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
