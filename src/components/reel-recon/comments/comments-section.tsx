'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSession, signIn, signOut } from 'next-auth/react';
import { DataLabel } from '@/components/primitives/data-label';
import { CommentItem, type CommentView } from './comment-item';

type SessionUser = { id: string; role: string } | null;

export function CommentsSection({ slug }: { slug: string }) {
  const [user, setUser] = useState<SessionUser>(null);
  const [comments, setComments] = useState<CommentView[]>([]);
  const [body, setBody] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/reel-recon/${slug}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments as CommentView[]);
    } else if (res.status === 503) {
      setError('Comments are not available yet.');
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    getSession().then((s) => {
      const su = s?.user as { id?: string; role?: string } | undefined;
      setUser(su?.id ? { id: su.id, role: su.role ?? 'user' } : null);
    });
    load();
  }, [load]);

  async function submit() {
    setError(null);
    const res = await fetch(`/api/reel-recon/${slug}/comments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ body, parentId: replyTo ?? undefined }),
    });
    if (res.ok) {
      setBody('');
      setReplyTo(null);
      await load();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not post comment.');
    }
  }

  async function remove(id: string) {
    await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    await load();
  }

  async function block(userId: string) {
    await fetch(`/api/admin/users/${userId}/block`, { method: 'POST' });
    await load();
  }

  const topLevel = comments.filter((c) => c.parentId === null);
  const repliesOf = (id: string) => comments.filter((c) => c.parentId === id);
  const isAdmin = user?.role === 'admin';

  return (
    <section className="border-t border-brass/15 bg-black px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-[720px]">
        <DataLabel className="mb-6">The Discussion</DataLabel>

        {user ? (
          <div className="mb-8">
            {replyTo && (
              <p className="mb-2 text-xs text-bone-subtle">
                Replying… <button onClick={() => setReplyTo(null)} className="underline">cancel</button>
              </p>
            )}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              maxLength={4000}
              placeholder="Share your take on the film or the rating…"
              className="w-full rounded border border-bone/15 bg-gunpowder p-3 text-bone placeholder:text-bone-subtle"
            />
            <div className="mt-2 flex items-center justify-between">
              <button onClick={() => signOut()} className="text-xs text-bone-subtle hover:text-bone">
                Sign out
              </button>
              <button
                onClick={submit}
                disabled={body.trim().length === 0}
                className="data-label bg-brass px-5 py-2 font-bold text-gunpowder transition-colors hover:bg-golden-hour disabled:opacity-40"
              >
                Post
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="mb-8 data-label bg-brass px-5 py-3 font-bold text-gunpowder transition-colors hover:bg-golden-hour"
          >
            Sign in with Google to join the discussion
          </button>
        )}

        {loading ? (
          <p className="text-bone-subtle">Loading comments…</p>
        ) : topLevel.length === 0 ? (
          <p className="text-bone-subtle">No comments yet. Be the first.</p>
        ) : (
          <ul className="space-y-8">
            {topLevel.map((c) => (
              <li key={c.id}>
                <CommentItem
                  comment={c}
                  isAdmin={isAdmin}
                  onReply={user ? setReplyTo : undefined}
                  onDelete={remove}
                  onBlock={block}
                />
                {repliesOf(c.id).length > 0 && (
                  <ul className="mt-4 space-y-4 border-l border-bone/10 pl-6">
                    {repliesOf(c.id).map((r) => (
                      <li key={r.id}>
                        <CommentItem
                          comment={r}
                          isAdmin={isAdmin}
                          onDelete={remove}
                          onBlock={block}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
