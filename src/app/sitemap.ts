import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { getAllCaseStudies, getAllBlogPosts } from '@/sanity/queries';

const STATIC_ROUTES = [
  '',
  '/work',
  '/corporate',
  '/corporate/mission-and-tactical',
  '/corporate/music-videos',
  '/corporate/drone',
  '/corporate/trailer-editing',
  '/corporate/website-design',
  '/film-production',
  '/corporate/small-business',
  '/corporate/faith-and-community',
  '/corporate/conventions',
  '/corporate/quinceaneras',
  '/corporate/birthday-parties',
  '/weddings',
  '/social-reels',
  '/pricing',
  '/about',
  '/contact',
  '/blog',
  '/shoots',
  '/refer',
];

const SPANISH_ROUTES = [
  '/es',
  '/es/weddings',
  '/es/quinceaneras',
  '/es/about',
  '/es/contact',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cases, posts] = await Promise.all([
    getAllCaseStudies().then((cs) => cs.filter((c) => !c.isPlaceholder)),
    getAllBlogPosts(),
  ]);

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${env.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const spanishEntries = SPANISH_ROUTES.map((route) => ({
    url: `${env.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const caseEntries = cases.map((cs) => ({
    url: `${env.siteUrl}/work/${cs.slug.current}`,
    lastModified: cs.publishedAt ? new Date(cs.publishedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogEntries = posts.map((post) => ({
    url: `${env.siteUrl}/blog/${post.slug.current}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...spanishEntries, ...caseEntries, ...blogEntries];
}
