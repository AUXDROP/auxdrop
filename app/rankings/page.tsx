import type { Metadata } from "next";
import Link from "next/link";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { Card, CardBody } from "@/components/ui";
import { getGlobalRankings } from "@/lib/battles";

export const metadata: Metadata = {
  title: "Beatmaker Rankings — AUXDROP",
  description: "Global Beatmaker rankings — wins, losses, and standing across every Beat Battle.",
};

export default async function ChartsPage() {
  const rankings = await getGlobalRankings();

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader
          navItems={[
            { label: "Charts", href: "/rankings" },
            { label: "Championship" },
            { label: "Hall of Fame" },
          ]}
          active="Charts"
        />

        <div className="flex flex-1 flex-col gap-6 px-8 py-16 sm:px-16">
          <div>
            <h1 className="font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
              Beatmaker Rankings
            </h1>
          </div>

          {rankings.length === 0 ? (
            <Card className="flex flex-col items-start gap-4 p-14">
              <div className="max-w-xl font-display text-2xl font-bold text-on-dark">
                See where every Beatmaker stands.
              </div>
              <CardBody className="mt-0 max-w-xl text-sm leading-relaxed">
                Charts track wins, losses, and standing across every Beat
                Battle. Sign up now so your record starts counting from the
                first Battle.
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
              {rankings.map((r, i) => (
                <Link
                  key={r.userId}
                  href={`/beatmakers/${r.handle}`}
                  className="grid grid-cols-[48px_1fr_auto] items-center gap-4 px-2 py-4 hover:bg-elevated"
                >
                  <div className="font-display text-lg font-extrabold text-faint">
                    #{i + 1}
                  </div>
                  <div className="font-sans text-sm font-bold text-on-dark">
                    {r.handle}
                  </div>
                  <div className="font-sans text-sm text-muted">
                    {r.wins}–{r.losses} · {r.winRate}%
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
