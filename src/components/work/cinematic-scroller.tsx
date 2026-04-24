'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import type { PortableTextBlock } from '@portabletext/types';
import { PortableText } from '@portabletext/react';
import { CinematicVideo } from '@/components/media/cinematic-video';
import { YouTubeEmbed } from '@/components/media/youtube-embed';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';

type BTSImage = {
  _key?: string;
  url: string;
  caption?: string;
  alt: string;
};

type Props = {
  title: string;
  client: string;
  clientWebsite?: string;
  category: string;
  summary?: string;
  posterUrl?: string | null;
  muxPlaybackId?: string;
  youtubeUrl?: string;
  bts: BTSImage[];
  processNotes?: PortableTextBlock[] | null;
  slug: string;
};

function HeroChapter({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  return { opacity, y };
}

export function CinematicScroller(props: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(heroProgress, [0, 0.6, 1], [1, 1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.15]);
  const titleY = useTransform(heroProgress, [0, 1], ['0%', '-30%']);
  const titleOpacity = useTransform(heroProgress, [0, 0.5, 1], [1, 1, 0]);

  const summaryRef = useRef<HTMLElement>(null);
  const { scrollYProgress: summaryProgress } = useScroll({
    target: summaryRef,
    offset: ['start end', 'end start'],
  });
  const summaryOpacity = useTransform(
    summaryProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0],
  );
  const summaryY = useTransform(summaryProgress, [0, 1], ['40%', '-40%']);

  const hasFilm = Boolean(props.youtubeUrl || props.muxPlaybackId);

  return (
    <main className="bg-black text-bone">
      <section
        ref={heroRef}
        className="relative h-[180vh]"
        aria-label={`${props.title} — cinematic experience`}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {props.posterUrl ? (
            <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
              <Image
                src={props.posterUrl}
                alt={props.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-dusk-teal via-black to-texas-umber" />
          )}

          <motion.div
            style={{ y: titleY, opacity: titleOpacity }}
            className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
          >
            <DataLabel className="mb-6 text-brass">
              CASE STUDY · {props.category.toUpperCase()}
            </DataLabel>
            <h1 className="font-serif text-5xl italic leading-[0.95] md:text-8xl">
              {props.title}
            </h1>
            <DataLabel tone="muted" className="mt-8">
              {props.clientWebsite ? (
                <a
                  href={props.clientWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 transition-colors hover:text-brass hover:underline"
                >
                  {props.client} ↗
                </a>
              ) : (
                props.client
              )}
            </DataLabel>
            <div className="mt-16 flex animate-pulse flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-bone-muted">
              <span>Scroll to enter</span>
              <svg
                width="14"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {props.summary && (
        <section ref={summaryRef} className="relative h-[140vh]">
          <div className="sticky top-0 flex h-screen items-center px-6 md:px-12">
            <motion.div
              style={{ opacity: summaryOpacity, y: summaryY }}
              className="mx-auto max-w-[900px]"
            >
              <DataLabel className="mb-6 text-brass">THE STORY</DataLabel>
              <p className="font-serif text-2xl italic leading-snug text-bone md:text-4xl">
                &ldquo;{props.summary}&rdquo;
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {props.bts.length > 0 && (
        <BTSChapters bts={props.bts} />
      )}

      {props.processNotes && props.processNotes.length > 0 && (
        <section className="bg-gunpowder px-6 py-32 md:px-12 md:py-40">
          <div className="mx-auto max-w-[700px]">
            <DataLabel className="mb-6 text-brass">DIRECTOR&apos;S NOTES</DataLabel>
            <h2 className="mb-12 font-serif text-4xl italic leading-tight md:text-6xl">
              How we shot it.
            </h2>
            <div className="prose prose-invert max-w-none text-lg leading-relaxed text-bone-muted [&_h3]:font-serif [&_h3]:italic [&_h3]:text-2xl [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-bone [&_p]:mb-5 [&_strong]:text-bone">
              <PortableText value={props.processNotes} />
            </div>
          </div>
        </section>
      )}

      {hasFilm && (
        <section className="bg-black px-6 py-32 md:px-12 md:py-40" id="film">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 text-center">
              <DataLabel className="mb-4 text-brass">THE FILM</DataLabel>
              <h2 className="font-serif text-4xl italic leading-tight md:text-6xl">
                Watch it the way it was meant to be seen.
              </h2>
              <p className="mt-4 text-bone-muted">Headphones recommended. Lights down.</p>
            </div>
            {props.youtubeUrl ? (
              <YouTubeEmbed url={props.youtubeUrl} title={props.title} className="rounded-lg" />
            ) : props.muxPlaybackId ? (
              <CinematicVideo
                playbackId={props.muxPlaybackId}
                title={props.title}
                aspect="video"
                poster={props.posterUrl ?? undefined}
                className="rounded-lg"
              />
            ) : null}
          </div>
        </section>
      )}

      <section className="bg-gradient-to-br from-texas-umber via-golden-hour to-bone px-6 py-32 text-gunpowder md:px-12 md:py-40">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="font-serif text-4xl italic leading-tight md:text-7xl">
            Want a film like this?
          </h2>
          <p className="mt-6 text-lg" style={{ color: '#2a1a08' }}>
            Free 30-minute discovery call. Always Faithful.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <BrassButton href="/contact">Book a Discovery Call →</BrassButton>
            <Link
              href={`/work/${props.slug}`}
              className="inline-flex items-center text-sm font-bold uppercase tracking-[0.2em]"
              style={{ color: '#2a1a08' }}
            >
              ← Back to standard view
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function BTSChapters({ bts }: { bts: BTSImage[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const segmentLength = 1 / bts.length;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${bts.length * 110}vh` }}
      aria-label="Behind the scenes chapter"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {bts.map((img, i) => {
          const start = i * segmentLength;
          const end = (i + 1) * segmentLength;
          const mid = start + segmentLength / 2;
          return (
            <BTSFrame
              key={img._key ?? i}
              img={img}
              index={i}
              total={bts.length}
              scrollYProgress={scrollYProgress}
              start={start}
              mid={mid}
              end={end}
            />
          );
        })}
        <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-center text-xs uppercase tracking-[0.3em] text-bone-muted">
          Behind the camera
        </div>
      </div>
    </section>
  );
}

function BTSFrame({
  img,
  index,
  total,
  scrollYProgress,
  start,
  mid,
  end,
}: {
  img: BTSImage;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  start: number;
  mid: number;
  end: number;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [start - 0.05, start, end, end + 0.05].map((v) => Math.max(0, Math.min(1, v))),
    [0, 1, 1, 0],
  );
  const scale = useTransform(scrollYProgress, [start, end], [1.1, 1]);
  const captionY = useTransform(scrollYProgress, [start, mid, end], ['20px', '0px', '-20px']);
  const captionOpacity = useTransform(
    scrollYProgress,
    [start, mid - 0.02, mid + 0.02, end],
    [0, 1, 1, 0],
  );

  return (
    <motion.div style={{ opacity }} className="absolute inset-0">
      <motion.div style={{ scale }} className="relative h-full w-full">
        <Image
          src={img.url}
          alt={img.alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/30" />
      </motion.div>
      <motion.div
        style={{ y: captionY, opacity: captionOpacity }}
        className="absolute bottom-24 left-0 right-0 px-6 text-center md:bottom-32 md:px-12"
      >
        <DataLabel className="mb-3 text-brass">
          FRAME {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </DataLabel>
        {img.caption && (
          <p className="mx-auto max-w-[700px] font-serif text-lg italic leading-snug text-bone md:text-2xl">
            &ldquo;{img.caption}&rdquo;
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
