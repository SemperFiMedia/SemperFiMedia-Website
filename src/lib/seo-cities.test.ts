import { describe, it, expect } from 'vitest';
import { seoCityList, seoCityListShort, seoAreaServed } from './seo-cities';

describe('seo cities', () => {
  it('lists the primary cities in priority order', () => {
    expect(seoCityList()).toBe('Dallas, Fort Worth, Forney, Rockwall, Royse City, and Wylie');
    expect(seoCityListShort()).toBe('Dallas, Fort Worth, Forney, Rockwall, Royse City, Wylie');
  });

  it('areaServed covers both lists as schema.org cities', () => {
    const area = seoAreaServed();
    expect(area).toHaveLength(13);
    expect(area[0]).toEqual({ '@type': 'City', name: 'Dallas, TX' });
  });
});
