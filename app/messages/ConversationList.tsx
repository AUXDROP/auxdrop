import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function ConversationList({
  userId,
  activeId,
}: {
  userId: string;
  activeId?: string;
}) {
  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: { include: { user: { select: { handle: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  if (conversations.length === 0) {
    return (
      <div className="px-6 py-6 text-center font-sans text-[13px] text-faint">
        No messages yet
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {conversations.map((c) => {
        const others = c.participants
          .filter((p) => p.userId !== userId)
          .map((p) => p.user.handle)
          .join(", ");
        return (
          <Link
            key={c.id}
            href={`/messages/${c.id}`}
            className={
              "border-b border-border px-6 py-4 font-sans text-sm " +
              (c.id === activeId
                ? "bg-elevated font-bold text-on-dark"
                : "font-semibold text-muted hover:bg-elevated")
            }
          >
            <div>{others || "Unknown"}</div>
            {c.messages[0] && (
              <div className="mt-1 truncate text-xs text-faint">
                {c.messages[0].body}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
