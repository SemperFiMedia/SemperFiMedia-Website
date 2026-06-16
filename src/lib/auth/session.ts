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
