# Reel Recon Discussions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add custom-owned, Google-authenticated comments (flat + one-level replies, instant post-moderation) under each Reel Recon movie review, backed by Railway Postgres.

**Architecture:** Auth.js v5 (self-hosted, Google, JWT sessions) handles login. Drizzle ORM over Railway Postgres stores `users` + `comments`. The review page stays ISR-cached; a client `CommentsSection` reads/writes via Next route handlers. The DB client is null-guarded (like the existing `sanityClient`) so the app builds and runs without a database — comment endpoints return 503 until `DATABASE_URL` is set.

**Tech Stack:** Next.js 16.2.3 (App Router), React 19, `next-auth@5` (beta), `drizzle-orm` + `postgres` (postgres-js), `drizzle-kit` (dev), `zod` (already present), Vitest. Reuses existing `@/lib/rate-limit` and the env/route/test patterns.

**Spec:** `docs/superpowers/specs/2026-06-15-reel-recon-discussions-design.md`

**Infra prerequisite (user-provisioned, NOT code):** A Railway Postgres service (`DATABASE_URL`) and a Google OAuth app (client id/secret + redirect URI `https://semperfimedia.llc/api/auth/callback/google`). DB-dependent runtime verification is gated on these; all code, unit tests, and `npm run build` work without them.

---

## File Structure

| File | Responsibility | Action |
|------|----------------|--------|
| `package.json` | Add `next-auth`, `drizzle-orm`, `postgres`; dev `drizzle-kit` | Modify |
| `src/lib/env.ts` | Add `db` + `auth` env access | Modify |
| `.env.local.example` | Document new env vars | Modify |
| `src/lib/db/schema.ts` | Drizzle `users` + `comments` tables | Create |
| `src/lib/db/index.ts` | Null-guarded Drizzle client | Create |
| `drizzle.config.ts` | Drizzle Kit config | Create |
| `src/lib/db/migrations/*` | Generated SQL migrations | Create (generated) |
| `src/auth.ts` | Auth.js config (Google, JWT callbacks, admin-from-email, block check) | Create |
| `src/app/api/auth/[...nextauth]/route.ts` | Auth.js handlers | Create |
| `src/lib/auth/session.ts` | `getSessionUser()`, `requireAdmin()` | Create |
| `src/lib/comments/validation.ts` | zod schema + admin-email + one-level-reply guard | Create |
| `src/lib/comments/validation.test.ts` | Unit tests | Create |
| `src/lib/comments/service.ts` | DB access: list/create/soft-delete/upsert-user/block | Create |
| `src/app/api/reel-recon/[slug]/comments/route.ts` | GET list + POST create | Create |
| `src/app/api/reel-recon/[slug]/comments/route.test.ts` | Route tests | Create |
| `src/app/api/comments/[id]/route.ts` | DELETE (author/admin) | Create |
| `src/app/api/comments/[id]/route.test.ts` | Route tests | Create |
| `src/app/api/admin/users/[id]/block/route.ts` | POST block (admin) | Create |
| `src/components/reel-recon/comments/comments-section.tsx` | Client UI: session, form, list | Create |
| `src/components/reel-recon/comments/comment-item.tsx` | One comment + reply + admin controls | Create |
| `src/app/reel-recon/moderation/page.tsx` | Admin-only moderation page | Create |
| `src/app/reel-recon/[slug]/page.tsx` | Mount `<CommentsSection>` | Modify |
| `scripts/migrate.mjs` | Run migrations on deploy | Create |
| `Dockerfile` | Copy migrations + script; run on start | Modify |
| `railway.json` | startCommand runs migrate then server | Modify |

---

## Task 1: Install dependencies

**Files:** Modify `package.json` (via npm).

- [ ] **Step 1: Install runtime + dev deps**

Run from `site/`:
```bash
npm install next-auth@^5.0.0-beta.25 drizzle-orm@^0.38.0 postgres@^3.4.5
npm install -D drizzle-kit@^0.30.0
```

- [ ] **Step 2: Verify they resolved**

Run: `npm ls next-auth drizzle-orm postgres drizzle-kit`
Expected: all four listed with versions, no "missing" / peer errors that block install.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add next-auth, drizzle-orm, postgres deps"
```

---

## Task 2: Environment access

**Files:** Modify `src/lib/env.ts`; Modify `.env.local.example`.

- [ ] **Step 1: Add env sections**

In `src/lib/env.ts`, add these two keys inside the `env` object (after the `anthropic` block, before `gbp`):

```ts
  db: {
    url: process.env.DATABASE_URL ?? '',
  },
  auth: {
    secret: process.env.AUTH_SECRET ?? '',
    url: fallback(process.env.AUTH_URL, 'https://semperfimedia.llc'),
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    adminEmails: (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0),
  },
```

- [ ] **Step 2: Document the env vars**

Append to `.env.local.example`:

```
# Discussions (comments) — Postgres + Google auth
DATABASE_URL=postgres://user:password@host:5432/dbname
AUTH_SECRET=generate-with-npx-auth-secret
AUTH_URL=https://semperfimedia.llc
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAILS=semperfimedia.tx@gmail.com
```

- [ ] **Step 3: Typecheck + commit**

Run: `npm run typecheck` → Expected: PASS.
```bash
git add src/lib/env.ts .env.local.example
git commit -m "feat: add db + auth env access"
```

---

## Task 3: Drizzle schema

**Files:** Create `src/lib/db/schema.ts`.

- [ ] **Step 1: Create the schema**

```ts
import { pgTable, text, uuid, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Google account `sub`
  email: text('email').notNull(),
  name: text('name'),
  image: text('image'),
  role: text('role').notNull().default('user'), // 'user' | 'admin'
  isBlocked: boolean('is_blocked').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reviewSlug: text('review_slug').notNull(),
    parentId: uuid('parent_id'),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    body: text('body').notNull(),
    isDeleted: boolean('is_deleted').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('comments_slug_created_idx').on(t.reviewSlug, t.createdAt)],
);

export type DbUser = typeof users.$inferSelect;
export type DbComment = typeof comments.$inferSelect;
```

- [ ] **Step 2: Typecheck + commit**

Run: `npm run typecheck` → Expected: PASS.
```bash
git add src/lib/db/schema.ts
git commit -m "feat: add drizzle schema for users and comments"
```

---

## Task 4: Drizzle client (null-guarded) + config

**Files:** Create `src/lib/db/index.ts`; Create `drizzle.config.ts`.

- [ ] **Step 1: Create the client**

`src/lib/db/index.ts`:
```ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/lib/env';
import * as schema from './schema';

export const hasDb = Boolean(env.db.url);

// Null when DATABASE_URL is unset so the app builds/runs without a database;
// comment endpoints return 503 until it is configured (mirrors sanityClient).
const queryClient = hasDb ? postgres(env.db.url, { prepare: false }) : null;

export const db = queryClient ? drizzle(queryClient, { schema }) : null;
```

- [ ] **Step 2: Create the Drizzle Kit config**

`drizzle.config.ts`:
```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
});
```

- [ ] **Step 3: Generate the initial migration**

Run: `npx drizzle-kit generate`
Expected: creates SQL under `src/lib/db/migrations/` (a `0000_*.sql` + meta). This reads the schema only and does NOT need a live DB.

- [ ] **Step 4: Typecheck + commit**

Run: `npm run typecheck` → Expected: PASS.
```bash
git add src/lib/db/index.ts drizzle.config.ts src/lib/db/migrations
git commit -m "feat: add drizzle client and initial migration"
```

---

## Task 5: Auth.js configuration

**Files:** Create `src/auth.ts`; Create `src/app/api/auth/[...nextauth]/route.ts`.

- [ ] **Step 1: Create the Auth.js config**

`src/auth.ts`:
```ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { env } from '@/lib/env';
import { upsertUserOnSignIn, getUserById } from '@/lib/comments/service';
import { isAdminEmail } from '@/lib/comments/validation';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: env.auth.secret,
  providers: [
    Google({
      clientId: env.auth.googleClientId,
      clientSecret: env.auth.googleClientSecret,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, profile }) {
      const sub = profile?.sub ?? user.id;
      if (!sub || !user.email) return false;
      await upsertUserOnSignIn({
        id: sub,
        email: user.email,
        name: user.name ?? null,
        image: user.image ?? null,
        role: isAdminEmail(user.email) ? 'admin' : 'user',
      });
      return true;
    },
    async jwt({ token, profile, user }) {
      const sub = profile?.sub ?? user?.id ?? token.sub;
      if (sub) {
        token.userId = sub;
        const record = await getUserById(sub);
        token.role = record?.role ?? 'user';
        token.isBlocked = record?.isBlocked ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = (token.userId as string) ?? '';
      session.user.role = (token.role as string) ?? 'user';
      session.user.isBlocked = Boolean(token.isBlocked);
      return session;
    },
  },
});
```

- [ ] **Step 2: Add the session type augmentation**

Create `src/types/next-auth.d.ts`:
```ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      isBlocked: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
```

- [ ] **Step 3: Create the route handler**

`src/app/api/auth/[...nextauth]/route.ts`:
```ts
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

- [ ] **Step 4: Typecheck + commit**

Run: `npm run typecheck` → Expected: PASS.
```bash
git add src/auth.ts src/types/next-auth.d.ts "src/app/api/auth/[...nextauth]/route.ts"
git commit -m "feat: add Auth.js google login (jwt, admin-from-email)"
```

> **Ordering note (important):** `src/auth.ts` imports `isAdminEmail` from `@/lib/comments/validation` (Task 6) and `upsertUserOnSignIn`/`getUserById` from `@/lib/comments/service` (Task 7). **Implement Tasks 6 and 7 before this task's typecheck/commit.** Recommended dispatch order: 1, 2, 3, 4, 6, 7, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16. The numbering is narrative; dependencies are what matter.

---

## Task 6: Comment validation + admin helper (TDD)

**Files:** Create `src/lib/comments/validation.ts`; Test `src/lib/comments/validation.test.ts`.

- [ ] **Step 1: Write the failing tests**

`src/lib/comments/validation.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { commentInputSchema, isAdminEmail } from './validation';

describe('commentInputSchema', () => {
  it('accepts a valid top-level comment', () => {
    const r = commentInputSchema.safeParse({ body: 'Great breakdown of the action.' });
    expect(r.success).toBe(true);
  });
  it('accepts a reply with a parentId', () => {
    const r = commentInputSchema.safeParse({
      body: 'Agreed.',
      parentId: '11111111-1111-1111-1111-111111111111',
    });
    expect(r.success).toBe(true);
  });
  it('rejects an empty body', () => {
    expect(commentInputSchema.safeParse({ body: '   ' }).success).toBe(false);
  });
  it('rejects a body over 4000 chars', () => {
    expect(commentInputSchema.safeParse({ body: 'x'.repeat(4001) }).success).toBe(false);
  });
  it('rejects a non-uuid parentId', () => {
    expect(commentInputSchema.safeParse({ body: 'hi', parentId: 'nope' }).success).toBe(false);
  });
});

describe('isAdminEmail', () => {
  it('matches configured admin emails case-insensitively', () => {
    expect(isAdminEmail('SemperFiMedia.TX@gmail.com')).toBe(true);
  });
  it('rejects non-admin emails', () => {
    expect(isAdminEmail('random@example.com')).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run src/lib/comments/validation.test.ts`
Expected: FAIL (cannot resolve `./validation`). The `isAdminEmail` test assumes `ADMIN_EMAILS` includes `semperfimedia.tx@gmail.com`; set it for the test run via the vitest env or rely on Step 3 reading `env.auth.adminEmails` — to keep the test deterministic, mock env (see Step 3 note).

- [ ] **Step 3: Implement**

`src/lib/comments/validation.ts`:
```ts
import { z } from 'zod';
import { env } from '@/lib/env';

export const commentInputSchema = z.object({
  body: z.string().trim().min(1).max(4000),
  parentId: z.string().uuid().optional(),
});

export type CommentInput = z.infer<typeof commentInputSchema>;

export function isAdminEmail(email: string): boolean {
  return env.auth.adminEmails.includes(email.trim().toLowerCase());
}
```

Add a deterministic env mock at the top of the test file so `isAdminEmail` is stable:
```ts
import { vi } from 'vitest';
vi.mock('@/lib/env', () => ({
  env: { auth: { adminEmails: ['semperfimedia.tx@gmail.com'] } },
}));
```
(Place this mock block ABOVE the `import { ... } from './validation'` line.)

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run src/lib/comments/validation.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/comments/validation.ts src/lib/comments/validation.test.ts
git commit -m "feat: add comment validation and admin-email helper"
```

---

## Task 7: Comment service (DB access)

**Files:** Create `src/lib/comments/service.ts`.

- [ ] **Step 1: Implement the service**

`src/lib/comments/service.ts`:
```ts
import { and, asc, desc, eq, isNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, comments, type DbComment, type DbUser } from '@/lib/db/schema';

export class DbUnavailableError extends Error {}
export class ReplyDepthError extends Error {}

function requireDb() {
  if (!db) throw new DbUnavailableError('Database is not configured');
  return db;
}

export async function upsertUserOnSignIn(u: {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
}): Promise<void> {
  const database = requireDb();
  await database
    .insert(users)
    .values({ id: u.id, email: u.email, name: u.name, image: u.image, role: u.role })
    .onConflictDoUpdate({
      target: users.id,
      // Keep role/isBlocked as already stored; refresh profile fields only.
      set: { email: u.email, name: u.name, image: u.image },
    });
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const database = requireDb();
  const rows = await database.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

export type CommentWithAuthor = DbComment & {
  authorName: string | null;
  authorImage: string | null;
};

export async function listComments(reviewSlug: string): Promise<CommentWithAuthor[]> {
  const database = requireDb();
  return database
    .select({
      id: comments.id,
      reviewSlug: comments.reviewSlug,
      parentId: comments.parentId,
      userId: comments.userId,
      body: comments.body,
      isDeleted: comments.isDeleted,
      createdAt: comments.createdAt,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.reviewSlug, reviewSlug))
    .orderBy(asc(comments.createdAt))
    .limit(200);
}

export async function createComment(input: {
  reviewSlug: string;
  userId: string;
  body: string;
  parentId?: string;
}): Promise<DbComment> {
  const database = requireDb();
  if (input.parentId) {
    const parent = await database
      .select({ parentId: comments.parentId })
      .from(comments)
      .where(and(eq(comments.id, input.parentId), eq(comments.reviewSlug, input.reviewSlug)))
      .limit(1);
    if (!parent[0]) throw new ReplyDepthError('Parent comment not found');
    if (parent[0].parentId !== null) throw new ReplyDepthError('Replies are one level deep');
  }
  const rows = await database
    .insert(comments)
    .values({
      reviewSlug: input.reviewSlug,
      userId: input.userId,
      body: input.body,
      parentId: input.parentId ?? null,
    })
    .returning();
  return rows[0]!;
}

export async function getCommentOwner(id: string): Promise<string | null> {
  const database = requireDb();
  const rows = await database
    .select({ userId: comments.userId })
    .from(comments)
    .where(eq(comments.id, id))
    .limit(1);
  return rows[0]?.userId ?? null;
}

export async function softDeleteComment(id: string): Promise<void> {
  const database = requireDb();
  await database.update(comments).set({ isDeleted: true }).where(eq(comments.id, id));
}

export async function blockUser(id: string): Promise<void> {
  const database = requireDb();
  await database.update(users).set({ isBlocked: true }).where(eq(users.id, id));
}

export async function listRecentComments(limit = 100): Promise<CommentWithAuthor[]> {
  const database = requireDb();
  return database
    .select({
      id: comments.id,
      reviewSlug: comments.reviewSlug,
      parentId: comments.parentId,
      userId: comments.userId,
      body: comments.body,
      isDeleted: comments.isDeleted,
      createdAt: comments.createdAt,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .orderBy(desc(comments.createdAt))
    .limit(limit);
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npm run typecheck` → Expected: PASS.
```bash
git add src/lib/comments/service.ts
git commit -m "feat: add comment service (drizzle data access)"
```

---

## Task 8: Session helpers

**Files:** Create `src/lib/auth/session.ts`.

- [ ] **Step 1: Implement helpers**

`src/lib/auth/session.ts`:
```ts
import { auth } from '@/auth';

export type SessionUser = {
  id: string;
  role: string;
  isBlocked: boolean;
  name?: string | null;
  image?: string | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return {
    id: session.user.id,
    role: session.user.role,
    isBlocked: session.user.isBlocked,
    name: session.user.name,
    image: session.user.image,
  };
}

export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === 'admin';
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npm run typecheck` → Expected: PASS.
```bash
git add src/lib/auth/session.ts
git commit -m "feat: add server session helpers"
```

---

## Task 9: Comments list/create route (TDD)

**Files:** Create `src/app/api/reel-recon/[slug]/comments/route.ts`; Test `.../route.test.ts`.

- [ ] **Step 1: Write the failing tests**

`src/app/api/reel-recon/[slug]/comments/route.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const getSessionUser = vi.fn();
const createComment = vi.fn();
const listComments = vi.fn();

vi.mock('@/lib/auth/session', () => ({ getSessionUser: () => getSessionUser() }));
vi.mock('@/lib/comments/service', () => ({
  createComment: (...a: unknown[]) => createComment(...a),
  listComments: (...a: unknown[]) => listComments(...a),
  DbUnavailableError: class extends Error {},
  ReplyDepthError: class extends Error {},
}));
vi.mock('@/lib/db', () => ({ hasDb: true }));

import { GET, POST } from './route';

function ctx(slug: string) {
  return { params: Promise.resolve({ slug }) };
}
function postReq(body: unknown) {
  return new Request('http://localhost/api/reel-recon/x/comments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  getSessionUser.mockReset();
  createComment.mockReset();
  listComments.mockReset();
});

describe('GET comments', () => {
  it('returns the list for a slug', async () => {
    listComments.mockResolvedValue([]);
    const res = await GET(new Request('http://localhost/x'), ctx('the-punisher'));
    expect(res.status).toBe(200);
    expect(listComments).toHaveBeenCalledWith('the-punisher');
  });
});

describe('POST comments', () => {
  it('401 when not signed in', async () => {
    getSessionUser.mockResolvedValue(null);
    const res = await POST(postReq({ body: 'hi' }), ctx('the-punisher'));
    expect(res.status).toBe(401);
  });
  it('403 when blocked', async () => {
    getSessionUser.mockResolvedValue({ id: 'u1', role: 'user', isBlocked: true });
    const res = await POST(postReq({ body: 'hi' }), ctx('the-punisher'));
    expect(res.status).toBe(403);
  });
  it('400 on invalid body', async () => {
    getSessionUser.mockResolvedValue({ id: 'u1', role: 'user', isBlocked: false });
    const res = await POST(postReq({ body: '   ' }), ctx('the-punisher'));
    expect(res.status).toBe(400);
  });
  it('201 on success', async () => {
    getSessionUser.mockResolvedValue({ id: 'u1', role: 'user', isBlocked: false });
    createComment.mockResolvedValue({ id: 'c1', body: 'hi' });
    const res = await POST(postReq({ body: 'hi' }), ctx('the-punisher'));
    expect(res.status).toBe(201);
    expect(createComment).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run "src/app/api/reel-recon/[slug]/comments/route.test.ts"`
Expected: FAIL (cannot resolve `./route`).

- [ ] **Step 3: Implement the route**

`src/app/api/reel-recon/[slug]/comments/route.ts`:
```ts
import { hasDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth/session';
import { checkRateLimit } from '@/lib/rate-limit';
import { commentInputSchema } from '@/lib/comments/validation';
import { createComment, listComments, ReplyDepthError } from '@/lib/comments/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!hasDb) return Response.json({ error: 'Comments unavailable.' }, { status: 503 });
  const { slug } = await params;
  const rows = await listComments(slug);
  return Response.json({ comments: rows });
}

export async function POST(request: Request, { params }: Ctx) {
  if (!hasDb) return Response.json({ error: 'Comments unavailable.' }, { status: 503 });
  const { slug } = await params;

  const user = await getSessionUser();
  if (!user) return Response.json({ error: 'Sign in to comment.' }, { status: 401 });
  if (user.isBlocked) return Response.json({ error: 'Your account cannot post.' }, { status: 403 });

  const limit = checkRateLimit(`comment:${user.id}`, 5, 60_000);
  if (!limit.ok) return Response.json({ error: 'Slow down a moment.' }, { status: 429 });

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const parsed = commentInputSchema.safeParse(json);
  if (!parsed.success) return Response.json({ error: 'Comment is empty or too long.' }, { status: 400 });

  try {
    const created = await createComment({
      reviewSlug: slug,
      userId: user.id,
      body: parsed.data.body,
      parentId: parsed.data.parentId,
    });
    return Response.json({ comment: created }, { status: 201 });
  } catch (e) {
    if (e instanceof ReplyDepthError) {
      return Response.json({ error: 'Replies are one level deep.' }, { status: 400 });
    }
    return Response.json({ error: 'Could not post comment.' }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run "src/app/api/reel-recon/[slug]/comments/route.test.ts"`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add "src/app/api/reel-recon/[slug]/comments/route.ts" "src/app/api/reel-recon/[slug]/comments/route.test.ts"
git commit -m "feat: add comments list/create route"
```

---

## Task 10: Delete-comment route (TDD)

**Files:** Create `src/app/api/comments/[id]/route.ts`; Test `.../route.test.ts`.

- [ ] **Step 1: Write the failing tests**

`src/app/api/comments/[id]/route.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const getSessionUser = vi.fn();
const getCommentOwner = vi.fn();
const softDeleteComment = vi.fn();

vi.mock('@/lib/auth/session', () => ({ getSessionUser: () => getSessionUser() }));
vi.mock('@/lib/comments/service', () => ({
  getCommentOwner: (...a: unknown[]) => getCommentOwner(...a),
  softDeleteComment: (...a: unknown[]) => softDeleteComment(...a),
}));
vi.mock('@/lib/db', () => ({ hasDb: true }));

import { DELETE } from './route';

function ctx(id: string) {
  return { params: Promise.resolve({ id }) };
}
const req = () => new Request('http://localhost/api/comments/c1', { method: 'DELETE' });

beforeEach(() => {
  getSessionUser.mockReset();
  getCommentOwner.mockReset();
  softDeleteComment.mockReset();
});

describe('DELETE comment', () => {
  it('401 when not signed in', async () => {
    getSessionUser.mockResolvedValue(null);
    expect((await DELETE(req(), ctx('c1'))).status).toBe(401);
  });
  it('403 when not owner and not admin', async () => {
    getSessionUser.mockResolvedValue({ id: 'u2', role: 'user', isBlocked: false });
    getCommentOwner.mockResolvedValue('u1');
    expect((await DELETE(req(), ctx('c1'))).status).toBe(403);
  });
  it('allows the author to delete own', async () => {
    getSessionUser.mockResolvedValue({ id: 'u1', role: 'user', isBlocked: false });
    getCommentOwner.mockResolvedValue('u1');
    expect((await DELETE(req(), ctx('c1'))).status).toBe(200);
    expect(softDeleteComment).toHaveBeenCalledWith('c1');
  });
  it('allows an admin to delete any', async () => {
    getSessionUser.mockResolvedValue({ id: 'admin', role: 'admin', isBlocked: false });
    getCommentOwner.mockResolvedValue('u1');
    expect((await DELETE(req(), ctx('c1'))).status).toBe(200);
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run "src/app/api/comments/[id]/route.test.ts"`
Expected: FAIL (cannot resolve `./route`).

- [ ] **Step 3: Implement**

`src/app/api/comments/[id]/route.ts`:
```ts
import { hasDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth/session';
import { getCommentOwner, softDeleteComment } from '@/lib/comments/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!hasDb) return Response.json({ error: 'Comments unavailable.' }, { status: 503 });
  const { id } = await params;

  const user = await getSessionUser();
  if (!user) return Response.json({ error: 'Sign in.' }, { status: 401 });

  const owner = await getCommentOwner(id);
  if (!owner) return Response.json({ error: 'Not found.' }, { status: 404 });

  if (user.role !== 'admin' && owner !== user.id) {
    return Response.json({ error: 'Not allowed.' }, { status: 403 });
  }

  await softDeleteComment(id);
  return Response.json({ ok: true });
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run "src/app/api/comments/[id]/route.test.ts"`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add "src/app/api/comments/[id]/route.ts" "src/app/api/comments/[id]/route.test.ts"
git commit -m "feat: add delete-comment route (author or admin)"
```

---

## Task 11: Block-user route (admin)

**Files:** Create `src/app/api/admin/users/[id]/block/route.ts`.

- [ ] **Step 1: Implement**

`src/app/api/admin/users/[id]/block/route.ts`:
```ts
import { hasDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth/session';
import { blockUser } from '@/lib/comments/service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Ctx) {
  if (!hasDb) return Response.json({ error: 'Comments unavailable.' }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return Response.json({ error: 'Sign in.' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Not allowed.' }, { status: 403 });

  const { id } = await params;
  await blockUser(id);
  return Response.json({ ok: true });
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npm run typecheck` → Expected: PASS.
```bash
git add "src/app/api/admin/users/[id]/block/route.ts"
git commit -m "feat: add admin block-user route"
```

---

## Task 12: Comment UI components

**Files:** Create `src/components/reel-recon/comments/comment-item.tsx`; Create `src/components/reel-recon/comments/comments-section.tsx`.

- [ ] **Step 1: Create the comment item**

`src/components/reel-recon/comments/comment-item.tsx`:
```tsx
'use client';

export type CommentView = {
  id: string;
  parentId: string | null;
  userId: string;
  body: string;
  isDeleted: boolean;
  createdAt: string;
  authorName: string | null;
  authorImage: string | null;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function CommentItem({
  comment,
  isAdmin,
  onReply,
  onDelete,
  onBlock,
}: {
  comment: CommentView;
  isAdmin: boolean;
  onReply?: (id: string) => void;
  onDelete: (id: string) => void;
  onBlock: (userId: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={comment.authorImage ?? '/avatar-placeholder.png'}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-full bg-bone/10 object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-bone">{comment.authorName ?? 'Member'}</span>
          <span className="text-bone-subtle">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="mt-1 leading-relaxed text-bone-muted">
          {comment.isDeleted ? <em className="text-bone-subtle">[removed]</em> : comment.body}
        </p>
        {!comment.isDeleted && (
          <div className="mt-1 flex gap-4 text-xs text-bone-subtle">
            {onReply && comment.parentId === null && (
              <button type="button" onClick={() => onReply(comment.id)} className="hover:text-brass">
                Reply
              </button>
            )}
            <button type="button" onClick={() => onDelete(comment.id)} className="hover:text-brass">
              Delete
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => onBlock(comment.userId)}
                className="hover:text-red-400"
              >
                Block user
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the section**

`src/components/reel-recon/comments/comments-section.tsx`:
```tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSession, signIn, signOut } from 'next-auth/react';
import { DataLabel } from '@/components/primitives/data-label';
import { CommentItem, type CommentView } from './comment-item';

type SessionUser = { id: string; role: string } | null;

export function CommentsSection({ slug }: { slug: string }) {
  const [user, setUser] = useState<SessionUser>(null);
  const [comments, setComments] = useState<CommentView[]>([]);
  const [body, setBody] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/reel-recon/${slug}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments as CommentView[]);
    } else if (res.status === 503) {
      setError('Comments are not available yet.');
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    getSession().then((s) => {
      const su = s?.user as { id?: string; role?: string } | undefined;
      setUser(su?.id ? { id: su.id, role: su.role ?? 'user' } : null);
    });
    load();
  }, [load]);

  async function submit() {
    setError(null);
    const res = await fetch(`/api/reel-recon/${slug}/comments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ body, parentId: replyTo ?? undefined }),
    });
    if (res.ok) {
      setBody('');
      setReplyTo(null);
      await load();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not post comment.');
    }
  }

  async function remove(id: string) {
    await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    await load();
  }

  async function block(userId: string) {
    await fetch(`/api/admin/users/${userId}/block`, { method: 'POST' });
    await load();
  }

  const topLevel = comments.filter((c) => c.parentId === null);
  const repliesOf = (id: string) => comments.filter((c) => c.parentId === id);
  const isAdmin = user?.role === 'admin';

  return (
    <section className="border-t border-brass/15 bg-black px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-[720px]">
        <DataLabel className="mb-6">The Discussion</DataLabel>

        {user ? (
          <div className="mb-8">
            {replyTo && (
              <p className="mb-2 text-xs text-bone-subtle">
                Replying… <button onClick={() => setReplyTo(null)} className="underline">cancel</button>
              </p>
            )}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              maxLength={4000}
              placeholder="Share your take on the film or the rating…"
              className="w-full rounded border border-bone/15 bg-gunpowder p-3 text-bone placeholder:text-bone-subtle"
            />
            <div className="mt-2 flex items-center justify-between">
              <button onClick={() => signOut()} className="text-xs text-bone-subtle hover:text-bone">
                Sign out
              </button>
              <button
                onClick={submit}
                disabled={body.trim().length === 0}
                className="data-label bg-brass px-5 py-2 font-bold text-gunpowder transition-colors hover:bg-golden-hour disabled:opacity-40"
              >
                Post
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="mb-8 data-label bg-brass px-5 py-3 font-bold text-gunpowder transition-colors hover:bg-golden-hour"
          >
            Sign in with Google to join the discussion
          </button>
        )}

        {loading ? (
          <p className="text-bone-subtle">Loading comments…</p>
        ) : topLevel.length === 0 ? (
          <p className="text-bone-subtle">No comments yet. Be the first.</p>
        ) : (
          <ul className="space-y-8">
            {topLevel.map((c) => (
              <li key={c.id}>
                <CommentItem
                  comment={c}
                  isAdmin={isAdmin}
                  onReply={user ? setReplyTo : undefined}
                  onDelete={remove}
                  onBlock={block}
                />
                {repliesOf(c.id).length > 0 && (
                  <ul className="mt-4 space-y-4 border-l border-bone/10 pl-6">
                    {repliesOf(c.id).map((r) => (
                      <li key={r.id}>
                        <CommentItem
                          comment={r}
                          isAdmin={isAdmin}
                          onDelete={remove}
                          onBlock={block}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add the avatar placeholder**

Create a 1×1 transparent fallback so missing avatars don't 404. Run:
```bash
printf '\x89PNG\r\n\x1a\n' > public/avatar-placeholder.png
```
(If that minimal file renders oddly, replace with any small placeholder PNG — it only shows when a Google image is absent.)

- [ ] **Step 4: Typecheck + commit**

Run: `npm run typecheck` → Expected: PASS.
```bash
git add src/components/reel-recon/comments public/avatar-placeholder.png
git commit -m "feat: add comments UI (section + item)"
```

---

## Task 13: Mount comments on the review page

**Files:** Modify `src/app/reel-recon/[slug]/page.tsx`.

- [ ] **Step 1: Import the section**

Add to the imports near the other `@/components/reel-recon/...` imports:
```tsx
import { CommentsSection } from '@/components/reel-recon/comments/comments-section';
```

- [ ] **Step 2: Render it after the body**

In the JSX, immediately AFTER the `{body && ( ... )}` Portable Text `</section>` block and BEFORE the `{related.length > 0 && ( ... )}` block, add:
```tsx
        <CommentsSection slug={review.slug.current} />
```

- [ ] **Step 3: Typecheck + build + commit**

Run: `npm run typecheck` → Expected: PASS.
Run: `npm run build` → Expected: build succeeds; `/reel-recon/[slug]` still compiles.
```bash
git add "src/app/reel-recon/[slug]/page.tsx"
git commit -m "feat: mount discussion under review detail"
```

---

## Task 14: Moderation page (admin)

**Files:** Create `src/app/reel-recon/moderation/page.tsx`.

- [ ] **Step 1: Implement the admin page**

`src/app/reel-recon/moderation/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { isAdmin } from '@/lib/auth/session';
import { hasDb } from '@/lib/db';
import { listRecentComments } from '@/lib/comments/service';

export const dynamic = 'force-dynamic';

export default async function ModerationPage() {
  if (!(await isAdmin())) notFound();
  const recent = hasDb ? await listRecentComments(100) : [];

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-black px-6 pt-28 pb-20 md:px-12 md:pt-36">
        <div className="mx-auto max-w-[900px]">
          <DataLabel className="mb-6 text-brass">Moderation · Recent Comments</DataLabel>
          {recent.length === 0 ? (
            <p className="text-bone-muted">No comments yet.</p>
          ) : (
            <ul className="space-y-6">
              {recent.map((c) => (
                <li key={c.id} className="border-b border-bone/10 pb-4">
                  <div className="text-sm text-bone-subtle">
                    {c.authorName ?? 'Member'} ·{' '}
                    <Link href={`/reel-recon/${c.reviewSlug}`} className="text-brass underline">
                      {c.reviewSlug}
                    </Link>{' '}
                    · {new Date(c.createdAt).toLocaleString('en-US')}
                  </div>
                  <p className="mt-1 text-bone-muted">
                    {c.isDeleted ? <em className="text-bone-subtle">[removed]</em> : c.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-8 text-xs text-bone-subtle">
            Delete and block actions are available inline on each review&apos;s discussion.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Typecheck + commit**

Run: `npm run typecheck` → Expected: PASS.
```bash
git add src/app/reel-recon/moderation/page.tsx
git commit -m "feat: add admin moderation page"
```

---

## Task 15: Deploy wiring (migrations on Railway)

**Files:** Create `scripts/migrate.mjs`; Modify `Dockerfile`; Modify `railway.json`.

- [ ] **Step 1: Create the migrate script**

`scripts/migrate.mjs`:
```js
// Applies pending Drizzle migrations, then exits. Run before the server starts.
// Skips cleanly when DATABASE_URL is unset (e.g. preview builds without a DB).
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const url = process.env.DATABASE_URL;
if (!url) {
  console.log('[migrate] DATABASE_URL not set — skipping migrations.');
  process.exit(0);
}

const sql = postgres(url, { max: 1 });
const db = drizzle(sql);
await migrate(db, { migrationsFolder: './src/lib/db/migrations' });
await sql.end();
console.log('[migrate] migrations applied.');
```

- [ ] **Step 2: Bundle migrations + script into the runner image**

In `Dockerfile`, in the `runner` stage, after the existing `COPY --from=builder ... ./.next/static` line, add:
```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/db/migrations ./src/lib/db/migrations
COPY --from=builder --chown=nextjs:nodejs /app/scripts/migrate.mjs ./scripts/migrate.mjs
```
(The `postgres` and `drizzle-orm` packages are already bundled into `.next/standalone/node_modules` because the app imports them, so the script can resolve them at runtime.)

- [ ] **Step 3: Run migrations before the server starts**

In `railway.json`, change the `startCommand` to:
```json
    "startCommand": "node scripts/migrate.mjs && node server.js",
```

- [ ] **Step 4: Build to confirm nothing broke**

Run: `npm run build` → Expected: build succeeds.
```bash
git add scripts/migrate.mjs Dockerfile railway.json
git commit -m "feat: run drizzle migrations on Railway deploy"
```

---

## Task 16: Full verification

**Files:** none.

- [ ] **Step 1: Full unit suite**

Run: `npm test`
Expected: all new comment/validation/route tests PASS; the only failure is the pre-existing unrelated `src/components/home/hero.test.tsx`.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck` → Expected: PASS.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: succeeds; routes `/reel-recon/[slug]`, `/reel-recon/moderation`, `/api/reel-recon/[slug]/comments`, `/api/comments/[id]`, `/api/admin/users/[id]/block`, `/api/auth/[...nextauth]` all present. Builds WITHOUT `DATABASE_URL` (DB client null-guarded).

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: address discussions verification findings"
```

---

## Task 17: Infra checklist (user-performed — document, do not automate)

Not code. The user provisions these; document them in the PR description:

- [ ] Add a **Railway Postgres** service; set `DATABASE_URL` on the web service.
- [ ] Create a **Google Cloud OAuth 2.0 Client** (Web). Authorized redirect URI:
  `https://semperfimedia.llc/api/auth/callback/google`. Set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
- [ ] Generate `AUTH_SECRET` (`npx auth secret`), set it and `AUTH_URL=https://semperfimedia.llc`.
- [ ] Set `ADMIN_EMAILS=semperfimedia.tx@gmail.com`.
- [ ] After first deploy, sign in once with the admin email so the admin user row is created,
  then verify `/reel-recon/moderation` loads and posting/replying/deleting works on a review.

---

## Self-Review Notes

- **Spec coverage:** Auth.js+Google (T5), Postgres+Drizzle (T3/T4), users+comments model (T3), one-level reply enforcement (T6 schema rule + T7 `createComment`), anyone-with-Google (T9 auth gate), instant post-moderation + delete/block (T10/T11/T12), inline + moderation page (T12/T14), rate limit reuse (T9), XSS-safe plain text (T12 renders escaped), null-guarded DB → 503 (T4/T9), Railway migrations + Google redirect URI (T15/T17). Likes/edit/notifications/pagination/blog-comments excluded per spec.
- **Type consistency:** `getSessionUser`, `createComment`, `listComments`, `getCommentOwner`, `softDeleteComment`, `blockUser`, `listRecentComments`, `commentInputSchema`, `isAdminEmail`, `CommentView`, `CommentsSection`, `CommentItem`, `hasDb`/`db` used with identical names across tasks.
- **Ordering caveat called out:** Task 6 (validation/service deps) must be implemented before Task 5's typecheck — noted inline.
- **No placeholders:** every code step is complete; the only manual items are Task 17 (infra) and the avatar placeholder, both explicitly user/ops actions.
