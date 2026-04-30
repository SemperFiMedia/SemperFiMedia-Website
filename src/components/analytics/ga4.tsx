'use client';
import Script from 'next/script';
import { env } from '@/lib/env';

export function GA4() {
  const id = env.analytics.ga4MeasurementId;
  if (!env.analytics.enabled || !id) return null;
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${id}', {
            send_page_view: false${env.analytics.debug ? `,\n            debug_mode: true` : ''}
          });
        `}
      </Script>
    </>
  );
}
