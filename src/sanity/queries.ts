import { groq } from 'next-sanity';
import { sanityClient } from './client';
import { PLACEHOLDER_FEATURED_CASE_STUDIES } from '@/lib/placeholder-case-studies';
import type { CaseStudy, Testimonial, Client, BlogPost } from './types';

export async function getFeaturedCaseStudies(limit = 6): Promise<CaseStudy[]> {
  if (!sanityClient) {
    return PLACEHOLDER_FEATURED_CASE_STUDIES.slice(0, limit);
  }
  return sanityClient.fetch(
    groq`*[_type == "caseStudy" && featured == true] | order(publishedAt desc)[0...$limit]{
      _id, title, slug, client, category, muxPlaybackId, youtubeUrl, poster, summary, publishedAt, featured
    }`,
    { limit: limit - 1 }
  );
}

export async function getRecentShoots(limit = 12): Promise<CaseStudy[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    groq`*[_type == "caseStudy" && defined(publishedAt)] | order(publishedAt desc)[0...$limit]{
      _id, title, slug, client, category, muxPlaybackId, youtubeUrl, poster, summary, publishedAt, featured
    }`,
    { limit },
  );
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  if (!sanityClient) {
    return PLACEHOLDER_FEATURED_CASE_STUDIES;
  }
  return sanityClient.fetch(
    groq`*[_type == "caseStudy"] | order(publishedAt desc){
      _id, title, slug, client, category, muxPlaybackId, youtubeUrl, poster, summary, publishedAt, featured
    }`
  );
}

export async function getSocialReels(limit?: number): Promise<CaseStudy[]> {
  if (!sanityClient) return [];
  const slice = limit ? `[0...$limit]` : '';
  return sanityClient.fetch(
    groq`*[_type == "caseStudy" && category == "social"] | order(publishedAt desc)${slice}{
      _id, title, slug, client, category, muxPlaybackId, youtubeUrl, poster, summary, publishedAt, featured
    }`,
    limit ? { limit } : {}
  );
}

export async function getHeroCaseStudy(): Promise<CaseStudy | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch(
    groq`*[_type == "caseStudy" && category == "wedding" && featured == true && defined(muxPlaybackId)]
      | order(publishedAt desc)[0]{
      _id, title, slug, client, category, muxPlaybackId, youtubeUrl, poster, summary, publishedAt, featured
    }`,
  );
}

export async function getCaseStudiesByCategory(
  category: string,
  limit = 4,
): Promise<CaseStudy[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    groq`*[_type == "caseStudy" && category == $category] | order(featured desc, publishedAt desc)[0...$limit]{
      _id, title, slug, client, category, muxPlaybackId, youtubeUrl, poster, summary, publishedAt, featured
    }`,
    { category, limit },
  );
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch(
    groq`*[_type == "caseStudy" && slug.current == $slug][0]{
      _id, title, slug, client, category, muxPlaybackId, youtubeUrl, poster, summary, body,
      processNotes, behindTheScenes[]{_key, asset, caption, alt},
      publishedAt, featured
    }`,
    { slug }
  );
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    groq`*[_type == "testimonial" && featured == true] | order(reviewDate desc){
      _id, quote, author, authorTitle, source, rating, featured, reviewDate
    }`
  );
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    groq`*[_type == "testimonial"] | order(reviewDate desc){
      _id, quote, author, authorTitle, source, rating, featured, reviewDate
    }`
  );
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    groq`*[_type == "blogPost" && defined(publishedAt)] | order(featured desc, publishedAt desc){
      _id, title, slug, excerpt, coverImage, publishedAt, category,
      author, authorTitle, featured, readingTime
    }`,
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch(
    groq`*[_type == "blogPost" && slug.current == $slug][0]{
      _id, title, slug, excerpt, coverImage, body, publishedAt, category,
      author, authorTitle, featured, readingTime, seoTitle, seoDescription
    }`,
    { slug },
  );
}

export async function getRelatedBlogPosts(
  category: string,
  excludeSlug: string,
  limit = 3,
): Promise<BlogPost[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    groq`*[_type == "blogPost" && category == $category && slug.current != $excludeSlug && defined(publishedAt)]
      | order(publishedAt desc)[0...$limit]{
      _id, title, slug, excerpt, coverImage, publishedAt, category, readingTime
    }`,
    { category, excludeSlug, limit },
  );
}

export async function getFeaturedClients(): Promise<Client[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    groq`*[_type == "client" && featured == true] | order(order asc){
      _id, name, logo, logoDark, website, featured, order
    }`
  );
}

export async function getClientByName(name: string): Promise<Client | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch(
    groq`*[_type == "client" && name == $name][0]{
      _id, name, logo, logoDark, website, featured, order
    }`,
    { name },
  );
}
