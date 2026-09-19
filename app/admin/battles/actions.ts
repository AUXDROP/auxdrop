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
  const description = String(formData.get("description") || "").trim();
  const bpmRaw = String(formData.get("bpm") || "").trim();
  const bpm = bpmRaw ? Number(bpmRaw) : null;
  const entryFee = Number(formData.get("entryFee") || 25);
  const durationMinutes = Number(formData.get("durationMinutes") || 60);
  const startsAt = new Date(String(formData.get("startsAt") || ""));
  const submissionDeadline = new Date(String(formData.get("submissionDeadline") || ""));
  const judgingDeadlineRaw = String(formData.get("judgingDeadline") || "");
  const judgingDeadline = judgingDeadlineRaw ? new Date(judgingDeadlineRaw) : null;
  const judgingTypeRaw = String(formData.get("judgingType") || "COMMUNITY");
  const judgingType = (Object.values(JudgingType) as string[]).includes(judgingTypeRaw)
    ? (judgingTypeRaw as JudgingType)
    : JudgingType.COMMUNITY;

  if (!title || isNaN(startsAt.getTime()) || isNaN(submissionDeadline.getTime())) {
    return { error: "Title, start time, and submission deadline are required." };
  }
  if (judgingDeadlineRaw && isNaN(judgingDeadline!.getTime())) {
    return { error: "Voting deadline isn't a valid date." };
  }
  if (bpmRaw && (bpm === null || isNaN(bpm) || bpm <= 0)) {
    return { error: "BPM must be a positive number." };
  }

  await prisma.battle.create({
    data: {
      title,
      genre: genre || null,
      description: description || null,
      bpm,
      entryFee,
      durationMinutes,
      startsAt,
      submissionDeadline,
      judgingDeadline,
      status: BattleStatus.UPCOMING,
      judgingType,
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
