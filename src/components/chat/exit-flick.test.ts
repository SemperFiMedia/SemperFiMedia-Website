import { describe, it, expect } from 'vitest';
import { isExitFlick, FLICK_WINDOW_MS, FLICK_VELOCITY_PX_S } from './exit-flick';

const vh = 800;

// Build samples scrolling from yStart to yEnd over `ms` milliseconds.
function samples(yStart: number, yEnd: number, ms: number, steps = 5) {
  return Array.from({ length: steps + 1 }, (_, i) => ({
    y: yStart + ((yEnd - yStart) * i) / steps,
    t: 1_000_000 + (ms * i) / steps,
  }));
}

describe('isExitFlick', () => {
  it('fires on a fast upward flick after scrolling a viewport deep', () => {
    // 400px up in 150ms ≈ 2667 px/s upward
    expect(isExitFlick(samples(1600, 1200, 150), vh, 1600)).toBe(true);
  });

  it('does not fire when the visitor never scrolled a viewport deep', () => {
    expect(isExitFlick(samples(700, 300, 150), vh, 700)).toBe(false);
  });

  it('does not fire on a slow upward scroll', () => {
    // 400px up in 2000ms = 200 px/s
    expect(isExitFlick(samples(1600, 1200, 2000), vh, 1600)).toBe(false);
  });

  it('does not fire on downward scrolling', () => {
    expect(isExitFlick(samples(1200, 1600, 150), vh, 1600)).toBe(false);
  });

  it('needs at least two samples inside the window', () => {
    expect(isExitFlick([{ y: 1600, t: 1_000_000 }], vh, 1600)).toBe(false);
    expect(isExitFlick([], vh, 1600)).toBe(false);
  });

  it('ignores samples older than the window', () => {
    // Old fast segment followed by a long pause — only the pause is in-window.
    const old = samples(2000, 1600, 100); // fast, but stale
    const recent = [
      { y: 1600, t: 1_000_000 + 100 + FLICK_WINDOW_MS + 500 },
      { y: 1590, t: 1_000_000 + 100 + FLICK_WINDOW_MS + 650 }, // 67 px/s
    ];
    expect(isExitFlick([...old, ...recent], vh, 2000)).toBe(false);
  });

  it('exports the spec constants', () => {
    expect(FLICK_WINDOW_MS).toBe(150);
    expect(FLICK_VELOCITY_PX_S).toBe(1500);
  });
});
