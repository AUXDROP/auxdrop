import "server-only";
import { prisma } from "@/lib/prisma";
import { JudgeRole } from "@/generated/prisma/enums";

// HYBRID battles exist mainly for sponsored challenges where a brand is
// paying for credentialed judging as part of the sponsorship — weighting
// judge votes higher protects that value against dilution by a larger
// general-audience vote. Tune here if this ratio proves wrong in practice.
export const JUDGE_WEIGHT = 0.7;
export const COMMUNITY_WEIGHT = 0.3;

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function weightedScore(
  judgments: { judgeRole: JudgeRole; score: number }[],
): number | null {
  const communityAvg = average(
    judgments.filter((j) => j.judgeRole === JudgeRole.COMMUNITY).map((j) => j.score),
  );
  const judgeAvg = average(
    judgments.filter((j) => j.judgeRole === JudgeRole.JUDGE).map((j) => j.score),
  );

  if (communityAvg === null && judgeAvg === null) return null;
  if (communityAvg === null) return judgeAvg;
  if (judgeAvg === null) return communityAvg;
  return communityAvg * COMMUNITY_WEIGHT + judgeAvg * JUDGE_WEIGHT;
}

export interface SubmissionStanding {
  submissionId: string;
  userId: string;
  weightedScore: number | null;
  communityVotes: number;
  judgeVotes: number;
  placement: number | null;
}

// Ranks a battle's submissions by weighted average score (ties broken by
// earlier submission). Used to pre-fill the admin's results form — it
// doesn't write anything itself.
export async function getBattleStandings(battleId: string): Promise<SubmissionStanding[]> {
  const submissions = await prisma.submission.findMany({
    where: { battleId },
    select: {
      id: true,
      userId: true,
      submittedAt: true,
      judgments: { select: { judgeRole: true, score: true } },
    },
    orderBy: { submittedAt: "asc" },
  });

  const scored = submissions.map((s) => ({
    submissionId: s.id,
    userId: s.userId,
    submittedAt: s.submittedAt,
    weightedScore: weightedScore(s.judgments),
    communityVotes: s.judgments.filter((j) => j.judgeRole === JudgeRole.COMMUNITY).length,
    judgeVotes: s.judgments.filter((j) => j.judgeRole === JudgeRole.JUDGE).length,
  }));

  const ranked = [...scored].sort((a, b) => {
    if (a.weightedScore === null && b.weightedScore === null) {
      return a.submittedAt.getTime() - b.submittedAt.getTime();
    }
    if (a.weightedScore === null) return 1;
    if (b.weightedScore === null) return -1;
    if (b.weightedScore !== a.weightedScore) return b.weightedScore - a.weightedScore;
    return a.submittedAt.getTime() - b.submittedAt.getTime();
  });

  const placementBySubmission = new Map<string, number>();
  ranked.forEach((r, i) => placementBySubmission.set(r.submissionId, i + 1));

  return scored.map((s) => ({
    submissionId: s.submissionId,
    userId: s.userId,
    weightedScore: s.weightedScore,
    communityVotes: s.communityVotes,
    judgeVotes: s.judgeVotes,
    placement: placementBySubmission.get(s.submissionId) ?? null,
  }));
}
