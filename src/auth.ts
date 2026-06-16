import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { env } from '@/lib/env';
import { upsertUserOnSignIn, getUserById } from '@/lib/comments/service';
import { isAdminEmail } from '@/lib/comments/validation';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: env.auth.secret,
  providers: [
    Google({
      clientId: env.auth.googleClientId,
      clientSecret: env.auth.googleClientSecret,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, profile }) {
      const sub = profile?.sub ?? user.id;
      if (!sub || !user.email) return false;
      await upsertUserOnSignIn({
        id: sub,
        email: user.email,
        name: user.name ?? null,
        image: user.image ?? null,
        role: isAdminEmail(user.email) ? 'admin' : 'user',
      });
      return true;
    },
    async jwt({ token, profile, user }) {
      const sub = profile?.sub ?? user?.id ?? token.sub;
      if (sub) {
        token.userId = sub;
        const record = await getUserById(sub);
        token.role = record?.role ?? 'user';
        token.isBlocked = record?.isBlocked ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = (token.userId as string) ?? '';
      session.user.role = (token.role as string) ?? 'user';
      session.user.isBlocked = Boolean(token.isBlocked);
      return session;
    },
  },
});
