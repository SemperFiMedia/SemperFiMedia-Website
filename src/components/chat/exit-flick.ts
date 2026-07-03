// Mobile exit-intent proxy: a fast upward scroll flick (thumb heading for the
// address bar / back button) after the visitor has gone at least one viewport
// deep. Pure math over scroll samples so it's unit-testable; the widget hook
// feeds it a ring buffer of recent positions.
// Samples must be time-ordered, oldest first.

export type ScrollSample = { y: number; t: number };

export const FLICK_WINDOW_MS = 150;
export const FLICK_VELOCITY_PX_S = 1500;

export function isExitFlick(
  samples: ScrollSample[],
  viewportHeight: number,
  maxYSeen: number,
): boolean {
  if (maxYSeen < viewportHeight) return false;
  if (samples.length < 2) return false;

  const newest = samples[samples.length - 1]!;
  const windowStart = newest.t - FLICK_WINDOW_MS;
  const inWindow = samples.filter((s) => s.t >= windowStart);
  if (inWindow.length < 2) return false;

  const oldest = inWindow[0]!;
  const dt = newest.t - oldest.t;
  if (dt <= 0) return false;

  const upwardPx = oldest.y - newest.y; // positive = scrolling toward the top
  const velocity = (upwardPx / dt) * 1000;
  return velocity >= FLICK_VELOCITY_PX_S;
}
