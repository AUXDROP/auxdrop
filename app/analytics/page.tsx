import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Analytics — AUXDROP" };

// The mockup (design/mockups/pages/Analytics.dc.html) designs three
// sections: a summary card, "Chart position — last battles", and "Top
// listener regions". Only chart position is buildable now — it's computed
// from BattleResult, same as everywhere else in the app. Profile views,
// beat plays, Shop conversion, and listener regions need new tracking
// instrumentation (page-view/play events, geo data) that doesn't exist —
// that's a schema decision, not a UI gap, so those sections keep the
// mockup's own "not tracked yet" copy rather than fake data.
export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) redirect("/login");

  const results = await prisma.battleResult.findMany({
    where: { userId: user.id },
    include: { battle: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <AppHeader isAdmin={dbUser.isAdmin} />

        <div className="px-8 pt-14 sm:px-16">
          <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
            Beatmaker Analytics
          </h1>

          <Card className="mb-10 flex flex-col items-center gap-2 p-12 text-center">
            <div className="font-sans text-[15px] font-semibold text-on-dark">
              Not tracked yet
            </div>
            <div className="font-sans text-[13px] text-faint">
              Profile views, beat plays, and Shop conversion will show up
              here once your profile is live.
            </div>
          </Card>
        </div>

        <div className="px-8 pb-10 sm:px-16">
          <div className="mb-5 font-sans text-xs font-bold tracking-[0.1em] text-faint">
            CHART POSITION — LAST BATTLES
          </div>
          {results.length === 0 ? (
            <Card className="p-10 text-center">
              <div className="font-sans text-[13px] text-faint">No Battle history yet.</div>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {results.map((r) => (
                <Link
                  key={r.id}
                  href={`/battles/${r.battle.id}`}
                  className="flex items-center justify-between rounded-input border border-border bg-elevated px-5 py-3.5 hover:border-accent"
                >
                  <span className="font-sans text-[13px] font-semibold text-on-dark">
                    {r.battle.title}
                  </span>
                  <span className="font-sans text-[13px] text-muted">
                    {r.placement ? `#${r.placement}` : "Pending"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 pb-14 sm:px-16">
          <div className="mb-5 font-sans text-xs font-bold tracking-[0.1em] text-faint">
            TOP LISTENER REGIONS
          </div>
          <Card className="p-10 text-center">
            <div className="font-sans text-[13px] text-faint">No listener data yet.</div>
          </Card>
        </div>

        <div className="mt-auto border-t border-border px-8 py-7 font-sans text-xs text-faint sm:px-16">
          © 2026 AUXDROP
        </div>
      </div>
    </div>
  );
}
