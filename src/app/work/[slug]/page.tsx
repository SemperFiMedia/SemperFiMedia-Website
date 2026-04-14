import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { CinematicVideo } from '@/components/media/cinematic-video';
import { BrassButton } from '@/components/primitives/brass-button';
import { getCaseStudyBySlug, getAllCaseStudies } from '@/sanity/queries';
import { urlForImage } from '@/sanity/image';

type RouteProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const all = await getAllCaseStudies();
  return all.filter((cs) => !cs.isPlaceholder).map((cs) => ({ slug: cs.slug.current }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return { title: 'Not Found' };
  const builder = cs.poster ? urlForImage(cs.poster) : null;
  return {
    title: `${cs.title} — ${cs.client}`,
    description: cs.summary,
    openGraph: {
      title: cs.title,
      description: cs.summary,
      images: builder ? [builder.width(1200).height(630).url()] : [],
    },
  };
}

export default async function CaseStudyPage({ params }: RouteProps) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const builder = cs.poster ? urlForImage(cs.poster) : null;
  const posterUrl = builder ? builder.width(2400).url() : null;
  const body = Array.isArray(cs.body) ? (cs.body as PortableTextBlock[]) : null;

  return (
    <>
      <Nav />
      <main>
        <section className="bg-black px-6 pt-28 pb-10 md:px-12 md:pt-36">
          <div className="mx-auto max-w-[1200px]">
            <DataLabel className="mb-5">CASE STUDY · {cs.category.toUpperCase()}</DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-7xl">{cs.title}</h1>
            <DataLabel tone="muted" className="mt-6">
              {cs.client}
            </DataLabel>
          </div>
        </section>

        {cs.muxPlaybackId && (
          <section className="px-6 py-10 md:px-12">
            <div className="mx-auto max-w-[1200px]">
              <CinematicVideo
                playbackId={cs.muxPlaybackId}
                title={cs.title}
                poster={posterUrl ?? undefined}
              />
            </div>
          </section>
        )}

        {cs.summary && (
          <section className="bg-gunpowder px-6 py-16 md:px-12 md:py-24">
            <div className="mx-auto max-w-[65ch] text-lg leading-relaxed text-bone-muted">
              <p>{cs.summary}</p>
            </div>
          </section>
        )}

        {body && body.length > 0 && (
          <section className="bg-gunpowder px-6 py-16 md:px-12 md:py-20">
            <div className="mx-auto max-w-[65ch] text-bone-muted leading-relaxed space-y-4">
              <PortableText value={body} />
            </div>
          </section>
        )}

        <section className="border-t border-brass/15 bg-black px-6 py-20 text-center md:px-12 md:py-24">
          <h2 className="font-serif text-4xl italic md:text-5xl">Want work like this?</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <BrassButton href="/contact">Book a Call</BrassButton>
            <BrassButton href="/work" variant="outline">
              See More Work
            </BrassButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
