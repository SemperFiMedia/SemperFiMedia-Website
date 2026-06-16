# Reel Recon Discussions — Design Spec

**Date:** 2026-06-15
**Status:** Approved design — ready for implementation plan
**Author:** TJ Gutierrez / Semper Fi Media (designed with Claude Code)

## Summary

Add an authenticated discussion (comments) system under each **Reel Recon** movie
review. Visitors sign in with **Google** and post comments and one-level replies about
the film and TJ's ratings. The system is **custom-built and fully owned** — no third-party
comment service, no external tracking, data lives in the project's own database. TJ
moderates (delete any comment, block any user) with instant (post-moderation) display.

This is the second project spun out of the original "movie ratings + discussion" idea;
the first (the Reel Recon review section) is already shipped. See
[Reel Recon review spec](2026-06-15-reel-recon-movie-reviews-design.md).

## Goals

- Let any Google-authenticated visitor comment on a review and reply one level deep.
- Keep all discussion data owned in the project's own Postgres database.
- Give TJ effective, low-effort moderation (instant display + delete + block).
- Add no third-party tracking and no ad-supported widgets.
- Preserve the review page's static/ISR caching and SEO (comments load client-side).

## Non-Goals (v1 — YAGNI)

- Likes/reactions, comment editing, email/notification on replies.
- Deep/nested threads (only one reply level).
- Full pagination (v1 caps the list; "load more" can come later).
- Markdown/rich text (plain text only, rendered escaped).
- Comments on the regular `/blog` (schema keys off a slug, so it's a later extension).
- A managed auth service (Auth.js is self-hosted) and a managed comment backend.

## Decisions (locked during brainstorming)

| Decision | Choice |
|---|---|
| Build vs buy | **Custom / owned** |
| Auth | **Auth.js v5 (NextAuth), self-hosted, Google provider** |
| Session strategy | **JWT** (stateless); user record upserted on sign-in |
| Database | **Railway Postgres** via **Drizzle ORM** |
| Who can comment | **Anyone with a Google account** |
| Moderation | **Post-moderation**: instant display; admin delete + block user |
| Admin UI | **Both** inline controls **and** a `/reel-recon/moderation` page |
| Thread depth | **Flat + single-level replies** |
| Scope | **Reel Recon reviews only** for now |

## Architecture

Auth.js v5 runs inside the existing Next.js app and handles Google OAuth. A new Railway
Postgres service stores users and comments through Drizzle. The review detail page
(`/reel-recon/[slug]`) remains a statically-cached server component (ISR `revalidate = 60`);
a **client component `CommentsSection`** fetches and posts comments via API route handlers,
so comment activity is fully dynamic without converting the page to SSR or harming SEO.

## Components & File Structure

| File | Responsibility |
|---|---|
| `src/lib/db/schema.ts` | Drizzle table definitions (`users`, `comments`) |
| `src/lib/db/index.ts` | Drizzle client (Postgres pool from `DATABASE_URL`) |
| `drizzle.config.ts` | Drizzle Kit config (migrations dir, schema path) |
| `src/lib/db/migrations/*` | Generated SQL migrations |
| `src/auth.ts` | Auth.js config (Google provider, JWT callbacks, admin-from-email) |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth.js route handlers |
| `src/lib/comments/validation.ts` | zod schema + one-level-reply rule + rate-limit helper |
| `src/lib/comments/queries.ts` | DB access: list/create/soft-delete comments, block user, upsert user |
| `src/app/api/reel-recon/[slug]/comments/route.ts` | `GET` list + `POST` create |
| `src/app/api/comments/[id]/route.ts` | `DELETE` (author or admin) |
| `src/app/api/admin/users/[id]/block/route.ts` | `POST` block (admin only) |
| `src/components/reel-recon/comments/comments-section.tsx` | Client UI: sign-in CTA, form, list |
| `src/components/reel-recon/comments/comment-item.tsx` | One comment + reply affordance + admin controls |
| `src/app/reel-recon/moderation/page.tsx` | Admin-only recent-comments moderation page |
| `src/lib/auth/session.ts` | Server helpers: `getSessionUser()`, `requireAdmin()` |

The review detail page (`src/app/reel-recon/[slug]/page.tsx`) is modified only to mount
`<CommentsSection slug={review.slug.current} />` at the bottom.

## Data Model (Postgres / Drizzle)

**users**
- `id` text PK — Google account `sub`
- `email` text not null
- `name` text
- `image` text
- `role` text not null default `'user'` — `'user' | 'admin'`
- `is_blocked` boolean not null default false
- `created_at` timestamptz not null default now()

**comments**
- `id` uuid PK default gen_random_uuid()
- `review_slug` text not null — the Sanity `reelReconReview` slug; indexed
- `parent_id` uuid null — FK → comments.id; null = top-level, non-null = a reply
- `user_id` text not null — FK → users.id
- `body` text not null
- `is_deleted` boolean not null default false
- `created_at` timestamptz not null default now()
- Index on `(review_slug, created_at)` for listing.

**One-level-reply rule:** on create, if `parent_id` is provided, the referenced parent
must exist and have `parent_id IS NULL`; otherwise the API rejects with 400. Enforced in
`validation.ts` + `queries.ts`.

## Auth & Admin

- Google OAuth credentials configured in Google Cloud; redirect URI
  `https://semperfimedia.llc/api/auth/callback/google` (canonical host — ties to the
  www→root canonical decision).
- Auth.js JWT session. On sign-in, upsert the `users` row; set `role = 'admin'` when the
  email is in `ADMIN_EMAILS`, else `'user'`. The JWT carries `userId` and `role`; the
  session callback exposes them to server code.
- `getSessionUser()` returns the authed user (or null); `requireAdmin()` throws/Returns
  403 when the session role is not admin.

### New environment variables
`DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL` (= `https://semperfimedia.llc`),
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAILS` (comma-separated).
Added to `src/lib/env.ts` typed access and `.env.local.example`.

## API Contract

- `GET /api/reel-recon/[slug]/comments` — public. Returns non-deleted comments for the
  slug, newest first, capped at 200, shaped as a flat list with `parentId` so the client
  groups replies. Soft-deleted comments are returned as `{ body: null, isDeleted: true }`
  only if they have visible replies (so reply context survives); otherwise omitted.
- `POST /api/reel-recon/[slug]/comments` — auth required. Body `{ body: string, parentId?: string }`.
  Rejects if: not signed in (401), user `is_blocked` (403), validation fails (400, body
  1–4000 chars after trim), rate limit exceeded (429, max 5 comments/user/60s), or the
  one-level-reply rule is violated (400). Returns the created comment.
- `DELETE /api/comments/[id]` — auth required. Allowed if requester is the comment's
  author or an admin; else 403. Soft-delete (`is_deleted = true`).
- `POST /api/admin/users/[id]/block` — admin only (403 otherwise). Sets `is_blocked = true`;
  a blocked user's future POSTs are rejected. (Existing comments remain unless deleted.)

All write endpoints validate with zod and treat `body` as plain text (stored raw, rendered
escaped by React — no HTML/markdown parsing).

## UI / Data Flow

1. Review page renders (ISR). `CommentsSection` mounts client-side and `GET`s comments.
2. Signed-out: shows "Sign in with Google to join the discussion" → Auth.js Google flow →
   callback → JWT session; user upserted; admin role derived from `ADMIN_EMAILS`.
3. Signed-in: comment form (top-level) + a "Reply" affordance on each top-level comment
   (one level). Submitting `POST`s, then the list refreshes (optimistic or refetch).
4. Each comment shows author name + Google avatar, relative timestamp, and body.
5. Admin (TJ) additionally sees inline **Delete** (any comment) and **Block** (the author).
6. Blocked users can still read but their `POST`s are rejected with a clear message.

`/reel-recon/moderation` (admin-only; non-admins get 404/redirect) lists the most recent
comments site-wide with the same delete/block controls for fast cleanup.

## Error Handling / Edge Cases

- Unauthenticated POST/DELETE → 401; non-admin admin-action → 403.
- Blocked user POST → 403 with a friendly message.
- Reply to a reply, or to a missing/deleted parent → 400.
- DB unavailable → API returns 503 and the section shows a non-blocking "comments
  unavailable" state; the rest of the review page is unaffected.
- Deleting a top-level comment that has replies → soft-delete, render "[removed]" with
  replies intact.
- Rate-limit exceeded → 429 with retry messaging.
- XSS: bodies stored as plain text and rendered via React escaping; no `dangerouslySetInnerHTML`.

## Testing

- **Unit:** zod validation bounds; one-level-reply enforcement; admin-role-from-email
  resolution; rate-limit window logic.
- **Route handlers:** mirror the existing `src/app/api/*/route.test.ts` pattern — assert
  auth gating (401/403), validation (400), rate limit (429), and success shapes, with the
  DB/session layer mocked.
- **Component:** `CommentsSection` renders the signed-out CTA, the signed-in form, a
  comment list with a reply, and admin-only controls when role is admin.

## Deployment (Railway)

- Provision a Railway **Postgres** service; set `DATABASE_URL`.
- Run Drizzle migrations on release (a deploy/release step, e.g. `drizzle-kit migrate`
  before the app starts) — documented in the plan; the Dockerfile/standalone start path
  must apply pending migrations.
- Create the Google OAuth app; register the canonical redirect URI; set all new env vars
  in Railway.

## Open Items (intentionally deferred)

- Likes/reactions, editing, reply notifications (email), full pagination, markdown.
- Extending comments to `/blog` (slug-keyed schema already allows it).
- Optional future: profanity filter / automated spam scoring beyond rate limiting.
