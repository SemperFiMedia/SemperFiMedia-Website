import type { Metadata } from 'next';
import { fraunces, inter, jetbrainsMono } from '@/lib/fonts';
import { Plausible } from '@/components/analytics/plausible';
import { Clarity } from '@/components/analytics/clarity';
import { LocalBusinessJsonLd } from '@/components/seo/structured-data';
import './globals.css';

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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="bg-gunpowder text-bone font-sans min-h-full flex flex-col">
        {children}
        <LocalBusinessJsonLd />
        <Plausible />
        <Clarity />
      </body>
    </html>
  );
}
