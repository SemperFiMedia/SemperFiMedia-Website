import { createClient } from 'next-sanity';
import { env } from '@/lib/env';

export const hasSanityConfig = Boolean(env.sanity.projectId);

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId: env.sanity.projectId,
      dataset: env.sanity.dataset,
      apiVersion: '2025-01-01',
      useCdn: true,
      token: env.sanity.readToken || undefined,
      perspective: 'published',
    })
  : null;
