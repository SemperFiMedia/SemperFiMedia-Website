import type { CaseStudy } from '@/sanity/types';

/**
 * Placeholder case studies used when Sanity CMS is not yet configured.
 * Each uses a local AI-generated poster image in /public/images/work/.
 * Tiles route to /work (not /work/[slug]) since no individual case study
 * pages exist for these.
 */
export const PLACEHOLDER_FEATURED_CASE_STUDIES: CaseStudy[] = [
  {
    _id: 'placeholder-tactical',
    title: 'Range Day',
    slug: { current: 'placeholder-tactical' },
    client: 'Sample Work',
    category: 'tactical',
    posterUrl: '/images/work/tactical.jpg',
    isPlaceholder: true,
    featured: true,
  },
  {
    _id: 'placeholder-tv',
    title: 'Broadcast Series',
    slug: { current: 'placeholder-tv' },
    client: 'Sample Work',
    category: 'tv',
    posterUrl: '/images/work/tv.jpg',
    isPlaceholder: true,
    featured: true,
  },
  {
    _id: 'placeholder-small-business',
    title: "The Craftsman's Bench",
    slug: { current: 'placeholder-small-business' },
    client: 'Sample Work',
    category: 'small-business',
    posterUrl: '/images/work/small-business.jpg',
    isPlaceholder: true,
    featured: true,
  },
  {
    _id: 'placeholder-wedding',
    title: 'Texas Ranch Wedding',
    slug: { current: 'placeholder-wedding' },
    client: 'Sample Work',
    category: 'wedding',
    posterUrl: '/images/work/wedding.jpg',
    isPlaceholder: true,
    featured: true,
  },
  {
    _id: 'placeholder-music',
    title: 'Stage & Haze',
    slug: { current: 'placeholder-music' },
    client: 'Sample Work',
    category: 'music',
    posterUrl: '/images/work/music-video.jpg',
    isPlaceholder: true,
    featured: true,
  },
  {
    _id: 'placeholder-faith',
    title: 'Sanctuary Light',
    slug: { current: 'placeholder-faith' },
    client: 'Sample Work',
    category: 'faith',
    posterUrl: '/images/work/faith.jpg',
    isPlaceholder: true,
    featured: true,
  },
];
