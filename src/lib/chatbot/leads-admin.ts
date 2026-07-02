import { and, count, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { leads, type DbLead } from '@/lib/db/schema';
import type { LeadStatus } from './lead-status';

export class DbUnavailableError extends Error {}

function requireDb() {
  if (!db) throw new DbUnavailableError('Database is not configured');
  return db;
}

// Reject non-UUIDs up front — Postgres throws on an invalid uuid cast.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const LEADS_PAGE_SIZE = 50;

export type LeadFilters = { status?: LeadStatus; client?: string; page?: number };

export async function listLeads(f: LeadFilters = {}): Promise<{ rows: DbLead[]; total: number }> {
  const database = requireDb();
  const where = and(
    f.status ? eq(leads.status, f.status) : undefined,
    f.client ? eq(leads.clientSlug, f.client) : undefined,
  );
  const page = Math.max(1, f.page ?? 1);
  const [rows, totals] = await Promise.all([
    database
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(LEADS_PAGE_SIZE)
      .offset((page - 1) * LEADS_PAGE_SIZE),
    database.select({ n: count() }).from(leads).where(where),
  ]);
  return { rows, total: totals[0]?.n ?? 0 };
}

export async function getLead(id: string): Promise<DbLead | null> {
  if (!UUID_RE.test(id)) return null;
  const database = requireDb();
  const rows = await database.select().from(leads).where(eq(leads.id, id)).limit(1);
  return rows[0] ?? null;
}

/** Returns false when the id is unknown/invalid. */
export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  if (!UUID_RE.test(id)) return false;
  const database = requireDb();
  const updated = await database
    .update(leads)
    .set({ status })
    .where(eq(leads.id, id))
    .returning({ id: leads.id });
  return updated.length > 0;
}

/** Distinct client slugs — the list page shows a client filter only when >1. */
export async function distinctClientSlugs(): Promise<string[]> {
  const database = requireDb();
  const rows = await database.selectDistinct({ slug: leads.clientSlug }).from(leads);
  return rows.map((r) => r.slug).sort();
}
