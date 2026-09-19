import type { Metadata } from "next";
import Link from "next/link";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { Card, CardBody } from "@/components/ui";
import { getGlobalRankings } from "@/lib/battles";

export const metadata: Metadata = {
  title: "Hall of Fame — AUXDROP",
  description: "AUXDROP's top Beatmakers, ranked by career wins.",
};

// The mockup (design/mockups/pages/Hall of Fame.dc.html) only designs the
// empty state — its copy is reused verbatim below — with no populated-state
// layout to match. There's also no Season entity yet (see
// docs/04-data-model.md's Tournament/Championship note), so "induction"
// here means all-time wins, not a per-season honor. Revisit once seasons
// are modeled.
//
// Without the line below, Next statically prerenders this at build time (no
// auth/cookies here to make it dynamic automatically) — same bug class as
// /beatmakers and /rankings.
export const dynamic = "force-dynamic";

export default async function HallOfFamePage() {
  const rankings = await getGlobalRankings(25);
  const champions = rankings.filter((r) => r.wins > 0);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader
          navItems={[{ label: "Championship" }, { label: "Hall of Fame", href: "/hall-of-fame" }]}
          active="Hall of Fame"
        />

        <div className="flex flex-1 flex-col gap-6 px-8 py-16 sm:px-16">
          <h1 className="font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
            Hall of Fame
          </h1>

          {champions.length === 0 ? (
            <Card className="flex flex-col items-start gap-4 p-14">
              <div className="max-w-xl font-display text-xl font-bold text-on-dark">
                Nobody&apos;s been inducted yet.
              </div>
              <CardBody className="mt-0 max-w-xl text-sm leading-relaxed">
                The Hall of Fame recognizes AUXDROP&apos;s top Beatmakers.
                Compete early and be the first name here.
              </CardBody>
              <Link
                href="/signup"
                className="rounded-button bg-signal px-6 py-3.5 font-sans text-sm font-bold text-on-dark"
              >
                Join early access
              </Link>
            </Card>
          ) : (
            <div className="flex flex-col divide-y divide-border border-y border-border">
              {champions.map((c, i) => (
                <Link
                  key={c.userId}
                  href={`/beatmakers/${c.handle}`}
                  className="grid grid-cols-[48px_1fr_auto] items-center gap-4 px-2 py-4 hover:bg-elevated"
                >
                  <div className="font-display text-lg font-extrabold text-faint">
                    #{i + 1}
                  </div>
                  <div className="font-sans text-sm font-bold text-on-dark">{c.handle}</div>
                  <div className="font-sans text-sm text-muted">
                    {c.wins} win{c.wins === 1 ? "" : "s"} · {c.wins}–{c.losses}
                  </div>
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
