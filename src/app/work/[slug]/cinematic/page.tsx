import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from '@portabletext/types';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { CinematicScroller } from '@/components/work/cinematic-scroller';
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
    title: `${cs.title} — Cinematic Edit | Semper Fi Media`,
    description: cs.summary,
    openGraph: {
      title: `${cs.title} — Cinematic Edit`,
      description: cs.summary,
      images: builder ? [builder.width(1200).height(630).url()] : [],
    },
  };
}

export default async function CinematicCaseStudyPage({ params }: RouteProps) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const posterBuilder = cs.poster ? urlForImage(cs.poster) : null;
  const posterUrl = posterBuilder ? posterBuilder.width(2400).url() : null;

  const bts =
    cs.behindTheScenes
      ?.map((img) => {
        const url = urlForImage(img)?.width(2400).url();
        if (!url) return null;
        return {
          _key: img._key,
          url,
          caption: img.caption,
          alt: img.alt,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null) ?? [];

  const processNotes = Array.isArray(cs.processNotes)
    ? (cs.processNotes as PortableTextBlock[])
    : null;

  return (
    <>
      <Nav />
      <CinematicScroller
        title={cs.title}
        client={cs.client}
        category={cs.category}
        summary={cs.summary}
        posterUrl={posterUrl}
        muxPlaybackId={cs.muxPlaybackId}
        youtubeUrl={cs.youtubeUrl}
        bts={bts}
        processNotes={processNotes}
        slug={cs.slug.current}
      />
      <Footer />
    </>
  );
}
