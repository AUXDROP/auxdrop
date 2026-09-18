import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Following — AUXDROP" };

export default async function FollowingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const following = await prisma.follow.findMany({
    where: { followerId: user.id },
    include: { following: { select: { handle: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader navItems={[{ label: "Beatmakers", href: "/beatmakers" }]} />

        <div className="flex-1 px-8 py-14 sm:px-16">
          <div className="mb-2 font-sans text-xs text-faint">Following</div>
          <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
            Following
          </h1>

          {following.length === 0 ? (
            <div className="rounded-input border border-border bg-elevated p-12 text-center">
              <div className="font-sans text-sm font-semibold text-on-dark">
                You&apos;re not following anyone yet
              </div>
              <div className="mt-1.5 font-sans text-xs text-faint">
                Discover Beatmakers to follow their Battles and releases.
              </div>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border rounded-input border border-border bg-elevated">
              {following.map((f) => (
                <Link
                  key={f.id}
                  href={`/beatmakers/${f.following.handle}`}
                  className="px-5 py-4 font-sans text-sm font-semibold text-on-dark hover:bg-primary"
                >
                  {f.following.handle}
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
