import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { ConversationList } from "../ConversationList";
import { MessageComposer } from "./MessageComposer";

export const metadata: Metadata = { title: "Messages — AUXDROP" };

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const conversation = await prisma.conversation.findFirst({
    where: { id, participants: { some: { userId: user.id } } },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { handle: true } } },
      },
    },
  });
  if (!conversation) notFound();

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader
          navItems={[
            { label: "Activity", href: "/activity" },
            { label: "Messages", href: "/messages" },
          ]}
          active="Messages"
        />

        <div className="grid flex-1 grid-cols-1 sm:grid-cols-[320px_1fr]">
          <div className="border-b border-border sm:border-b-0 sm:border-r">
            <div className="px-6 py-4 font-sans text-xs text-faint">Messages</div>
            <ConversationList userId={user.id} activeId={id} />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-6">
              {conversation.messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    "max-w-[70%] rounded-input px-4 py-3 font-sans text-sm " +
                    (m.senderId === user.id
                      ? "self-end bg-signal text-on-dark"
                      : "self-start bg-elevated text-on-dark")
                  }
                >
                  {m.body}
                </div>
              ))}
            </div>
            <MessageComposer conversationId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
