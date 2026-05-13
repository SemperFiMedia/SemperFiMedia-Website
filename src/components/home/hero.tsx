'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import MuxPlayer from '@mux/mux-player-react';
import type MuxPlayerElement from '@mux/mux-player';
import { DataLabel } from '@/components/primitives/data-label';
import { BrassButton } from '@/components/primitives/brass-button';

type Props = {
  muxPlaybackId?: string;
  posterUrl?: string;
  videoSrc?: string;
};

export function Hero({ muxPlaybackId, posterUrl, videoSrc = '/videos/hero-showreel.mp4' }: Props) {
  const muxRef = useRef<MuxPlayerElement | null>(null);
  const fallbackRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const [mountVideo, setMountVideo] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Defer video mount until browser idle so the priority poster wins
  // the LCP race and we don't burn mobile bandwidth before first paint.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setMountVideo(true), { timeout: 3000 });
      return () => win.cancelIdleCallback?.(id);
    }
    const t = setTimeout(() => setMountVideo(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!muxRef.current) return;
    muxRef.current.muted = muted;
    if (!muted) {
      muxRef.current.volume = 1;
      void muxRef.current.play().catch(() => {
        /* autoplay rejection — keep muted state */
      });
    }
  }, [muted]);

  useEffect(() => {
    if (!fallbackRef.current) return;
    fallbackRef.current.muted = muted;
    if (!muted) {
      fallbackRef.current.volume = 1;
      void fallbackRef.current.play().catch(() => {
        /* autoplay rejection */
      });
    }
  }, [muted]);

  function toggleSound() {
    setInteracted(true);
    setMuted((m) => !m);
  }

  const tintOpacity = muted ? 0.5 : 0.85;

  return (
    <section
      className="relative overflow-hidden bg-gunpowder film-grain"
      aria-label="Semper Fi Media showreel"
    >
      <div className="letterbox-top relative z-20" />

      {posterUrl && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: videoPlaying ? 0 : tintOpacity }}
          aria-hidden="true"
        >
          <Image
            src={posterUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {mountVideo && muxPlaybackId ? (
        <div
          className="absolute inset-0 transition-opacity duration-700 [&_mux-player]:h-full [&_mux-player]:w-full [&_mux-player]:[--controls:none] [&_mux-player]:[--media-object-fit:cover]"
          style={{ opacity: videoPlaying ? tintOpacity : 0 }}
          aria-hidden="true"
        >
          <MuxPlayer
            ref={muxRef}
            playbackId={muxPlaybackId}
            autoPlay="muted"
            muted
            loop
            playsInline
            streamType="on-demand"
            accentColor="#D4A057"
            maxResolution="720p"
            preload="metadata"
            onPlaying={() => setVideoPlaying(true)}
          />
        </div>
      ) : mountVideo && !muxPlaybackId ? (
        <video
          ref={fallbackRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: videoPlaying ? tintOpacity : 0 }}
          aria-hidden="true"
          onPlaying={() => setVideoPlaying(true)}
        />
      ) : null}

      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: muted ? 1 : 0.4,
          background:
            'linear-gradient(135deg, rgba(22,24,26,0.7), rgba(36,73,87,0.4) 40%, rgba(95,55,29,0.3))',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1440px] flex-col justify-center px-6 py-24 md:px-12">
        <DataLabel className="mb-6">
          SCENE 001 · TAKE 01 · ROLL A · FORNEY TX · 32.75°N
        </DataLabel>
        <h1 className="font-serif italic font-bold leading-[0.95] tracking-tight text-6xl md:text-8xl lg:text-9xl max-w-5xl">
          Always Faithful
          <br />
          to Your Story.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-bone-muted md:text-xl">
          Marine-led cinematic video production based in Dallas. Big-agency quality. Half the
          overhead. One filmmaker, one camera, one mission.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <BrassButton href="/work">See the Work →</BrassButton>
          <BrassButton href="/contact" variant="outline">
            Book a Call
          </BrassButton>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? 'Tap for sound' : 'Mute the showreel'}
        aria-pressed={!muted}
        className={
          'absolute bottom-8 right-6 z-30 inline-flex items-center gap-2 rounded-full border border-brass/40 bg-black/60 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-bone backdrop-blur-md transition-all hover:bg-brass hover:text-gunpowder md:bottom-12 md:right-12 ' +
          (interacted ? '' : 'animate-pulse')
        }
      >
        {muted ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span>Tap for sound</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            <span>Mute</span>
          </>
        )}
      </button>

      <div className="letterbox-bottom relative z-20" />
    </section>
  );
}
