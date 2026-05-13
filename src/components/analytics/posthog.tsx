'use client';

import { useEffect } from 'react';
import { env } from '@/lib/env';
import { useConsent } from './consent-provider';

let initialized = false;

export function PostHog() {
  const { state } = useConsent();
  const key = env.posthog.key;
  const host = env.posthog.host;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!key) return;
    if (!state.analytics) {
      if (initialized) {
        void import('posthog-js').then((mod) => mod.default.opt_out_capturing());
      }
      return;
    }
    void import('posthog-js').then((mod) => {
      const posthog = mod.default;
      if (!initialized) {
        posthog.init(key, {
          api_host: host,
          person_profiles: 'identified_only',
          capture_pageview: 'history_change',
          capture_pageleave: true,
          session_recording: {
            maskAllInputs: true,
          },
        });
        initialized = true;
      } else {
        posthog.opt_in_capturing();
      }
    });
  }, [state.analytics, key, host]);

  return null;
}
