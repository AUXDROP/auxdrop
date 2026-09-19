"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { isRoundResolved } from "@/lib/tournaments";
import { BattleStatus, RoundStatus, TournamentStatus, NotificationType } from "@/generated/prisma/client";

export async function declareResults(battleId: string, formData: FormData) {
  await requireAdmin();

  const submissions = await prisma.submission.findMany({ where: { battleId } });

  for (const s of submissions) {
    const raw = formData.get(`placement-${s.id}`);
    if (!raw) continue;
    const placement = Number(raw);
    if (!placement || placement < 1) continue;

    await prisma.battleResult.upsert({
      where: { submissionId: s.id },
      create: { battleId, userId: s.userId, submissionId: s.id, placement },
      update: { placement },
    });

    await prisma.notification.create({
      data: {
        userId: s.userId,
        type: NotificationType.BATTLE_RESULT,
        payload: { battleId, placement },
      },
    });
  }

  await prisma.battle.update({
    where: { id: battleId },
    data: { status: BattleStatus.COMPLETED },
  });

  // Tournament battles are always exactly 2 entrants — the placement-1
  // participant advances to the next round. Set directly from placement
  // here rather than a separate admin step, since finalizing IS the moment
  // advancement becomes knowable.
  const roundMatch = await prisma.roundMatch.findUnique({ where: { battleId } });
  if (roundMatch) {
    const results = await prisma.battleResult.findMany({ where: { battleId } });
    for (const r of results) {
      await prisma.battleResult.update({
        where: { id: r.id },
        data: { advanced: r.placement === 1 },
      });
    }

    // generateRoundMatches only sets Round.status=COMPLETED at generation
    // time (for an all-bye round) — a round with a real Battle stays ACTIVE
    // until that Battle's result lands here, so re-check now. Without this,
    // "Start next round" would never unblock once a real match resolves.
    if (await isRoundResolved(roundMatch.roundId)) {
      await prisma.round.update({
        where: { id: roundMatch.roundId },
        data: { status: RoundStatus.COMPLETED },
      });

      const round = await prisma.round.findUnique({ where: { id: roundMatch.roundId } });
      if (round) {
        const totalRounds = await prisma.round.count({
          where: { tournamentId: round.tournamentId },
        });
        if (round.roundNumber === totalRounds) {
          await prisma.tournament.update({
            where: { id: round.tournamentId },
            data: { status: TournamentStatus.COMPLETED },
          });
        }
      }
    }
  }

  revalidatePath(`/admin/battles/${battleId}`);
  revalidatePath(`/battles/${battleId}/results`);
  revalidatePath("/admin/battles");

  if (roundMatch) {
    const round = await prisma.round.findUnique({ where: { id: roundMatch.roundId } });
    if (round) {
      revalidatePath(`/admin/tournaments/${round.tournamentId}`);
      redirect(`/admin/tournaments/${round.tournamentId}`);
    }
  }
  redirect("/admin/battles");
}

export interface AssignJudgeState {
  error?: string;
}

export async function assignJudge(
  battleId: string,
  _prevState: AssignJudgeState,
  formData: FormData,
): Promise<AssignJudgeState> {
  await requireAdmin();

  const handle = String(formData.get("handle") || "").trim();
  if (!handle) return { error: "Enter a handle." };

  const user = await prisma.user.findUnique({ where: { handle } });
  if (!user) return { error: `No user found with handle "${handle}".` };

  await prisma.battleJudge.upsert({
    where: { battleId_userId: { battleId, userId: user.id } },
    create: { battleId, userId: user.id },
    update: {},
  });

  revalidatePath(`/admin/battles/${battleId}`);
  return {};
}

export async function unassignJudge(battleId: string, userId: string) {
  await requireAdmin();
  await prisma.battleJudge.deleteMany({ where: { battleId, userId } });
  revalidatePath(`/admin/battles/${battleId}`);
}
