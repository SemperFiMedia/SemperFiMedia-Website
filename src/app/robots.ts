import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/studio' },
      { userAgent: '*', disallow: '/api' },
    ],
    sitemap: `${env.siteUrl}/sitemap.xml`,
  };
}
