import Script from 'next/script';
import { env } from '@/lib/env';

export function Plausible() {
  if (process.env.NODE_ENV !== 'production') return null;
  return (
    <Script
      defer
      data-domain={env.plausible.domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
