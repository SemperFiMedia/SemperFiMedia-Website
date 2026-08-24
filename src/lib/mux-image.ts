/**
 * Poster frames generated from the video itself, via Mux's image service.
 *
 * Why this exists: social reels are shot 9:16, but the poster images uploaded
 * to Sanity for them are landscape. That mismatch is why the reels were being
 * displayed in 16:9 frames — the frames were widened to suit the thumbnails
 * instead of the footage, so a vertical reel rendered as a narrow strip with
 * dead space either side.
 *
 * Asking Mux for the poster instead removes the mismatch at the source: the
 * frame comes from the video, so it always matches the video's shape. No
 * re-uploading, and nothing to keep in sync.
 */

export type MuxThumbnailOptions = {
  width?: number;
  height?: number;
  /** Seconds into the video to grab. A second or two in avoids black frames. */
  time?: number;
  fitMode?: 'preserve' | 'stretch' | 'crop' | 'smartcrop' | 'pad';
};

export function muxThumbnail(playbackId: string, options: MuxThumbnailOptions = {}): string {
  const { width, height, time = 1, fitMode } = options;
  const params = new URLSearchParams();
  if (width) params.set('width', String(width));
  if (height) params.set('height', String(height));
  if (fitMode) params.set('fit_mode', fitMode);
  params.set('time', String(time));
  return `https://image.mux.com/${playbackId}/thumbnail.webp?${params.toString()}`;
}

/** 9:16 poster for social reels. smartcrop keeps the subject framed. */
export function muxVerticalPoster(playbackId: string, time = 1): string {
  return muxThumbnail(playbackId, { width: 1080, height: 1920, fitMode: 'smartcrop', time });
}
