import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { CommentsSection } from "@/components/comments/CommentsSection";
import { getBeatmakerRecord, getGlobalRankings } from "@/lib/battles";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Results — AUXDROP" };

// Evergreen "what happens next" copy — Release/Sound Kit/License review
// aren't modeled yet (Phase 2/step 7), so this isn't per-winner real data,
// same treatment as Battle Detail's "what you're competing for" list.
const PATHWAYS = [
  "Picked for a Release",
  "Shop listing live",
  "Sound Kit pending",
  "Under license review",
];

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const battle = await prisma.battle.findUnique({ where: { id } });
  if (!battle) notFound();

  const winnerResult = await prisma.battleResult.findFirst({
    where: { battleId: id, placement: 1 },
    include: { user: true },
  });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader navItems={[{ label: "Beat Battles", href: "/battles" }]} />

        {!winnerResult ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-24 text-center sm:px-16">
            <h1 className="font-display text-2xl font-extrabold text-on-dark">
              Results aren&apos;t posted yet
            </h1>
            <p className="max-w-md font-sans text-sm text-muted">
              {battle.title} hasn&apos;t finished judging. Check back once the
              battle completes.
            </p>
            <Link
              href={`/battles/${battle.id}`}
              className="mt-2 font-sans text-sm font-bold text-signal"
            >
              Back to battle
            </Link>
          </div>
        ) : (
          <>
            <ResultsBody
              battleTitle={battle.title}
              winnerId={winnerResult.userId}
              winnerHandle={winnerResult.user.handle}
            />
            <div className="border-t border-border">
              <CommentsSection
                battleId={battle.id}
                battleTitle={battle.title}
                isAuthenticated={Boolean(user)}
              />
            </div>
          </>
        )}

        <div className="border-t border-border px-8 py-7 font-sans text-xs text-faint sm:px-16">
          © 2026 AUXDROP
        </div>
      </div>
    </div>
  );
}

async function ResultsBody({
  battleTitle,
  winnerId,
  winnerHandle,
}: {
  battleTitle: string;
  winnerId: string;
  winnerHandle: string;
}) {
  const [record, rankings] = await Promise.all([
    getBeatmakerRecord(winnerId),
    getGlobalRankings(),
  ]);
  const rank = rankings.findIndex((r) => r.userId === winnerId);

  return (
    <>
      <div className="flex flex-col items-center gap-2 border-b border-border bg-[#0c0c0e] px-8 py-16 sm:px-16">
        <div className="font-sans text-xs font-bold tracking-[0.1em] text-[#FFD166]">
          WINNER — {battleTitle.toUpperCase()}
        </div>
        <h1 className="font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
          {winnerHandle}
        </h1>
        <div className="mt-5 flex gap-7">
          <div className="text-center">
            <div className="font-display text-2xl font-extrabold text-on-dark">
              {record.wins}–{record.losses}
            </div>
            <div className="mt-1 font-sans text-[11px] text-faint">Record</div>
          </div>
          {rank >= 0 && (
            <div className="text-center">
              <div className="font-display text-2xl font-extrabold text-on-dark">
                #{rank + 1}
              </div>
              <div className="mt-1 font-sans text-[11px] text-faint">Ranking</div>
            </div>
          )}
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {PATHWAYS.map((p) => (
            <span
              key={p}
              className="rounded-pill border border-border px-3.5 py-2 font-sans text-[11px] font-bold text-muted"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-8 py-14 sm:px-16">
        <Link
          href="/signup"
          className="rounded-button bg-signal px-6 py-3.5 font-sans text-sm font-bold text-on-dark"
        >
          Join early access
        </Link>
      </div>
    </>
  );
}
