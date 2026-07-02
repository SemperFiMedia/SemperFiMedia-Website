# Admin Leads Dashboard — Design

**Date:** 2026-07-02
**Status:** Approved
**Context:** Follow-up to chatbot Phase 4 (lead capture). Leads are persisted to the
`leads` table by `captureLead()` (`src/lib/chatbot/leads.ts`) and emailed to TJ, but
there is no way to browse, read, or work them. This adds the admin dashboard from the
chatbot build order.

## Goal

TJ can sign in with his existing Google admin account, see every captured lead,
read the full chat transcript, and move a lead through
`new → contacted → won/lost`. Works well on a phone.

## Scope (v1)

- Lead list with status filter tabs and pagination.
- Lead detail with rendered chat transcript.
- Inline status updates (list row + detail page).
- Multi-tenant aware: a `clientSlug` filter appears only when >1 distinct slug
  exists in the table (invisible today; ready for resold chatbot clients).

**Out of scope (YAGNI):** notes per lead, stats/charts, CSV export, delete,
new-lead polling/notifications (email already covers that), changes to the
status enum (stays `new | contacted | won | lost`).

## Approach

Server-rendered admin pages + one small API route — approach chosen over a
client-side SPA (more surface than TJ's usage justifies) and over using a raw
DB browser (unreadable transcripts, nothing presentable to future chatbot
clients).

Matches existing codebase patterns: server components querying Drizzle
directly, admin gate identical to `api/admin/users/[id]/block`, minimal client
JS.

## Files

```text
src/app/admin/layout.tsx                        — admin gate (once, for all /admin pages)
src/app/admin/leads/page.tsx                    — list (server component)
src/app/admin/leads/[id]/page.tsx               — detail + transcript (server component)
src/app/api/admin/leads/[id]/route.ts           — PATCH { status }
src/components/admin/lead-status-control.tsx    — client component (status select + router.refresh)
src/lib/chatbot/leads-admin.ts                  — listLeads(filters), getLead(id), updateLeadStatus(id, status), distinctClientSlugs()
```

No schema changes; no new migration. Uses the existing
`leads_client_created_idx` for the list query.

## Behavior

### List — `/admin/leads`

- Newest first, 50 per page via `?page=`.
- Columns (table on desktop, cards on mobile): created date, name, contact
  (email/phone), service, tier recommended, page captured on, status.
- Status filter tabs `All · New · Contacted · Won · Lost` via `?status=`.
- `?client=` dropdown rendered only when `distinctClientSlugs()` returns >1.
- Status editable inline per row via `LeadStatusControl`.
- Empty state message when no leads match.

### Detail — `/admin/leads/[id]`

- All lead fields; email as `mailto:`, phone as `tel:` links.
- Transcript rendered as chat bubbles (visitor vs. assistant) from the
  `transcript` jsonb; graceful "no transcript stored" fallback.
- `LeadStatusControl` for status changes.
- Unknown/invalid id → `notFound()`.

### Status update — `PATCH /api/admin/leads/[id]`

- Body `{ status }`, validated against the four allowed values → 400 otherwise.
- Guards, in order: `hasDb` (503), signed in (401), `role === 'admin'` (403) —
  same shape as the existing block route.
- Returns `{ ok: true }`; client calls `router.refresh()`.

## Auth & access

- `admin/layout.tsx` gates every `/admin` page: not signed in → redirect to
  Google sign-in with `callbackUrl` back to the requested page; signed in but
  not admin → `notFound()` so admin URLs stay invisible.
- TJ's Google account already has `role='admin'` (set up for comment
  moderation) — no bootstrapping needed.
- Because App Router layouts don't re-run on every client-side navigation,
  each admin page also calls `isAdmin()` itself (cheap, one session read) and
  the API route re-checks admin server-side (defense in depth).

## Rendering & SEO

- All admin pages `export const dynamic = 'force-dynamic'` (required anyway by
  the layout-cookies gotcha; content must never be cached).
- `robots: { index: false, follow: false }` metadata on the admin layout and
  `/admin` added to the `robots.ts` disallow list.

## Error handling

- No `DATABASE_URL` configured: pages render a "Leads unavailable" notice; API
  returns 503 (existing convention).
- DB query failures on pages surface Next's error boundary; the status PATCH
  returns 500 with a generic message.

## Testing

Repo convention (no test framework in the site): `tsc` typecheck + `next
build`, then manual verification — signed-out redirect, non-admin 404, admin
list/filters/pagination, transcript rendering, and a status update round-trip
against the real database.
