import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { createClient } from "@/lib/supabase/server";
import { getActivityFeed } from "@/lib/activity";

export const metadata: Metadata = { title: "Activity Feed — AUXDROP" };

export default async function ActivityFeedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const activity = await getActivityFeed(user.id);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader
          navItems={[
            { label: "Activity", href: "/activity" },
            { label: "Messages", href: "/messages" },
            { label: "Following", href: "/following" },
          ]}
          active="Activity"
        />

        <div className="flex-1 px-8 py-14 sm:px-16">
          <div className="mb-2 font-sans text-xs text-faint">Activity</div>
          <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
            Activity Feed
          </h1>

          {activity.length === 0 ? (
            <div className="rounded-input border border-border bg-elevated p-12 text-center">
              <div className="font-sans text-sm font-semibold text-on-dark">
                No activity yet
              </div>
              <div className="mt-1.5 font-sans text-xs text-faint">
                Follow other Beatmakers to see their Battles, releases, and
                Shop drops here.
              </div>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-input border border-border bg-elevated">
              {activity.map((a) => (
                <Link
                  key={a.id}
                  href={`/battles/${a.battle.id}/results`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-primary"
                >
                  <span className="font-sans text-sm text-on-dark">
                    <span className="font-bold">{a.user.handle}</span>{" "}
                    {a.placement === 1 ? "won" : "placed"} in{" "}
                    <span className="font-bold">{a.battle.title}</span>
                  </span>
                  <span className="font-sans text-xs text-faint">
                    {a.createdAt.toLocaleDateString()}
                  </span>
                </Link>
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
