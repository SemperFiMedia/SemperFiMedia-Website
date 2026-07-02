import { hasDb } from '@/lib/db';
import { getSessionUser } from '@/lib/auth/session';
import { updateLeadStatus } from '@/lib/chatbot/leads-admin';
import { isLeadStatus } from '@/lib/chatbot/lead-status';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  if (!hasDb) return Response.json({ error: 'Leads unavailable.' }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return Response.json({ error: 'Sign in.' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Not allowed.' }, { status: 403 });

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as { status?: unknown } | null;
  if (!body || !isLeadStatus(body.status)) {
    return Response.json({ error: 'Invalid status.' }, { status: 400 });
  }

  const updated = await updateLeadStatus(id, body.status);
  if (!updated) return Response.json({ error: 'Lead not found.' }, { status: 404 });
  return Response.json({ ok: true });
}
