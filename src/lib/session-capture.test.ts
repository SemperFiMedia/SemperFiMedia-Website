import { describe, it, expect } from 'vitest';
import {
  SESSION_CAPTURE_ADD_ONS,
  SESSION_CAPTURE_PRICE,
  addOnLinePrice,
  addOnPriceLabel,
  sessionCaptureTotal,
  verticalClipsPrice,
} from './session-capture';

function addOn(id: string) {
  const found = SESSION_CAPTURE_ADD_ONS.find((a) => a.id === id);
  if (!found) throw new Error(`missing add-on ${id}`);
  return found;
}

describe('session capture pricing', () => {
  it('anchors the base package at $1,000', () => {
    expect(SESSION_CAPTURE_PRICE).toBe(1000);
    expect(sessionCaptureTotal({})).toBe(1000);
  });

  it('publishes the exact add-on prices', () => {
    expect(addOn('second-camera').price).toBe(350);
    expect(addOn('vertical-clips').price).toBe(150);
    expect(addOn('extra-hours').price).toBe(250);
    expect(addOn('rush-delivery').price).toBe(250);
    expect(addOn('session-stills').price).toBe(300);
    expect(addOn('panel-audio').price).toBe(200);
  });

  describe('vertical clip pack rate', () => {
    it('bills singles at $150', () => {
      expect(verticalClipsPrice(0)).toBe(0);
      expect(verticalClipsPrice(1)).toBe(150);
      expect(verticalClipsPrice(2)).toBe(300);
    });

    it('applies the $400 pack rate at three clips instead of $450', () => {
      expect(verticalClipsPrice(3)).toBe(400);
    });

    // The site-wide reel ladder (owner's call, 2026-10-04) added five for $500,
    // and an order is never quoted above a larger pack.
    it('uses the site-wide reel ladder', () => {
      expect(verticalClipsPrice(4)).toBe(500); // the five-pack beats 400 + 150
      expect(verticalClipsPrice(5)).toBe(500); // five-pack
      expect(verticalClipsPrice(6)).toBe(650); // five-pack + one
    });

    it('never quotes above the straight per-clip rate', () => {
      for (let n = 0; n <= 12; n += 1) {
        expect(verticalClipsPrice(n)).toBeLessThanOrEqual(n * 150);
      }
    });

    it('never gets cheaper as clip count goes up', () => {
      for (let n = 1; n <= 12; n += 1) {
        expect(verticalClipsPrice(n)).toBeGreaterThanOrEqual(verticalClipsPrice(n - 1));
      }
    });
  });

  describe('line pricing by unit', () => {
    it('charges flat add-ons once regardless of quantity', () => {
      expect(addOnLinePrice(addOn('second-camera'), 1)).toBe(350);
      expect(addOnLinePrice(addOn('second-camera'), 3)).toBe(350);
      expect(addOnLinePrice(addOn('second-camera'), 0)).toBe(0);
    });

    it('multiplies hourly add-ons', () => {
      expect(addOnLinePrice(addOn('extra-hours'), 2)).toBe(500);
      expect(addOnLinePrice(addOn('extra-hours'), 0)).toBe(0);
    });

    it('routes vertical clips through the pack rate', () => {
      expect(addOnLinePrice(addOn('vertical-clips'), 3)).toBe(400);
    });
  });

  it('totals a realistic speaker configuration', () => {
    // Base + second camera + a 3-clip pack + 1 extra hour.
    const total = sessionCaptureTotal({
      'second-camera': 1,
      'vertical-clips': 3,
      'extra-hours': 1,
    });
    expect(total).toBe(1000 + 350 + 400 + 250);
  });

  it('ignores unknown add-on ids in the quantity map', () => {
    expect(sessionCaptureTotal({ 'not-a-real-addon': 5 })).toBe(1000);
  });

  describe('price labels', () => {
    it('shows both the unit and pack rate for clips', () => {
      // The site-wide reel ladder (owner's call, 2026-10-04).
      expect(addOnPriceLabel(addOn('vertical-clips'))).toBe('$150 each · 3 for $400 · 5 for $500');
    });

    it('marks hourly add-ons per hour', () => {
      expect(addOnPriceLabel(addOn('extra-hours'))).toBe('$250/hr');
    });

    it('shows flat add-ons as a single price', () => {
      expect(addOnPriceLabel(addOn('second-camera'))).toBe('$350');
    });
  });
});
