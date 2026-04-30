import { describe, it, expect, beforeEach } from 'vitest';
import {
  CONSENT_COOKIE,
  defaultConsent,
  readConsentFromCookie,
  writeConsentCookie,
  acceptAll,
  rejectAll,
  type ConsentState,
} from './consent';

describe('consent state', () => {
  beforeEach(() => {
    document.cookie = `${CONSENT_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });

  it('defaultConsent is fully denied + undecided', () => {
    expect(defaultConsent()).toEqual({
      decided: false,
      analytics: false,
      ads: false,
    } satisfies ConsentState);
  });

  it('readConsentFromCookie returns default when absent', () => {
    expect(readConsentFromCookie()).toEqual(defaultConsent());
  });

  it('round-trips via cookie', () => {
    writeConsentCookie({ decided: true, analytics: true, ads: false });
    expect(readConsentFromCookie()).toEqual({
      decided: true,
      analytics: true,
      ads: false,
    });
  });

  it('acceptAll → all granted + decided', () => {
    expect(acceptAll()).toEqual({ decided: true, analytics: true, ads: true });
  });

  it('rejectAll → all denied + decided', () => {
    expect(rejectAll()).toEqual({ decided: true, analytics: false, ads: false });
  });
});
