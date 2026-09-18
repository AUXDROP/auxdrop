import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@/generated/prisma/client";
import { markAllRead } from "./actions";

export const metadata: Metadata = { title: "Notifications — AUXDROP" };

function describe(type: NotificationType): string {
  switch (type) {
    case NotificationType.NEW_FOLLOWER:
      return "You have a new follower";
    case NotificationType.BATTLE_RESULT:
      return "A Battle you entered has results";
    case NotificationType.SUBMISSION_STATUS:
      return "Your submission status changed";
  }
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader navItems={[{ label: "Dashboard", href: "/dashboard" }]} />

        <div className="flex-1 px-8 py-14 sm:px-16">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="mb-2 font-sans text-xs text-faint">
                Page: /notifications
              </div>
              <h1 className="font-display text-3xl font-extrabold text-on-dark">
                Notifications
              </h1>
            </div>
            {notifications.some((n) => !n.readAt) && (
              <form action={markAllRead}>
                <Button type="submit" variant="secondary">
                  Mark all as read
                </Button>
              </form>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="rounded-input border border-border bg-elevated p-12 text-center">
              <div className="font-sans text-sm font-semibold text-on-dark">
                No notifications yet
              </div>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border overflow-hidden rounded-input bg-border">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-center justify-between bg-elevated px-5 py-4"
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={
                        "h-1.5 w-1.5 rounded-full " +
                        (n.readAt ? "bg-border" : "bg-signal")
                      }
                    />
                    <span className="font-sans text-sm font-semibold text-on-dark">
                      {describe(n.type)}
                    </span>
                  </div>
                  <span className="font-sans text-xs text-faint">
                    {n.createdAt.toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border px-8 py-7 font-sans text-xs text-faint sm:px-16">
          © 2026 AUXDROP
        </div>
      </div>
    </div>
  );
}
