import { pgTable, text, uuid, boolean, timestamp, index, jsonb } from 'drizzle-orm/pg-core';

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

// Chatbot leads — captured through conversation (multi-tenant via clientSlug).
export const leads = pgTable(
  'leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clientSlug: text('client_slug').notNull().default('semper-fi-media'),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    service: text('service').notNull(),
    projectDetails: text('project_details'),
    tierRecommended: text('tier_recommended'),
    pagePath: text('page_path'),
    transcript: jsonb('transcript').$type<{ role: string; content: string }[]>(),
    status: text('status').notNull().default('new'), // new | contacted | won | lost
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('leads_client_created_idx').on(t.clientSlug, t.createdAt)],
);

export type DbUser = typeof users.$inferSelect;
export type DbComment = typeof comments.$inferSelect;
export type DbLead = typeof leads.$inferSelect;
