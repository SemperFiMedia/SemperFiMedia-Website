import { urlForImage } from './image';
import { muxThumbnail, muxVerticalPoster } from '@/lib/mux-image';
import type { Reel } from './types';

/**
 * Poster for a reel: the uploaded cover when there is one, otherwise a frame
 * from the video itself in the right shape. A reel added from the Studio
 * without a cover still gets a sensible still instead of a black box.
 */
export function reelCover(reel: Pick<Reel, 'cover' | 'muxPlaybackId' | 'aspect'>): string {
  const uploaded = reel.cover?.asset ? urlForImage(reel.cover)?.width(1080).url() : null;
  if (uploaded) return uploaded;
  return reel.aspect === 'video'
    ? muxThumbnail(reel.muxPlaybackId, { width: 1280 })
    : muxVerticalPoster(reel.muxPlaybackId);
}
