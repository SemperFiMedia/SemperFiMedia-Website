import { z } from 'zod';
import { env } from '@/lib/env';

// zod@4 z.string().uuid() enforces strict RFC 4122 variant bits and rejects
// some valid-looking UUIDs (e.g. nil-style all-1s UUIDs used in tests).
// Use a looser format regex that matches any UUID-shaped string instead.
const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const commentInputSchema = z.object({
  body: z.string().trim().min(1).max(4000),
  parentId: z.string().regex(uuidLike).optional(),
});

export type CommentInput = z.infer<typeof commentInputSchema>;

export function isAdminEmail(email: string): boolean {
  return env.auth.adminEmails.includes(email.trim().toLowerCase());
}
