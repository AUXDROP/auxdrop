"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export interface UpdateReleaseDetailsState {
  error?: string;
}

export async function updateReleaseDetails(
  releaseId: string,
  _prevState: UpdateReleaseDetailsState,
  formData: FormData,
): Promise<UpdateReleaseDetailsState> {
  await requireAdmin();

  const releaseDateRaw = String(formData.get("releaseDate") || "").trim();
  const releaseDate = releaseDateRaw ? new Date(releaseDateRaw) : null;
  if (releaseDateRaw && isNaN(releaseDate!.getTime())) {
    return { error: "Release date isn't a valid date." };
  }

  await prisma.release.update({
    where: { id: releaseId },
    data: {
      releaseDate,
      spotifyUrl: String(formData.get("spotifyUrl") || "").trim() || null,
      appleMusicUrl: String(formData.get("appleMusicUrl") || "").trim() || null,
      tidalUrl: String(formData.get("tidalUrl") || "").trim() || null,
    },
  });

  revalidatePath(`/admin/releases/${releaseId}`);
  revalidatePath("/releases");
  return {};
}

export async function addTrackToRelease(releaseId: string, formData: FormData) {
  await requireAdmin();

  const trackId = String(formData.get("trackId") || "").trim();
  if (!trackId) return;

  const maxPosition = await prisma.releaseTrack.aggregate({
    where: { releaseId },
    _max: { position: true },
  });

  await prisma.releaseTrack.upsert({
    where: { releaseId_trackId: { releaseId, trackId } },
    create: { releaseId, trackId, position: (maxPosition._max.position ?? 0) + 1 },
    update: {},
  });

  revalidatePath(`/admin/releases/${releaseId}`);
  revalidatePath("/releases");
}

export async function removeTrackFromRelease(releaseId: string, releaseTrackId: string) {
  await requireAdmin();
  await prisma.releaseTrack.delete({ where: { id: releaseTrackId } });
  revalidatePath(`/admin/releases/${releaseId}`);
  revalidatePath("/releases");
}

export async function moveTrack(
  releaseId: string,
  releaseTrackId: string,
  direction: "up" | "down",
) {
  await requireAdmin();

  const tracks = await prisma.releaseTrack.findMany({
    where: { releaseId },
    orderBy: { position: "asc" },
  });
  const index = tracks.findIndex((t) => t.id === releaseTrackId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= tracks.length) return;

  const a = tracks[index];
  const b = tracks[swapWith];
  await prisma.$transaction([
    prisma.releaseTrack.update({ where: { id: a.id }, data: { position: b.position } }),
    prisma.releaseTrack.update({ where: { id: b.id }, data: { position: a.position } }),
  ]);

  revalidatePath(`/admin/releases/${releaseId}`);
}

export interface AddRoyaltySplitState {
  error?: string;
}

export async function addRoyaltySplit(
  releaseId: string,
  _prevState: AddRoyaltySplitState,
  formData: FormData,
): Promise<AddRoyaltySplitState> {
  await requireAdmin();

  const handle = String(formData.get("handle") || "").trim();
  const percentage = Number(formData.get("percentage") || 0);

  if (!percentage || percentage <= 0 || percentage > 100) {
    return { error: "Percentage must be between 0 and 100." };
  }

  let userId: string | null = null;
  if (handle) {
    const user = await prisma.user.findUnique({ where: { handle } });
    if (!user) return { error: `No user found with handle "${handle}".` };
    userId = user.id;
  }

  await prisma.royaltySplit.create({
    data: { releaseId, userId, percentage },
  });

  revalidatePath(`/admin/releases/${releaseId}`);
  return {};
}

export async function removeRoyaltySplit(releaseId: string, splitId: string) {
  await requireAdmin();
  await prisma.royaltySplit.delete({ where: { id: splitId } });
  revalidatePath(`/admin/releases/${releaseId}`);
}
