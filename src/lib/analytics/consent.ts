export type ConsentState = {
  decided: boolean;
  analytics: boolean;
  ads: boolean;
};

export const CONSENT_COOKIE = 'sfm_consent';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export function defaultConsent(): ConsentState {
  return { decided: false, analytics: false, ads: false };
}

export function acceptAll(): ConsentState {
  return { decided: true, analytics: true, ads: true };
}

export function rejectAll(): ConsentState {
  return { decided: true, analytics: false, ads: false };
}

export function readConsentFromCookie(cookieHeader?: string): ConsentState {
  const source =
    cookieHeader ?? (typeof document !== 'undefined' ? document.cookie : '');
  const match = source.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]+)`));
  if (!match || !match[1]) return defaultConsent();
  try {
    const decoded = decodeURIComponent(match[1]);
    const parsed = JSON.parse(decoded) as Partial<ConsentState>;
    return {
      decided: parsed.decided === true,
      analytics: parsed.analytics === true,
      ads: parsed.ads === true,
    };
  } catch {
    return defaultConsent();
  }
}

export function writeConsentCookie(state: ConsentState): void {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(JSON.stringify(state));
  document.cookie =
    `${CONSENT_COOKIE}=${value}; ` +
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

// Translate ConsentState → Google Consent Mode v2 params.
export function toGoogleConsentParams(state: ConsentState): Record<string, 'granted' | 'denied'> {
  return {
    ad_storage: state.ads ? 'granted' : 'denied',
    ad_user_data: state.ads ? 'granted' : 'denied',
    ad_personalization: state.ads ? 'granted' : 'denied',
    analytics_storage: state.analytics ? 'granted' : 'denied',
  };
}
