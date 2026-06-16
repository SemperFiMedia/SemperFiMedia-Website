import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { env } from '@/lib/env';
import { hasDb } from '@/lib/db';
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
      // Allow login even if no database is configured (mirrors the data layer's
      // DB-less invariant); without a DB there is just nothing to persist.
      if (!hasDb) return true;
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
        // Re-read role/blocked from the DB on every token refresh so a block or
        // role change takes effect immediately. Guarded + try/caught so a missing
        // or briefly-unavailable DB falls back to existing claims instead of
        // throwing on every authenticated request.
        if (hasDb) {
          try {
            const record = await getUserById(sub);
            token.role = record?.role ?? 'user';
            token.isBlocked = record?.isBlocked ?? false;
          } catch {
            token.role = (token.role as string) ?? 'user';
            token.isBlocked = Boolean(token.isBlocked);
          }
        } else {
          token.role = (token.role as string) ?? 'user';
          token.isBlocked = Boolean(token.isBlocked);
        }
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
