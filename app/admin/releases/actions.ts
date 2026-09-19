"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { ReleaseStatus } from "@/generated/prisma/client";

export interface CreateReleaseState {
  error?: string;
}

export async function createRelease(
  _prevState: CreateReleaseState,
  formData: FormData,
): Promise<CreateReleaseState> {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const season = String(formData.get("season") || "").trim();
  if (!title) {
    return { error: "Title is required." };
  }

  await prisma.release.create({
    data: { title, season: season || null },
  });

  revalidatePath("/admin/releases");
  redirect("/admin/releases");
}

export async function setReleaseStatus(releaseId: string, status: ReleaseStatus) {
  await requireAdmin();
  await prisma.release.update({ where: { id: releaseId }, data: { status } });
  revalidatePath("/admin/releases");
  revalidatePath("/releases");
}
