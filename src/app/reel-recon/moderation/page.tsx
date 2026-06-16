import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav/nav';
import { Footer } from '@/components/footer/footer';
import { DataLabel } from '@/components/primitives/data-label';
import { isAdmin } from '@/lib/auth/session';
import { hasDb } from '@/lib/db';
import { listRecentComments } from '@/lib/comments/service';

export const dynamic = 'force-dynamic';

export default async function ModerationPage() {
  if (!(await isAdmin())) notFound();
  const recent = hasDb ? await listRecentComments(100) : [];

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-black px-6 pt-28 pb-20 md:px-12 md:pt-36">
        <div className="mx-auto max-w-[900px]">
          <DataLabel className="mb-6 text-brass">Moderation · Recent Comments</DataLabel>
          {recent.length === 0 ? (
            <p className="text-bone-muted">No comments yet.</p>
          ) : (
            <ul className="space-y-6">
              {recent.map((c) => (
                <li key={c.id} className="border-b border-bone/10 pb-4">
                  <div className="text-sm text-bone-subtle">
                    {c.authorName ?? 'Member'} ·{' '}
                    <Link href={`/reel-recon/${c.reviewSlug}`} className="text-brass underline">
                      {c.reviewSlug}
                    </Link>{' '}
                    · {new Date(c.createdAt).toLocaleString('en-US')}
                  </div>
                  <p className="mt-1 text-bone-muted">
                    {c.isDeleted ? <em className="text-bone-subtle">[removed]</em> : c.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-8 text-xs text-bone-subtle">
            Delete and block actions are available inline on each review&apos;s discussion.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
