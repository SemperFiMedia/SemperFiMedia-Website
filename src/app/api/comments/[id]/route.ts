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
