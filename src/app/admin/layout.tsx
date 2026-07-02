import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { robots: { index: false, follow: false } };

// First line of defense. Layouts don't re-run on every client-side
// navigation, so every admin page ALSO gates itself with isAdmin().
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/api/auth/signin?callbackUrl=/admin/leads');
  if (user.role !== 'admin') notFound();
  return <>{children}</>;
}
