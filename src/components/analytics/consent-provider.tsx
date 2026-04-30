'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  acceptAll as acceptAllState,
  defaultConsent,
  readConsentFromCookie,
  rejectAll as rejectAllState,
  toGoogleConsentParams,
  writeConsentCookie,
  type ConsentState,
} from '@/lib/analytics/consent';
import { setConsent as setTrackerConsent } from '@/lib/analytics/track';

type ConsentContextValue = {
  state: ConsentState;
  accept: () => void;
  reject: () => void;
  update: (next: Partial<Omit<ConsentState, 'decided'>>) => void;
  openBanner: () => void;
  bannerOpen: boolean;
  closeBanner: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function pushConsentToProviders(state: ConsentState) {
  if (typeof window === 'undefined') return;
  setTrackerConsent(state);
  const params = toGoogleConsentParams(state);
  // Google Consent Mode v2
  window.dataLayer = window.dataLayer || [];
  window.gtag?.('consent', 'update', params);
  // Meta Pixel
  if (state.ads) {
    window.fbq?.('consent', 'grant');
  } else {
    window.fbq?.('consent', 'revoke');
  }
}

export function ConsentProvider({
  initialConsent,
  children,
}: {
  initialConsent: ConsentState;
  children: ReactNode;
}) {
  const [state, setState] = useState<ConsentState>(initialConsent);
  const [bannerOpen, setBannerOpen] = useState<boolean>(!initialConsent.decided);

  // Re-read cookie on mount in case SSR initial value drifted.
  useEffect(() => {
    const fromCookie = readConsentFromCookie();
    if (
      fromCookie.decided !== state.decided ||
      fromCookie.analytics !== state.analytics ||
      fromCookie.ads !== state.ads
    ) {
      setState(fromCookie);
      setBannerOpen(!fromCookie.decided);
    }
    pushConsentToProviders(fromCookie);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((next: ConsentState) => {
    setState(next);
    writeConsentCookie(next);
    pushConsentToProviders(next);
  }, []);

  const accept = useCallback(() => {
    persist(acceptAllState());
    setBannerOpen(false);
  }, [persist]);

  const reject = useCallback(() => {
    persist(rejectAllState());
    setBannerOpen(false);
  }, [persist]);

  const update = useCallback(
    (next: Partial<Omit<ConsentState, 'decided'>>) => {
      const merged: ConsentState = {
        decided: true,
        analytics: next.analytics ?? state.analytics,
        ads: next.ads ?? state.ads,
      };
      persist(merged);
      setBannerOpen(false);
    },
    [persist, state.analytics, state.ads],
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      state,
      accept,
      reject,
      update,
      openBanner: () => setBannerOpen(true),
      closeBanner: () => setBannerOpen(false),
      bannerOpen,
    }),
    [state, accept, reject, update, bannerOpen],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    // Soft fallback during SSR / outside provider — behave as if undecided.
    return {
      state: defaultConsent(),
      accept: () => {},
      reject: () => {},
      update: () => {},
      openBanner: () => {},
      closeBanner: () => {},
      bannerOpen: false,
    };
  }
  return ctx;
}
