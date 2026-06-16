import { and, asc, desc, eq } from 'drizzle-orm';
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
