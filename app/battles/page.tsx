import type { Metadata } from "next";
import Link from "next/link";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { Card, CardBody } from "@/components/ui";
import { BattleStatusBadge } from "@/components/battles/BattleStatusBadge";
import { prisma } from "@/lib/prisma";
import { BattleStatus } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Beat Battles — AUXDROP",
  description: "Browse open, upcoming, and past Beat Battles.",
};

const TABS = [
  { key: "open", label: "Open", status: BattleStatus.OPEN },
  { key: "upcoming", label: "Upcoming", status: BattleStatus.UPCOMING },
  { key: "completed", label: "Completed", status: BattleStatus.COMPLETED },
] as const;

export default async function BeatBattlesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabParam } = await searchParams;
  const activeTab = TABS.find((t) => t.key === tabParam) ?? TABS[0];

  const battles = await prisma.battle.findMany({
    where: { status: activeTab.status },
    orderBy:
      activeTab.key === "completed" ? { submissionDeadline: "desc" } : { startsAt: "asc" },
    include: { _count: { select: { submissions: true } } },
  });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader
          navItems={[
            { label: "Beat Battles", href: "/battles" },
            { label: "Charts", href: "/rankings" },
            { label: "Beatmakers", href: "/beatmakers" },
          ]}
          active="Beat Battles"
          cta={{ label: "Enter a Battle", href: "/signup" }}
        />

        <div className="flex flex-1 flex-col gap-8 px-8 py-16 sm:px-16">
          <h1 className="font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
            Beat Battles
          </h1>

          <div className="flex gap-2 border-b border-border">
            {TABS.map((t) => (
              <Link
                key={t.key}
                href={t.key === "open" ? "/battles" : `/battles?tab=${t.key}`}
                className={
                  "px-5 py-3 font-sans text-sm font-bold " +
                  (t.key === activeTab.key ? "text-on-dark" : "text-faint")
                }
              >
                {t.label}
              </Link>
            ))}
          </div>

          {battles.length === 0 ? (
            <Card className="flex flex-col items-start gap-4 p-14">
              <div className="max-w-xl font-display text-2xl font-bold text-on-dark">
                Compete in timed Beat Battles against other Beatmakers.
              </div>
              <CardBody className="mt-0 max-w-xl text-sm leading-relaxed">
                Get a challenge brief, make a beat before the clock runs out,
                and get judged. Join early access to enter the first Battle
                when it opens.
              </CardBody>
              <Link
                href="/signup"
                className="rounded-button bg-signal px-6 py-3.5 font-sans text-sm font-bold text-on-dark"
              >
                Join early access
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {battles.map((battle) => (
                <Link key={battle.id} href={`/battles/${battle.id}`}>
                  <Card className="flex h-full flex-col gap-3 hover:border-accent">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-display text-lg font-bold text-on-dark">
                        {battle.title}
                      </div>
                      <BattleStatusBadge status={battle.status} />
                    </div>
                    <div className="font-sans text-xs text-faint">
                      {battle.genre ?? "All genres"} · {battle.durationMinutes} min
                      · {battle._count.submissions} entered
                    </div>
                    <CardBody className="mt-0">
                      Entry fee ${battle.entryFee.toString()}
                      {battle.prizePool ? ` · Prize pool $${battle.prizePool.toString()}` : ""}
                    </CardBody>
                  </Card>
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
