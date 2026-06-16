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
