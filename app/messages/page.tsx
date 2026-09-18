import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { createClient } from "@/lib/supabase/server";
import { ConversationList } from "./ConversationList";

export const metadata: Metadata = { title: "Messages — AUXDROP" };

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

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
            <ConversationList userId={user.id} />
          </div>
          <div className="flex min-h-[480px] flex-col items-center justify-center gap-2 p-8 text-center">
            <div className="font-display text-lg font-bold text-on-dark">
              No conversations yet
            </div>
            <div className="font-sans text-[13px] text-faint">
              Messages with other Beatmakers will show up here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
