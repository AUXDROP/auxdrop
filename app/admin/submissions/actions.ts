"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { SubmissionStatus } from "@/generated/prisma/client";

export async function setSubmissionStatus(submissionId: string, status: SubmissionStatus) {
  await requireAdmin();
  await prisma.submission.update({ where: { id: submissionId }, data: { status } });
  revalidatePath("/admin/submissions");
}
