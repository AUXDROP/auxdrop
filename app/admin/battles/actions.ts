"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { BattleStatus, JudgingType } from "@/generated/prisma/client";

export interface CreateBattleState {
  error?: string;
}

export async function createBattle(
  _prevState: CreateBattleState,
  formData: FormData,
): Promise<CreateBattleState> {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const genre = String(formData.get("genre") || "").trim();
  const entryFee = Number(formData.get("entryFee") || 25);
  const durationMinutes = Number(formData.get("durationMinutes") || 60);
  const startsAt = new Date(String(formData.get("startsAt") || ""));
  const submissionDeadline = new Date(String(formData.get("submissionDeadline") || ""));

  if (!title || isNaN(startsAt.getTime()) || isNaN(submissionDeadline.getTime())) {
    return { error: "Title, start time, and submission deadline are required." };
  }

  await prisma.battle.create({
    data: {
      title,
      genre: genre || null,
      entryFee,
      durationMinutes,
      startsAt,
      submissionDeadline,
      status: BattleStatus.UPCOMING,
      judgingType: JudgingType.COMMUNITY,
    },
  });

  revalidatePath("/admin/battles");
  redirect("/admin/battles");
}

export async function setBattleStatus(battleId: string, status: BattleStatus) {
  await requireAdmin();
  await prisma.battle.update({ where: { id: battleId }, data: { status } });
  revalidatePath("/admin/battles");
  revalidatePath(`/battles/${battleId}`);
}
