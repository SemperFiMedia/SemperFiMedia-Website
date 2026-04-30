import Script from 'next/script';

// Inline script: sets Google Consent Mode v2 default-deny BEFORE gtag.js loads.
// Must be `beforeInteractive` and inline so it executes synchronously before
// any Google or Meta tag has a chance to fire.
//
// MUST be rendered from `app/layout.tsx` (the root layout). Next.js App Router
// only honors `strategy="beforeInteractive"` in the root layout — nested
// layouts or pages silently downgrade to `afterInteractive`, which would let
// gtag.js fire before consent defaults are set and break GDPR posture.
export function ConsentDefault() {
  return (
    <Script id="consent-default" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = window.gtag || gtag;
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          wait_for_update: 500
        });
      `}
    </Script>
  );
}
