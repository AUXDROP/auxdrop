import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CommentForm } from "./CommentForm";
import type { CommentTarget } from "./actions";

// Embedded component (design/mockups/pages/Comments.dc.html), not a
// standalone route — per docs/03-sitemap.md's routing notes. Schema
// supports threaded replies via Comment.parentId, but only a flat list is
// shown here; reply UI isn't built yet. Attachable to a Battle or a Track
// (exactly one), matching Comment's own battleId/trackId exclusivity.
export async function CommentsSection({
  target,
  subtitle,
  isAuthenticated,
}: {
  target: CommentTarget;
  subtitle: string;
  isAuthenticated: boolean;
}) {
  const comments = await prisma.comment.findMany({
    where: target.battleId
      ? { battleId: target.battleId, parentId: null }
      : { trackId: target.trackId, parentId: null },
    include: { user: { select: { handle: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-8 py-14 sm:px-16">
      <div className="mb-2 font-sans text-xs text-faint">Comments</div>
      <h2 className="mb-1 font-display text-2xl font-extrabold text-on-dark">
        Comments
      </h2>
      <div className="mb-8 font-sans text-[13px] text-faint">On: {subtitle}</div>

      {comments.length === 0 ? (
        <div className="rounded-input border border-border bg-elevated p-10 text-center">
          <div className="font-sans text-[13px] text-faint">No comments yet.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((c) => (
            <div key={c.id} className="rounded-input border border-border bg-elevated p-4">
              <div className="mb-1 font-sans text-[13px] font-bold text-on-dark">
                {c.user.handle}
              </div>
              <div className="font-sans text-[13px] text-muted">{c.body}</div>
            </div>
          ))}
        </div>
      )}

      {isAuthenticated ? (
        <CommentForm {...target} />
      ) : (
        <p className="mt-8 font-sans text-[13px] text-faint">
          <Link href="/login" className="font-bold text-on-dark">
            Log in
          </Link>{" "}
          to leave a comment.
        </p>
      )}
    </div>
  );
}
