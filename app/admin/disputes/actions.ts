"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { DisputeStatus } from "@/generated/prisma/client";

export async function resolveDispute(
  disputeId: string,
  status: DisputeStatus,
  formData: FormData,
) {
  await requireAdmin();

  const resolution = String(formData.get("resolution") || "").trim();

  await prisma.dispute.update({
    where: { id: disputeId },
    data: { status, resolution: resolution || null },
  });

  revalidatePath("/admin/disputes");
}
