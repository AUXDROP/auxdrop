import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { getBattleStandings } from "@/lib/judging";
import { JudgingType } from "@/generated/prisma/enums";
import { declareResults } from "./actions";
import { AssignJudgeForm } from "./AssignJudgeForm";
import { UnassignJudgeButton } from "./UnassignJudgeButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const battle = await prisma.battle.findUnique({ where: { id } });
  return { title: battle ? `${battle.title} — Admin — AUXDROP` : "Admin — AUXDROP" };
}

export default async function AdminBattleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const battle = await prisma.battle.findUnique({
    where: { id },
    include: {
      submissions: {
        include: { user: { select: { handle: true } }, track: { select: { title: true } }, result: true },
      },
      judges: { include: { user: { select: { handle: true } } } },
    },
  });
  if (!battle) notFound();

  const declareResultsWithId = declareResults.bind(null, battle.id);
  const standings = await getBattleStandings(battle.id);
  const standingBySubmission = new Map(standings.map((s) => [s.submissionId, s]));

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/battles/{battle.id}
      </div>
      <div className="p-12">
        <h1 className="mb-1 font-display text-3xl font-extrabold text-on-dark">
          {battle.title}
        </h1>
        <div className="mb-8 font-sans text-sm text-faint">
          {battle.status} · {battle.judgingType.replace("_", " ")} ·{" "}
          {battle.submissions.length} submissions
        </div>

        {battle.judgingType !== JudgingType.COMMUNITY && (
          <div className="mb-10 flex flex-col gap-3">
            <div className="font-sans text-xs font-bold tracking-[0.08em] text-faint">
              JUDGE PANEL
            </div>
            {battle.judges.length > 0 && (
              <div className="flex flex-col gap-2">
                {battle.judges.map((j) => (
                  <div
                    key={j.id}
                    className="flex items-center justify-between rounded-input border border-border bg-elevated px-4 py-2.5"
                  >
                    <span className="font-sans text-[13px] font-semibold text-on-dark">
                      {j.user.handle}
                    </span>
                    <UnassignJudgeButton battleId={battle.id} userId={j.userId} />
                  </div>
                ))}
              </div>
            )}
            <AssignJudgeForm battleId={battle.id} />
          </div>
        )}

        {battle.submissions.length === 0 ? (
          <p className="font-sans text-[13px] text-faint">No submissions yet.</p>
        ) : (
          <form action={declareResultsWithId} className="flex flex-col gap-3">
            <div className="grid grid-cols-[1fr_1fr_140px_120px] gap-4 px-2 font-sans text-[11px] font-bold tracking-[0.08em] text-faint">
              <div>BEATMAKER</div>
              <div>TRACK</div>
              <div>SCORE (C/J)</div>
              <div>PLACEMENT</div>
            </div>
            {battle.submissions.map((s) => {
              const standing = standingBySubmission.get(s.id);
              return (
                <div
                  key={s.id}
                  className="grid grid-cols-[1fr_1fr_140px_120px] items-center gap-4 rounded-input border border-border bg-elevated px-4 py-3"
                >
                  <div className="font-sans text-[13px] font-semibold text-on-dark">
                    {s.user.handle}
                  </div>
                  <div className="font-sans text-[13px] text-muted">{s.track.title}</div>
                  <div className="font-sans text-[13px] text-muted">
                    {standing?.weightedScore != null ? standing.weightedScore.toFixed(2) : "—"}{" "}
                    <span className="text-faint">
                      ({standing?.communityVotes ?? 0}c/{standing?.judgeVotes ?? 0}j)
                    </span>
                  </div>
                  <Input
                    name={`placement-${s.id}`}
                    type="number"
                    min={1}
                    defaultValue={s.result?.placement ?? standing?.placement ?? undefined}
                    placeholder="—"
                  />
                </div>
              );
            })}
            <Button type="submit" className="mt-2 self-start">
              Save results &amp; complete battle
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
