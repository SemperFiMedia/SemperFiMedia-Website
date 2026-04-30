import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { fraunces, inter, jetbrainsMono } from '@/lib/fonts';
import { Plausible } from '@/components/analytics/plausible';
import { Clarity } from '@/components/analytics/clarity';
import { ConsentDefault } from '@/components/analytics/consent-default';
import { ConsentProvider } from '@/components/analytics/consent-provider';
import { ConsentBanner } from '@/components/analytics/consent-banner';
import { GA4 } from '@/components/analytics/ga4';
import { MetaPixel } from '@/components/analytics/meta-pixel';
import { PageTracker } from '@/components/analytics/page-tracker';
import { readConsentFromCookie } from '@/lib/analytics/consent';
import { LocalBusinessJsonLd, AggregateRatingJsonLd } from '@/components/seo/structured-data';
import { ChatWidget } from '@/components/chat/chat-widget';
import { SocialFollowWidget } from '@/components/social-proof/social-follow-widget';
import './globals.css';

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    default: 'Semper Fi Media — Marine-Led Cinematic Video Production, Dallas TX',
    template: '%s — Semper Fi Media',
  },
  description:
    'Marine-led cinematic video production serving Dallas–Fort Worth. Corporate films, cinema weddings, music videos. Big-agency quality. Half the overhead.',
  metadataBase: new URL('https://www.semperfimedia.llc'),
  openGraph: {
    type: 'website',
    siteName: 'Semper Fi Media',
    locale: 'en_US',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Semper Fi Media — Marine-led cinematic video production, Dallas TX',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.jpg'],
  },
  alternates: {
    canonical: 'https://www.semperfimedia.llc',
    languages: {
      'en-US': 'https://www.semperfimedia.llc',
      'es-US': 'https://www.semperfimedia.llc/es',
    },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read consent cookie server-side to avoid banner flash
  const cookieStore = await cookies();
  const initialConsent = readConsentFromCookie(
    cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; '),
  );

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <ConsentDefault />
      </head>
      <body className="bg-gunpowder text-bone font-sans min-h-full flex flex-col">
        <ConsentProvider initialConsent={initialConsent}>
          {children}
          <SocialFollowWidget />
          <ChatWidget />
          <LocalBusinessJsonLd />
          <AggregateRatingJsonLd ratingValue={5.0} reviewCount={30} />
          <Plausible />
          <Clarity />
          <GA4 />
          <MetaPixel />
          <PageTracker />
          <ConsentBanner />
        </ConsentProvider>
      </body>
    </html>
  );
}
