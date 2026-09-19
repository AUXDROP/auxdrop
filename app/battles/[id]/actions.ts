"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { uploadTrackAudio } from "@/lib/storage";
import {
  Prisma,
  UserRole,
  BattleStatus,
  JudgingType,
  JudgeRole,
} from "@/generated/prisma/client";

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

export interface CastJudgmentResult {
  error?: string;
}

export async function castJudgment(
  submissionId: string,
  score: number,
): Promise<CastJudgmentResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!Number.isInteger(score) || score < 1 || score > 5) {
    return { error: "Invalid score." };
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { battle: true },
  });
  if (!submission) return { error: "Submission not found." };
  if (submission.userId === user.id) {
    return { error: "You can't vote on your own submission." };
  }
  if (submission.battle.status !== BattleStatus.PENDING) {
    return { error: "Voting isn't open for this battle." };
  }
  if (submission.battle.judgingDeadline && submission.battle.judgingDeadline < new Date()) {
    return { error: "Voting has closed for this battle." };
  }

  let judgeRole: JudgeRole = JudgeRole.COMMUNITY;
  if (submission.battle.judgingType !== JudgingType.COMMUNITY) {
    const assignment = await prisma.battleJudge.findUnique({
      where: { battleId_userId: { battleId: submission.battleId, userId: user.id } },
    });
    if (submission.battle.judgingType === JudgingType.JUDGE_PANEL && !assignment) {
      return { error: "Only assigned judges can vote on this battle." };
    }
    judgeRole = assignment ? JudgeRole.JUDGE : JudgeRole.COMMUNITY;
  }

  await prisma.judgment.upsert({
    where: { submissionId_judgedById: { submissionId, judgedById: user.id } },
    create: { battleId: submission.battleId, submissionId, judgedById: user.id, judgeRole, score },
    update: { score },
  });

  revalidatePath(`/battles/${submission.battleId}`);
  return {};
}
