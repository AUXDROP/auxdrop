"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { uploadTrackAudio } from "@/lib/storage";
import { Prisma, UserRole, BattleStatus } from "@/generated/prisma/client";

export interface SubmitState {
  error?: string;
}

export async function submitTrack(
  battleId: string,
  _prevState: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || dbUser.role !== UserRole.BEATMAKER) {
    return { error: "Only Beatmaker accounts can submit to battles." };
  }

  const battle = await prisma.battle.findUnique({ where: { id: battleId } });
  if (!battle || battle.status !== BattleStatus.OPEN || battle.submissionDeadline < new Date()) {
    return { error: "This battle isn't accepting submissions right now." };
  }

  const title = String(formData.get("title") || "").trim();
  const audioFile = formData.get("audio");
  const durationSec = Number(formData.get("durationSec") || 0);

  if (!title || !(audioFile instanceof File) || audioFile.size === 0) {
    return { error: "A title and audio file are required." };
  }

  let peaks: unknown;
  try {
    peaks = JSON.parse(String(formData.get("peaks") || "[]"));
  } catch {
    peaks = [];
  }

  const audioUrl = await uploadTrackAudio(user.id, audioFile);

  try {
    await prisma.$transaction(async (tx) => {
      const track = await tx.track.create({
        data: {
          title,
          audioUrl,
          waveformPeaks: peaks as Prisma.InputJsonValue,
          durationSec,
          creatorId: user.id,
        },
      });
      await tx.submission.create({
        data: { battleId, userId: user.id, trackId: track.id },
      });
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "You've already submitted to this battle." };
    }
    throw e;
  }

  redirect(`/battles/${battleId}`);
}

export interface FileDisputeState {
  error?: string;
  success?: boolean;
}

export async function fileDispute(
  battleId: string,
  _prevState: FileDisputeState,
  formData: FormData,
): Promise<FileDisputeState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const reason = String(formData.get("reason") || "").trim();
  if (!reason) {
    return { error: "Tell us what's wrong before submitting." };
  }

  await prisma.dispute.create({
    data: { battleId, filedById: user.id, reason },
  });

  return { success: true };
}
