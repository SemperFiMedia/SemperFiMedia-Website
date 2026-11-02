'use client';

import { useEffect, useRef, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { cn } from '@/lib/utils';
import { track } from '@/lib/analytics/track';

type Aspect = 'video' | 'vertical' | 'square';

type Props = {
  playbackId: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  accentColor?: string;
  aspect?: Aspect;
};

const ASPECT_CLASS: Record<Aspect, string> = {
  video: 'aspect-video',
  vertical: 'aspect-[9/16]',
  square: 'aspect-square',
};

const PROGRESS_THRESHOLDS = [25, 50, 75];

export function CinematicVideo({
  playbackId,
  title,
  className,
  autoPlay = false,
  muted = false,
  loop = false,
  poster,
  accentColor = '#D4A057',
  aspect = 'video',
}: Props) {
  const playedRef = useRef(false);
  const firedRef = useRef<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Every player defers mount until it nears the viewport. Autoplay videos
  // wait until they're on screen so they start as the section scrolls in;
  // headless Lighthouse never scrolls, so those never pull chunks. Click-to-
  // play videos mount a little early and preload nothing, so a page with
  // dozens of reels doesn't fetch every stream at once and freeze a phone.
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (typeof IntersectionObserver === 'undefined') {
      setShouldMount(true);
      return;
    }
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldMount(true);
            observer.disconnect();
            break;
          }
        }
      },
      autoPlay
        ? { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
        : { threshold: 0, rootMargin: '400px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [autoPlay]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden bg-gunpowder', ASPECT_CLASS[aspect], className)}
    >
      {!shouldMount && poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {shouldMount && (
      <MuxPlayer
        playbackId={playbackId}
        metadata={{ video_title: title }}
        accentColor={accentColor}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload={autoPlay ? 'auto' : 'none'}
        poster={poster}
        style={{ width: '100%', height: '100%' }}
        onPlay={() => {
          if (playedRef.current) return;
          playedRef.current = true;
          void track('video_play', {
            video_title: title,
            video_id: playbackId,
            video_provider: 'mux',
          });
        }}
        onTimeUpdate={(e) => {
          const el = e.target as HTMLMediaElement;
          if (!el.duration || el.duration === Infinity) return;
          const pct = Math.floor((el.currentTime / el.duration) * 100);
          for (const t of PROGRESS_THRESHOLDS) {
            if (pct >= t && !firedRef.current.has(t)) {
              firedRef.current.add(t);
              void track('video_progress', {
                percent: t,
                video_title: title,
                video_id: playbackId,
                video_duration: el.duration,
                video_provider: 'mux',
              });
            }
          }
        }}
        onEnded={() =>
          void track('video_complete', {
            video_title: title,
            video_id: playbackId,
            video_provider: 'mux',
          })
        }
      />
      )}
    </div>
  );
}
