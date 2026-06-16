'use client';

export type CommentView = {
  id: string;
  parentId: string | null;
  userId: string;
  body: string | null; // null when the comment is soft-deleted (server strips the text)
  isDeleted: boolean;
  createdAt: string;
  authorName: string | null;
  authorImage: string | null;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function CommentItem({
  comment,
  isAdmin,
  onReply,
  onDelete,
  onBlock,
}: {
  comment: CommentView;
  isAdmin: boolean;
  onReply?: (id: string) => void;
  onDelete: (id: string) => void;
  onBlock: (userId: string) => void;
}) {
  return (
    <div className="flex gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={comment.authorImage ?? '/avatar-placeholder.png'}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-full bg-bone/10 object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-bone">{comment.authorName ?? 'Member'}</span>
          <span className="text-bone-subtle">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="mt-1 leading-relaxed text-bone-muted">
          {comment.isDeleted ? <em className="text-bone-subtle">[removed]</em> : comment.body}
        </p>
        {!comment.isDeleted && (
          <div className="mt-1 flex gap-4 text-xs text-bone-subtle">
            {onReply && comment.parentId === null && (
              <button type="button" onClick={() => onReply(comment.id)} className="hover:text-brass">
                Reply
              </button>
            )}
            <button type="button" onClick={() => onDelete(comment.id)} className="hover:text-brass">
              Delete
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => onBlock(comment.userId)}
                className="hover:text-red-400"
              >
                Block user
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
