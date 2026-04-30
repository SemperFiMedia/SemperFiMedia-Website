'use client';

import { useEffect, useState } from 'react';
import { useConsent } from './consent-provider';

export function ConsentBanner() {
  const { bannerOpen, accept, reject, update, state, closeBanner } = useConsent();
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(state.analytics);
  const [adsOn, setAdsOn] = useState(state.ads);

  // Resync local toggles + reset to default view whenever the banner is (re)opened.
  useEffect(() => {
    if (bannerOpen) {
      setAnalyticsOn(state.analytics);
      setAdsOn(state.ads);
      setCustomizeOpen(false);
    }
  }, [bannerOpen, state.analytics, state.ads]);

  if (!bannerOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-3xl rounded-xl border border-brass/30 bg-gunpowder/95 p-5 text-sm text-bone shadow-2xl backdrop-blur"
    >
      {!customizeOpen ? (
        <>
          <p className="leading-relaxed">
            We use cookies for analytics and to measure ad performance. You can accept all,
            reject all, or pick what&rsquo;s on. See our{' '}
            <a className="text-brass underline" href="/privacy">privacy policy</a>.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={accept}
              className="data-label rounded bg-brass px-4 py-2 font-bold uppercase text-gunpowder hover:bg-golden-hour"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={reject}
              className="data-label rounded border border-bone/30 px-4 py-2 uppercase hover:border-brass"
            >
              Reject all
            </button>
            <button
              type="button"
              onClick={() => setCustomizeOpen(true)}
              className="data-label rounded px-4 py-2 uppercase text-bone-muted hover:text-bone"
            >
              Customize
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="font-serif text-base">Choose what to allow.</p>
          <div className="mt-4 space-y-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={analyticsOn}
                onChange={(e) => setAnalyticsOn(e.target.checked)}
                className="mt-1"
              />
              <span>
                <span className="font-bold">Analytics</span> — anonymous usage data so we can
                improve the site (Google Analytics).
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={adsOn}
                onChange={(e) => setAdsOn(e.target.checked)}
                className="mt-1"
              />
              <span>
                <span className="font-bold">Advertising</span> — measure and improve our ad
                campaigns (Meta Pixel).
              </span>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => update({ analytics: analyticsOn, ads: adsOn })}
              className="data-label rounded bg-brass px-4 py-2 font-bold uppercase text-gunpowder hover:bg-golden-hour"
            >
              Save choices
            </button>
            <button
              type="button"
              onClick={() => setCustomizeOpen(false)}
              className="data-label rounded px-4 py-2 uppercase text-bone-muted hover:text-bone"
            >
              Back
            </button>
            <button
              type="button"
              onClick={closeBanner}
              aria-label="Dismiss without choosing (will reappear next visit)"
              className="data-label ml-auto rounded px-4 py-2 uppercase text-bone-subtle hover:text-bone"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Re-openable from a footer link.
export function PrivacyChoicesLink({
  className,
  label = 'Privacy choices',
}: {
  className?: string;
  label?: string;
}) {
  const { openBanner } = useConsent();
  return (
    <button
      type="button"
      onClick={openBanner}
      className={className ?? 'text-bone-subtle hover:text-bone underline'}
    >
      {label}
    </button>
  );
}
