import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/lib/env';
import * as schema from './schema';

export const hasDb = Boolean(env.db.url);

// Null when DATABASE_URL is unset so the app builds/runs without a database;
// comment endpoints return 503 until it is configured (mirrors sanityClient).
const queryClient = hasDb ? postgres(env.db.url, { prepare: false }) : null;

export const db = queryClient ? drizzle(queryClient, { schema }) : null;
