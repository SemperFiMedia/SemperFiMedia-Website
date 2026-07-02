# Admin Leads Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admin-only dashboard at `/admin/leads` where TJ can browse chatbot leads, read transcripts, and update lead status.

**Architecture:** Server-rendered App Router pages querying Drizzle directly, gated by the existing `isAdmin()` session helper. One small `PATCH` API route + one client component handle status updates. Mirrors the existing `reel-recon/moderation` page and `api/admin/users/[id]/block` route patterns.

**Tech Stack:** Next.js 16 (App Router, async `params`/`searchParams`), Drizzle ORM + Railway Postgres, NextAuth (Google), Tailwind (brand tokens: `brass`, `bone`, `bone-muted`, `bone-subtle`), vitest for API route tests.

**Spec:** `docs/superpowers/specs/2026-07-02-admin-leads-dashboard-design.md`

**Working directory:** all paths below are relative to `site/`. All commands run from `site/`.

**Codebase conventions to follow (do not deviate):**
- Admin gate: `if (!(await isAdmin())) notFound();` — see `src/app/reel-recon/moderation/page.tsx`
- API guard order: `hasDb` 503 → signed-in 401 → admin 403 — see `src/app/api/admin/users/[id]/block/route.ts`
- DB access: services in `src/lib/**` use `requireDb()` throwing `DbUnavailableError` — see `src/lib/comments/service.ts`
- `db` is **null** when `DATABASE_URL` is unset; pages check `hasDb` before calling services
- Next 16: `params` and `searchParams` are **Promises** — always `await` them
- This repo's Next.js is v16 with breaking changes; if any API behaves unexpectedly, check `node_modules/next/dist/docs/` before working around it

---

### Task 1: Lead status module + admin data service

**Files:**
- Create: `src/lib/chatbot/lead-status.ts`
- Create: `src/lib/chatbot/leads-admin.ts`

`lead-status.ts` is a tiny dependency-free module so the client component can import the status list without dragging in `postgres`/`env` (which are server-only).

- [ ] **Step 1: Create `src/lib/chatbot/lead-status.ts`**

```ts
// Shared between server code and client components — keep dependency-free.
export const LEAD_STATUSES = ['new', 'contacted', 'won', 'lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export function isLeadStatus(v: unknown): v is LeadStatus {
  return typeof v === 'string' && (LEAD_STATUSES as readonly string[]).includes(v);
}
```

- [ ] **Step 2: Create `src/lib/chatbot/leads-admin.ts`**

```ts
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
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/chatbot/lead-status.ts src/lib/chatbot/leads-admin.ts
git commit -m "feat: lead status module + admin leads data service"
```

---

### Task 2: `PATCH /api/admin/leads/[id]` route (TDD)

**Files:**
- Test: `src/app/api/admin/leads/[id]/route.test.ts`
- Create: `src/app/api/admin/leads/[id]/route.ts`

Mirrors the mocking style of `src/app/api/comments/[id]/route.test.ts`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const getSessionUser = vi.fn();
const updateLeadStatus = vi.fn();

vi.mock('@/lib/auth/session', () => ({ getSessionUser: () => getSessionUser() }));
vi.mock('@/lib/chatbot/leads-admin', () => ({
  updateLeadStatus: (...a: unknown[]) => updateLeadStatus(...a),
}));
vi.mock('@/lib/db', () => ({ hasDb: true }));

import { PATCH } from './route';

const LEAD_ID = '7f9c24e5-1a2b-4c3d-8e4f-5a6b7c8d9e0f';

function ctx(id: string) {
  return { params: Promise.resolve({ id }) };
}
const req = (body: unknown) =>
  new Request(`http://localhost/api/admin/leads/${LEAD_ID}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });

beforeEach(() => {
  getSessionUser.mockReset();
  updateLeadStatus.mockReset();
});

describe('PATCH lead status', () => {
  it('401 when not signed in', async () => {
    getSessionUser.mockResolvedValue(null);
    expect((await PATCH(req({ status: 'contacted' }), ctx(LEAD_ID))).status).toBe(401);
  });
  it('403 when not admin', async () => {
    getSessionUser.mockResolvedValue({ id: 'u1', role: 'user', isBlocked: false });
    expect((await PATCH(req({ status: 'contacted' }), ctx(LEAD_ID))).status).toBe(403);
  });
  it('400 on an unknown status value', async () => {
    getSessionUser.mockResolvedValue({ id: 'a1', role: 'admin', isBlocked: false });
    expect((await PATCH(req({ status: 'sold' }), ctx(LEAD_ID))).status).toBe(400);
    expect(updateLeadStatus).not.toHaveBeenCalled();
  });
  it('400 on a malformed body', async () => {
    getSessionUser.mockResolvedValue({ id: 'a1', role: 'admin', isBlocked: false });
    const badReq = new Request(`http://localhost/api/admin/leads/${LEAD_ID}`, {
      method: 'PATCH',
      body: 'not json',
    });
    expect((await PATCH(badReq, ctx(LEAD_ID))).status).toBe(400);
  });
  it('404 when the lead does not exist', async () => {
    getSessionUser.mockResolvedValue({ id: 'a1', role: 'admin', isBlocked: false });
    updateLeadStatus.mockResolvedValue(false);
    expect((await PATCH(req({ status: 'won' }), ctx(LEAD_ID))).status).toBe(404);
  });
  it('updates status as admin', async () => {
    getSessionUser.mockResolvedValue({ id: 'a1', role: 'admin', isBlocked: false });
    updateLeadStatus.mockResolvedValue(true);
    const res = await PATCH(req({ status: 'won' }), ctx(LEAD_ID));
    expect(res.status).toBe(200);
    expect(updateLeadStatus).toHaveBeenCalledWith(LEAD_ID, 'won');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/admin/leads`
Expected: FAIL — cannot resolve `./route`.

- [ ] **Step 3: Implement the route**

```ts
import { hasDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth/session';
import { updateLeadStatus } from '@/lib/chatbot/leads-admin';
import { isLeadStatus } from '@/lib/chatbot/lead-status';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!hasDb) return Response.json({ error: 'Leads unavailable.' }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return Response.json({ error: 'Sign in.' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Not allowed.' }, { status: 403 });

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as { status?: unknown } | null;
  if (!body || !isLeadStatus(body.status)) {
    return Response.json({ error: 'Invalid status.' }, { status: 400 });
  }

  const updated = await updateLeadStatus(id, body.status);
  if (!updated) return Response.json({ error: 'Lead not found.' }, { status: 404 });
  return Response.json({ ok: true });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/api/admin/leads`
Expected: 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/admin/leads
git commit -m "feat: PATCH /api/admin/leads/[id] status update route"
```

---

### Task 3: Admin layout gate + robots disallow

**Files:**
- Create: `src/app/admin/layout.tsx`
- Modify: `src/app/robots.ts` (add one disallow rule)

- [ ] **Step 1: Create `src/app/admin/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false } };

// First line of defense. Layouts don't re-run on every client-side
// navigation, so every admin page ALSO gates itself with isAdmin().
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/api/auth/signin?callbackUrl=/admin/leads');
  if (user.role !== 'admin') notFound();
  return <>{children}</>;
}
```

(`callbackUrl` is hardcoded to `/admin/leads` — the only admin section; a layout can't cheaply know the requested path.)

- [ ] **Step 2: Add `/admin` to `src/app/robots.ts`**

In the `rules` array, after the `/api` rule, add:

```ts
      { userAgent: '*', disallow: '/admin' },
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/layout.tsx src/app/robots.ts
git commit -m "feat: admin layout auth gate; noindex + robots disallow for /admin"
```

---

### Task 4: `LeadStatusControl` client component

**Files:**
- Create: `src/components/admin/lead-status-control.tsx`

Optimistic local state so the `<select>` doesn't snap back while the PATCH is in flight; reverts on failure; `router.refresh()` re-renders the server page on success.

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LEAD_STATUSES, type LeadStatus } from '@/lib/chatbot/lead-status';

export function LeadStatusControl({ leadId, status }: { leadId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [, startTransition] = useTransition();

  async function onChange(next: LeadStatus) {
    setError(false);
    setSaving(true);
    setValue(next);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      startTransition(() => router.refresh());
    } catch {
      setValue(status); // revert
      setError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <select
        value={value}
        disabled={saving}
        onChange={(e) => void onChange(e.target.value as LeadStatus)}
        aria-label="Lead status"
        className="rounded border border-bone/20 bg-black px-2 py-1 text-sm text-bone-muted disabled:opacity-50"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-red-400">save failed</span> : null}
    </span>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/lead-status-control.tsx
git commit -m "feat: lead status control client component"
```

---

### Task 5: Leads list page — `/admin/leads`

**Files:**
- Create: `src/app/admin/leads/page.tsx`

Server component. Status tabs + client filter as plain links (no client JS); desktop table + mobile cards; pagination.

- [ ] **Step 1: Create the page**

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { isAdmin } from '@/lib/auth/session';
import { hasDb } from '@/lib/db';
import { LEADS_PAGE_SIZE, distinctClientSlugs, listLeads } from '@/lib/chatbot/leads-admin';
import { LEAD_STATUSES, isLeadStatus, type LeadStatus } from '@/lib/chatbot/lead-status';
import { LeadStatusControl } from '@/components/admin/lead-status-control';

export const dynamic = 'force-dynamic';

type Search = Promise<{ status?: string; client?: string; page?: string }>;

function href(params: { status?: string; client?: string; page?: number }) {
  const q = new URLSearchParams();
  if (params.status) q.set('status', params.status);
  if (params.client) q.set('client', params.client);
  if (params.page && params.page > 1) q.set('page', String(params.page));
  const s = q.toString();
  return s ? `/admin/leads?${s}` : '/admin/leads';
}

function fmtDate(d: Date) {
  return new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export default async function AdminLeadsPage({ searchParams }: { searchParams: Search }) {
  if (!(await isAdmin())) notFound();

  const sp = await searchParams;
  const status: LeadStatus | undefined = isLeadStatus(sp.status) ? sp.status : undefined;
  const client = sp.client || undefined;
  const page = Math.max(1, Number.parseInt(sp.page ?? '1', 10) || 1);

  if (!hasDb) {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-black px-6 pt-28 pb-20 md:px-12 md:pt-36">
          <div className="mx-auto max-w-[1100px]">
            <DataLabel className="mb-6 text-brass">Chatbot Leads</DataLabel>
            <p className="text-bone-muted">Leads unavailable — database is not configured.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const [{ rows, total }, slugs] = await Promise.all([
    listLeads({ status, client, page }),
    distinctClientSlugs(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE));

  const tabs: { label: string; value?: LeadStatus }[] = [
    { label: 'All' },
    ...LEAD_STATUSES.map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: s })),
  ];

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-black px-6 pt-28 pb-20 md:px-12 md:pt-36">
        <div className="mx-auto max-w-[1100px]">
          <DataLabel className="mb-2 text-brass">Chatbot Leads</DataLabel>
          <p className="mb-6 text-sm text-bone-subtle">
            {total} lead{total === 1 ? '' : 's'}
            {status ? ` · ${status}` : ''}
            {client ? ` · ${client}` : ''}
          </p>

          {/* Status tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            {tabs.map((t) => {
              const active = t.value === status;
              return (
                <Link
                  key={t.label}
                  href={href({ status: t.value, client })}
                  className={
                    active
                      ? 'rounded border border-brass px-3 py-1 text-sm text-brass'
                      : 'rounded border border-bone/20 px-3 py-1 text-sm text-bone-muted hover:border-bone/40'
                  }
                >
                  {t.label}
                </Link>
              );
            })}
          </div>

          {/* Client filter — only when leads span more than one client */}
          {slugs.length > 1 ? (
            <div className="mb-6 flex flex-wrap gap-2">
              <Link
                href={href({ status })}
                className={
                  !client
                    ? 'rounded border border-brass px-3 py-1 text-xs text-brass'
                    : 'rounded border border-bone/20 px-3 py-1 text-xs text-bone-muted hover:border-bone/40'
                }
              >
                All clients
              </Link>
              {slugs.map((s) => (
                <Link
                  key={s}
                  href={href({ status, client: s })}
                  className={
                    client === s
                      ? 'rounded border border-brass px-3 py-1 text-xs text-brass'
                      : 'rounded border border-bone/20 px-3 py-1 text-xs text-bone-muted hover:border-bone/40'
                  }
                >
                  {s}
                </Link>
              ))}
            </div>
          ) : null}

          {rows.length === 0 ? (
            <p className="text-bone-muted">No leads{status || client ? ' match this filter' : ' yet'}.</p>
          ) : (
            <>
              {/* Desktop table */}
              <table className="hidden w-full border-collapse text-left text-sm md:table">
                <thead>
                  <tr className="border-b border-bone/20 text-bone-subtle">
                    <th className="py-2 pr-4 font-normal">Received</th>
                    <th className="py-2 pr-4 font-normal">Name</th>
                    <th className="py-2 pr-4 font-normal">Contact</th>
                    <th className="py-2 pr-4 font-normal">Service</th>
                    <th className="py-2 pr-4 font-normal">Tier</th>
                    <th className="py-2 pr-4 font-normal">Page</th>
                    <th className="py-2 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((l) => (
                    <tr key={l.id} className="border-b border-bone/10 align-top">
                      <td className="py-3 pr-4 whitespace-nowrap text-bone-subtle">{fmtDate(l.createdAt)}</td>
                      <td className="py-3 pr-4">
                        <Link href={`/admin/leads/${l.id}`} className="text-brass underline">
                          {l.name}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-bone-muted">
                        {l.email ?? ''}
                        {l.email && l.phone ? ' · ' : ''}
                        {l.phone ?? ''}
                      </td>
                      <td className="py-3 pr-4 text-bone-muted">{l.service}</td>
                      <td className="py-3 pr-4 text-bone-muted">{l.tierRecommended ?? '—'}</td>
                      <td className="py-3 pr-4 text-bone-subtle">{l.pagePath ?? '—'}</td>
                      <td className="py-3">
                        <LeadStatusControl leadId={l.id} status={l.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile cards */}
              <ul className="space-y-4 md:hidden">
                {rows.map((l) => (
                  <li key={l.id} className="rounded border border-bone/10 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <Link href={`/admin/leads/${l.id}`} className="text-brass underline">
                        {l.name}
                      </Link>
                      <LeadStatusControl leadId={l.id} status={l.status} />
                    </div>
                    <div className="mt-1 text-sm text-bone-muted">
                      {l.service}
                      {l.tierRecommended ? ` · ${l.tierRecommended}` : ''}
                    </div>
                    <div className="mt-1 text-sm text-bone-muted">
                      {[l.email, l.phone].filter(Boolean).join(' · ')}
                    </div>
                    <div className="mt-1 text-xs text-bone-subtle">{fmtDate(l.createdAt)}</div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 ? (
                <div className="mt-8 flex items-center gap-4 text-sm">
                  {page > 1 ? (
                    <Link href={href({ status, client, page: page - 1 })} className="text-brass underline">
                      ← Newer
                    </Link>
                  ) : null}
                  <span className="text-bone-subtle">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages ? (
                    <Link href={href({ status, client, page: page + 1 })} className="text-brass underline">
                      Older →
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors. (If `DataLabel`'s props differ, match its actual signature in `src/components/primitives/data-label.tsx`.)

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/leads/page.tsx
git commit -m "feat: admin leads list page with filters and pagination"
```

---

### Task 6: Lead detail page — `/admin/leads/[id]`

**Files:**
- Create: `src/app/admin/leads/[id]/page.tsx`

- [ ] **Step 1: Create the page**

```tsx
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { isAdmin } from '@/lib/auth/session';
import { hasDb } from '@/lib/db';
import { getLead } from '@/lib/chatbot/leads-admin';
import { LeadStatusControl } from '@/components/admin/lead-status-control';

export const dynamic = 'force-dynamic';

type Params = Promise<{ id: string }>;

function fmtDate(d: Date) {
  return new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export default async function AdminLeadDetailPage({ params }: { params: Params }) {
  if (!(await isAdmin())) notFound();
  if (!hasDb) notFound();

  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();

  const fields: { label: string; value: ReactNode }[] = [
    { label: 'Received', value: fmtDate(lead.createdAt) },
    { label: 'Client', value: lead.clientSlug },
    {
      label: 'Email',
      value: lead.email ? (
        <a href={`mailto:${lead.email}`} className="text-brass underline">
          {lead.email}
        </a>
      ) : (
        '—'
      ),
    },
    {
      label: 'Phone',
      value: lead.phone ? (
        <a href={`tel:${lead.phone}`} className="text-brass underline">
          {lead.phone}
        </a>
      ) : (
        '—'
      ),
    },
    { label: 'Service', value: lead.service },
    { label: 'Tier recommended', value: lead.tierRecommended ?? '—' },
    { label: 'Captured on page', value: lead.pagePath ?? '—' },
    { label: 'Project details', value: lead.projectDetails ?? '—' },
  ];

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-black px-6 pt-28 pb-20 md:px-12 md:pt-36">
        <div className="mx-auto max-w-[760px]">
          <Link href="/admin/leads" className="text-sm text-bone-subtle hover:text-bone-muted">
            ← All leads
          </Link>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl text-bone-muted">{lead.name}</h1>
            <LeadStatusControl leadId={lead.id} status={lead.status} />
          </div>

          <dl className="mt-6 space-y-3 border-b border-bone/10 pb-8">
            {fields.map((f) => (
              <div key={f.label} className="flex flex-col gap-1 md:flex-row md:gap-4">
                <dt className="w-44 shrink-0 text-sm text-bone-subtle">{f.label}</dt>
                <dd className="text-sm text-bone-muted">{f.value}</dd>
              </div>
            ))}
          </dl>

          <DataLabel className="mt-8 mb-4 text-brass">Conversation</DataLabel>
          {lead.transcript && lead.transcript.length > 0 ? (
            <ul className="space-y-3">
              {lead.transcript.map((m, i) => (
                <li
                  key={i}
                  className={
                    m.role === 'user'
                      ? 'ml-8 rounded border border-brass/30 bg-brass/5 p-3 text-sm text-bone-muted'
                      : 'mr-8 rounded border border-bone/10 p-3 text-sm text-bone-muted'
                  }
                >
                  <div className="mb-1 text-xs text-bone-subtle">
                    {m.role === 'user' ? 'Visitor' : 'Assistant'}
                  </div>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-bone-muted">No transcript stored for this lead.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "src/app/admin/leads/[id]/page.tsx"
git commit -m "feat: admin lead detail page with transcript viewer"
```

---

### Task 7: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the whole test suite**

Run: `npm test`
Expected: all tests pass (existing suites + the 6 new PATCH tests).

- [ ] **Step 2: Typecheck + production build**

Run: `npm run typecheck && npm run build`
Expected: both succeed. Watch for prerender errors — every new page/layout exports `force-dynamic`, so none should appear.

- [ ] **Step 3: Manual verification (needs `DATABASE_URL` with migration 0001 applied)**

Precondition: the `leads` table exists — if not yet migrated, run `npm run db:migrate` with `DATABASE_URL` set to the Railway `DATABASE_PUBLIC_URL`.

Run: `npm run dev`, then verify:
1. Signed out → `/admin/leads` redirects to Google sign-in and returns after auth.
2. Non-admin Google account → `/admin/leads` shows 404.
3. TJ's admin account → list renders; status tabs filter; pagination appears only past 50 leads.
4. Click a lead → detail renders, transcript bubbles show, `mailto:`/`tel:` links work.
5. Change status on detail and on a list row → persists after a hard refresh.
6. `curl -X PATCH http://localhost:3000/api/admin/leads/<real-id> -H 'content-type: application/json' -d '{"status":"contacted"}'` while signed out → 401.

If there are no real leads yet, insert one through the chatbot widget locally (complete a lead-capture conversation), or via SQL:

```sql
INSERT INTO leads (name, email, service, project_details, transcript)
VALUES ('Test Lead', 'test@example.com', 'Wedding film',
        'Test details',
        '[{"role":"user","content":"Hi, I need a wedding video"},{"role":"assistant","content":"Happy to help!"}]');
```

- [ ] **Step 4: Final commit (if any fixups were needed)**

```bash
git add -A && git commit -m "fix: admin leads dashboard verification fixups"
```
