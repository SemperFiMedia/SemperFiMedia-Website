'use client';
import Script from 'next/script';
import { env } from '@/lib/env';
import { useConsent } from './consent-provider';

export function Clarity() {
  const id = env.clarity.projectId;
  const { state } = useConsent();
  if (process.env.NODE_ENV !== 'production' || !id) return null;
  if (!state.analytics) return null;
  return (
    <Script id="clarity" strategy="lazyOnload">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");`}
    </Script>
  );
}
