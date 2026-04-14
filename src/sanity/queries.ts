import { groq } from 'next-sanity';
import { sanityClient } from './client';
import { PLACEHOLDER_FEATURED_CASE_STUDIES } from '@/lib/placeholder-case-studies';
import type { CaseStudy, Testimonial, Client } from './types';

export async function getFeaturedCaseStudies(limit = 6): Promise<CaseStudy[]> {
  if (!sanityClient) {
    return PLACEHOLDER_FEATURED_CASE_STUDIES.slice(0, limit);
  }
  return sanityClient.fetch(
    groq`*[_type == "caseStudy" && featured == true] | order(publishedAt desc)[0...$limit]{
      _id, title, slug, client, category, muxPlaybackId, poster, summary, publishedAt, featured
    }`,
    { limit: limit - 1 }
  );
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  if (!sanityClient) {
    return PLACEHOLDER_FEATURED_CASE_STUDIES;
  }
  return sanityClient.fetch(
    groq`*[_type == "caseStudy"] | order(publishedAt desc){
      _id, title, slug, client, category, muxPlaybackId, poster, summary, publishedAt, featured
    }`
  );
}

export async function getSocialReels(limit?: number): Promise<CaseStudy[]> {
  if (!sanityClient) return [];
  const slice = limit ? `[0...$limit]` : '';
  return sanityClient.fetch(
    groq`*[_type == "caseStudy" && category == "social"] | order(publishedAt desc)${slice}{
      _id, title, slug, client, category, muxPlaybackId, poster, summary, publishedAt, featured
    }`,
    limit ? { limit } : {}
  );
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  if (!sanityClient) return null;
  return sanityClient.fetch(
    groq`*[_type == "caseStudy" && slug.current == $slug][0]{
      _id, title, slug, client, category, muxPlaybackId, poster, summary, body,
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

export async function getFeaturedClients(): Promise<Client[]> {
  if (!sanityClient) return [];
  return sanityClient.fetch(
    groq`*[_type == "client" && featured == true] | order(order asc){
      _id, name, logo, logoDark, website, featured, order
    }`
  );
}
