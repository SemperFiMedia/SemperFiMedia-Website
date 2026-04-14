import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { getAllCaseStudies } from '@/sanity/queries';

const STATIC_ROUTES = [
  '',
  '/work',
  '/corporate',
  '/corporate/mission-and-tactical',
  '/weddings',
  '/pricing',
  '/about',
  '/contact',
  '/blog',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cases = await getAllCaseStudies();
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${env.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
  const caseEntries = cases.map((cs) => ({
    url: `${env.siteUrl}/work/${cs.slug.current}`,
    lastModified: cs.publishedAt ? new Date(cs.publishedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [...staticEntries, ...caseEntries];
}
