'use client';

import MuxPlayer from '@mux/mux-player-react';
import { cn } from '@/lib/utils';

type Props = {
  playbackId: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  accentColor?: string;
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
}: Props) {
  return (
    <div className={cn('relative aspect-video overflow-hidden bg-gunpowder', className)}>
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
