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
  // Never send the original text of a soft-deleted comment to the client — moderation
  // must actually remove the content from public reach, not just hide it in the UI.
  const safe = rows.map((c) => (c.isDeleted ? { ...c, body: null } : c));
  return Response.json({ comments: safe });
}

export async function POST(request: Request, { params }: Ctx) {
  if (!hasDb) return Response.json({ error: 'Comments unavailable.' }, { status: 503 });
  const { slug } = await params;

  const user = await getSessionUser();
  if (!user) return Response.json({ error: 'Sign in to comment.' }, { status: 401 });
  if (user.isBlocked) return Response.json({ error: 'Your account cannot post.' }, { status: 403 });

  // Per-user limit. NOTE: checkRateLimit is in-memory (per server instance), so with
  // multiple Railway replicas the effective limit is N×5/min and resets on deploy.
  // Fine for launch volume; move to Postgres/Redis if comment spam becomes a problem.
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
