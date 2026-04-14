'use client';

import MuxPlayer from '@mux/mux-player-react';
import { cn } from '@/lib/utils';

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
  return (
    <div className={cn('relative overflow-hidden bg-gunpowder', ASPECT_CLASS[aspect], className)}>
      <MuxPlayer
        playbackId={playbackId}
        metadata={{ video_title: title }}
        accentColor={accentColor}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        poster={poster}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
