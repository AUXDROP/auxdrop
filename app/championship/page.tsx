import type { Metadata } from "next";
import Link from "next/link";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { Card, CardBody } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { TournamentStatus } from "@/generated/prisma/enums";

export const metadata: Metadata = {
  title: "Championship — AUXDROP",
  description: "The top Beatmakers compete in a live bracket Championship.",
};

// Without this, Next statically prerenders this at build time — same bug
// class as /beatmakers, /rankings, and /hall-of-fame.
export const dynamic = "force-dynamic";

export default async function ChampionshipPage() {
  const tournament = await prisma.tournament.findFirst({
    where: { status: { not: TournamentStatus.CANCELLED } },
    orderBy: { updatedAt: "desc" },
    include: {
      rounds: {
        orderBy: { roundNumber: "asc" },
        include: {
          matches: {
            orderBy: { position: "asc" },
            include: {
              userA: { select: { handle: true } },
              userB: { select: { handle: true } },
              byeWinner: { select: { handle: true } },
              battle: { select: { id: true, status: true } },
            },
          },
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader
          navItems={[
            { label: "Championship", href: "/championship" },
            { label: "Hall of Fame", href: "/hall-of-fame" },
          ]}
          active="Championship"
        />

        {!tournament ? (
          <div className="flex flex-1 flex-col items-center gap-4 border-b border-border px-8 py-20 text-center sm:px-16">
            <div className="font-sans text-xs font-bold tracking-[0.14em] text-accent">
              COMING TO AUXDROP
            </div>
            <h1 className="font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
              AUXDROP Championship
            </h1>
            <p className="max-w-lg font-sans text-sm text-muted">
              The top Beatmakers qualify for a live Championship, streamed on
              AUXDROP TV. Sign up now to start earning your spot.
            </p>
            <Link
              href="/signup"
              className="mt-2 rounded-button bg-signal px-6 py-3.5 font-sans text-sm font-bold text-on-dark"
            >
              Join early access
            </Link>
          </div>
        ) : (
          <div className="flex-1 px-8 py-16 sm:px-16">
            <div className="mb-2 font-sans text-xs font-bold tracking-[0.1em] text-faint">
              {tournament.status.replace("_", " ")}
            </div>
            <h1 className="mb-10 font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
              {tournament.title}
            </h1>

            <div className="flex flex-col gap-10">
              {tournament.rounds.map((round) => (
                <div key={round.id}>
                  <div className="mb-4 font-sans text-xs font-bold tracking-[0.1em] text-faint">
                    {round.label.toUpperCase()}
                  </div>
                  {round.matches.length === 0 ? (
                    <Card className="p-6 text-center">
                      <CardBody className="mt-0">To be determined.</CardBody>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {round.matches.map((m) => {
                        const content = (
                          <div className="rounded-card border border-border bg-elevated p-4 hover:border-accent">
                            <div className="mb-2 font-sans text-[11px] text-faint">
                              {round.label} · Match {m.position}
                            </div>
                            <div className="font-sans text-[13px] font-semibold text-on-dark">
                              {m.userA?.handle ?? "TBD"}
                            </div>
                            <div className="font-sans text-[13px] font-semibold text-muted">
                              {m.userB?.handle ?? (m.byeWinner ? "BYE" : "TBD")}
                            </div>
                          </div>
                        );
                        return m.battle ? (
                          <Link key={m.id} href={`/battles/${m.battle.id}`}>
                            {content}
                          </Link>
                        ) : (
                          <div key={m.id}>{content}</div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border px-8 py-7 font-sans text-xs text-faint sm:px-16">
          © 2026 AUXDROP
        </div>
      </div>
    </div>
  );
}
