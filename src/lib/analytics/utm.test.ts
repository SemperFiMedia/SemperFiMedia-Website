import { describe, it, expect, beforeEach } from 'vitest';
import { parseUtmFromUrl, persistUtm, readUtm, UTM_KEYS } from './utm';

describe('parseUtmFromUrl', () => {
  it('returns empty object for url without utm/click ids', () => {
    expect(parseUtmFromUrl('https://example.com/')).toEqual({});
  });

  it('extracts utm_* + gclid + fbclid', () => {
    const url =
      'https://example.com/?utm_source=fb&utm_medium=cpc&utm_campaign=spring&gclid=abc&fbclid=xyz';
    const out = parseUtmFromUrl(url);
    expect(out.utm_source).toBe('fb');
    expect(out.utm_medium).toBe('cpc');
    expect(out.utm_campaign).toBe('spring');
    expect(out.gclid).toBe('abc');
    expect(out.fbclid).toBe('xyz');
  });

  it('ignores unknown query params', () => {
    const out = parseUtmFromUrl('https://example.com/?x=1&utm_source=a');
    expect(out).toEqual({ utm_source: 'a' });
  });
});

describe('persistUtm + readUtm', () => {
  beforeEach(() => {
    document.cookie = 'sfm_utm=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    sessionStorage.clear();
  });

  it('round-trips via cookie + sessionStorage', () => {
    persistUtm({ utm_source: 'fb', gclid: 'abc' });
    const out = readUtm();
    expect(out.utm_source).toBe('fb');
    expect(out.gclid).toBe('abc');
  });

  it('returns empty when nothing persisted', () => {
    expect(readUtm()).toEqual({});
  });
});

describe('UTM_KEYS', () => {
  it('exposes the canonical key list', () => {
    expect(UTM_KEYS).toContain('utm_source');
    expect(UTM_KEYS).toContain('gclid');
    expect(UTM_KEYS).toContain('fbclid');
  });
});
