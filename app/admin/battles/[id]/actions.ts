"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { BattleStatus, NotificationType } from "@/generated/prisma/client";

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

  revalidatePath(`/admin/battles/${battleId}`);
  revalidatePath(`/battles/${battleId}/results`);
  revalidatePath("/admin/battles");
  redirect("/admin/battles");
}
