import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { getAllCaseStudies, getAllBlogPosts, getAllReelReconReviews } from '@/sanity/queries';

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
  '/session-capture',
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
  '/reel-recon',
  '/shoots',
  '/refer',
  '/privacy',
];

const SPANISH_ROUTES = [
  '/es',
  '/es/weddings',
  '/es/quinceaneras',
  '/es/about',
  '/es/contact',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cases, posts, reviews] = await Promise.all([
    getAllCaseStudies().then((cs) => cs.filter((c) => !c.isPlaceholder)),
    getAllBlogPosts(),
    getAllReelReconReviews(),
  ]);

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${env.siteUrl}${route}`,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const spanishEntries = SPANISH_ROUTES.map((route) => ({
    url: `${env.siteUrl}${route}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const caseEntries = cases.map((cs) => ({
    url: `${env.siteUrl}/work/${cs.slug.current}`,
    ...(cs.publishedAt && { lastModified: new Date(cs.publishedAt) }),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogEntries = posts.map((post) => ({
    url: `${env.siteUrl}/blog/${post.slug.current}`,
    ...(post.publishedAt && { lastModified: new Date(post.publishedAt) }),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const reelReconEntries = reviews.map((review) => ({
    url: `${env.siteUrl}/reel-recon/${review.slug.current}`,
    ...(review.publishedAt && { lastModified: new Date(review.publishedAt) }),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...spanishEntries, ...caseEntries, ...blogEntries, ...reelReconEntries];
}
