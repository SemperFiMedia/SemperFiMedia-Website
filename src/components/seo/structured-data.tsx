import { env } from '@/lib/env';

export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${env.siteUrl}/#business`,
    name: 'Semper Fi Media',
    description:
      'Marine-led cinematic video production serving Dallas–Fort Worth. Corporate films, cinema weddings, music videos, tactical and first-responder video.',
    url: env.siteUrl,
    telephone: '+1-817-239-2664',
    email: 'hello@semperfimedia.llc',
    priceRange: '$$',
    image: `${env.siteUrl}/og-default.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Forney',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 32.818504,
      longitude: -96.7320961,
    },
    areaServed: [
      'Dallas, TX',
      'Fort Worth, TX',
      'Forney, TX',
      'Plano, TX',
      'Frisco, TX',
      'Arlington, TX',
      'McKinney, TX',
      'Mesquite, TX',
      'Garland, TX',
      'Irving, TX',
      'Carrollton, TX',
      'Richardson, TX',
      'Addison, TX',
      'Rockwall, TX',
    ],
    sameAs: [
      'https://www.facebook.com/SemperFiMedia',
      'https://www.instagram.com/semperfimediallc/',
      'https://www.youtube.com/@SemperFiMedia',
      'https://x.com/SemperFiMediaTX',
      'https://www.tiktok.com/@semperfimedia',
      'https://www.linkedin.com/in/antonio-gutierrez-/',
      'https://vimeo.com/semperfimedia',
      env.gbp.profileUrl,
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '17:00',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type ServiceProps = {
  name: string;
  description: string;
  url: string;
};

export function ServiceJsonLd({ name, description, url }: ServiceProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    provider: { '@id': `${env.siteUrl}/#business` },
    name,
    description,
    url,
    areaServed: { '@type': 'City', name: 'Dallas' },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type VideoProps = {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
};

export function VideoJsonLd(props: VideoProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    ...props,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
