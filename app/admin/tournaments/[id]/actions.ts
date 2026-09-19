"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import {
  firstRoundPairs,
  nextRoundPairs,
  isRoundResolved,
  getRoundMatchWinners,
  generateRoundMatches,
} from "@/lib/tournaments";
import { JudgingType, RoundStatus, TournamentStatus } from "@/generated/prisma/client";

export interface StartRoundState {
  error?: string;
}

export async function startRound(
  roundId: string,
  _prevState: StartRoundState,
  formData: FormData,
): Promise<StartRoundState> {
  await requireAdmin();

  const round = await prisma.round.findUnique({
    where: { id: roundId },
    include: { tournament: { include: { entrants: { orderBy: { seed: "asc" } } } } },
  });
  if (!round) return { error: "Round not found." };
  if (round.status !== RoundStatus.PENDING) {
    return { error: "This round has already been started." };
  }

  let pairs;
  if (round.roundNumber === 1) {
    pairs = firstRoundPairs(
      round.tournament.entrants.map((e) => ({ userId: e.userId, seed: e.seed })),
    );
  } else {
    const previousRound = await prisma.round.findUnique({
      where: {
        tournamentId_roundNumber: {
          tournamentId: round.tournamentId,
          roundNumber: round.roundNumber - 1,
        },
      },
    });
    if (!previousRound) return { error: "Previous round not found." };
    if (!(await isRoundResolved(previousRound.id))) {
      return { error: "The previous round isn't fully resolved yet." };
    }
    const winners = await getRoundMatchWinners(previousRound.id);
    pairs = nextRoundPairs(winners);
  }

  const genre = String(formData.get("genre") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const bpmRaw = String(formData.get("bpm") || "").trim();
  const entryFee = Number(formData.get("entryFee") || 0);
  const durationMinutes = Number(formData.get("durationMinutes") || 60);
  const startsAt = new Date(String(formData.get("startsAt") || ""));
  const submissionDeadline = new Date(String(formData.get("submissionDeadline") || ""));
  const judgingDeadlineRaw = String(formData.get("judgingDeadline") || "").trim();
  const judgingDeadline = judgingDeadlineRaw ? new Date(judgingDeadlineRaw) : null;
  const judgingTypeRaw = String(formData.get("judgingType") || "COMMUNITY");
  const judgingType = (Object.values(JudgingType) as string[]).includes(judgingTypeRaw)
    ? (judgingTypeRaw as JudgingType)
    : JudgingType.COMMUNITY;

  if (isNaN(startsAt.getTime()) || isNaN(submissionDeadline.getTime())) {
    return { error: "Start time and submission deadline are required." };
  }
  if (judgingDeadlineRaw && isNaN(judgingDeadline!.getTime())) {
    return { error: "Voting deadline isn't a valid date." };
  }

  await generateRoundMatches(round.id, pairs, {
    title: round.tournament.title,
    genre: genre || null,
    description: description || null,
    bpm: bpmRaw ? Number(bpmRaw) : null,
    entryFee,
    durationMinutes,
    startsAt,
    submissionDeadline,
    judgingDeadline,
    judgingType,
  });

  if (round.roundNumber === 1) {
    await prisma.tournament.update({
      where: { id: round.tournamentId },
      data: { status: TournamentStatus.IN_PROGRESS },
    });
  }

  // Rare edge case: the last round resolved immediately (e.g. it came down
  // to a bye) — no Battle to wait on, so the tournament is done too.
  const totalRounds = await prisma.round.count({ where: { tournamentId: round.tournamentId } });
  if (round.roundNumber === totalRounds) {
    const updatedRound = await prisma.round.findUnique({ where: { id: round.id } });
    if (updatedRound?.status === RoundStatus.COMPLETED) {
      await prisma.tournament.update({
        where: { id: round.tournamentId },
        data: { status: TournamentStatus.COMPLETED },
      });
    }
  }

  revalidatePath(`/admin/tournaments/${round.tournamentId}`);
  revalidatePath("/championship");
  return {};
}

export async function cancelTournament(tournamentId: string) {
  await requireAdmin();
  await prisma.tournament.update({
    where: { id: tournamentId },
    data: { status: TournamentStatus.CANCELLED },
  });
  revalidatePath(`/admin/tournaments/${tournamentId}`);
  revalidatePath("/admin/tournaments");
  revalidatePath("/championship");
}
