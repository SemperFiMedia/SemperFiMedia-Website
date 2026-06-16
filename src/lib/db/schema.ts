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
