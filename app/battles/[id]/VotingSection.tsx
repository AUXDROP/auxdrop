import { prisma } from "@/lib/prisma";
import { AudioPlayerBar } from "@/components/audio";
import { JudgingType } from "@/generated/prisma/enums";
import { VoteWidget } from "./VoteWidget";

export async function VotingSection({
  battleId,
  judgingType,
  viewerId,
}: {
  battleId: string;
  judgingType: JudgingType;
  viewerId: string;
}) {
  if (judgingType === JudgingType.JUDGE_PANEL) {
    const assignment = await prisma.battleJudge.findUnique({
      where: { battleId_userId: { battleId, userId: viewerId } },
    });
    if (!assignment) {
      return (
        <p className="font-sans text-[13px] text-faint">
          This battle is scored by an assigned judge panel — check back for results.
        </p>
      );
    }
  }

  const submissions = await prisma.submission.findMany({
    where: { battleId, userId: { not: viewerId } },
    include: {
      track: true,
      user: { select: { handle: true } },
      judgments: { where: { judgedById: viewerId }, select: { score: true } },
    },
    orderBy: { submittedAt: "asc" },
  });

  if (submissions.length === 0) {
    return (
      <p className="font-sans text-[13px] text-faint">
        No other submissions to vote on yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {submissions.map((s) => {
        const peaks = Array.isArray(s.track.waveformPeaks)
          ? (s.track.waveformPeaks as number[])
          : undefined;
        return (
          <div
            key={s.id}
            className="flex flex-col gap-3 rounded-card border border-border bg-elevated p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-sans text-sm font-bold text-on-dark">
                  {s.track.title}
                </div>
                <div className="font-sans text-xs text-faint">by {s.user.handle}</div>
              </div>
              <VoteWidget submissionId={s.id} initialScore={s.judgments[0]?.score ?? null} />
            </div>
            <AudioPlayerBar src={s.track.audioUrl} peaks={peaks} title={s.track.title} />
          </div>
        );
      })}
    </div>
  );
}
