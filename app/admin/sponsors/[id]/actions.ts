"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export interface CreateSponsorshipState {
  error?: string;
}

export async function createSponsorship(
  sponsorId: string,
  _prevState: CreateSponsorshipState,
  formData: FormData,
): Promise<CreateSponsorshipState> {
  await requireAdmin();

  const packageName = String(formData.get("packageName") || "").trim();
  const amountRaw = String(formData.get("amountContributed") || "").trim();
  const productNotes = String(formData.get("productNotes") || "").trim();
  const startDateRaw = String(formData.get("startDate") || "").trim();
  const endDateRaw = String(formData.get("endDate") || "").trim();

  const amountContributed = amountRaw ? Number(amountRaw) : null;
  if (amountRaw && (amountContributed === null || isNaN(amountContributed) || amountContributed < 0)) {
    return { error: "Amount contributed must be a positive number." };
  }

  await prisma.sponsorship.create({
    data: {
      sponsorId,
      packageName: packageName || null,
      amountContributed,
      productNotes: productNotes || null,
      startDate: startDateRaw ? new Date(startDateRaw) : null,
      endDate: endDateRaw ? new Date(endDateRaw) : null,
    },
  });

  revalidatePath(`/admin/sponsors/${sponsorId}`);
  return {};
}

export async function assignBattle(sponsorshipId: string, formData: FormData) {
  await requireAdmin();

  const battleId = String(formData.get("battleId") || "").trim();
  if (!battleId) return;

  const sponsorship = await prisma.sponsorship.findUnique({ where: { id: sponsorshipId } });
  if (!sponsorship) return;

  await prisma.battle.update({ where: { id: battleId }, data: { sponsorshipId } });
  revalidatePath(`/admin/sponsors/${sponsorship.sponsorId}`);
}

export async function unassignBattle(sponsorId: string, battleId: string) {
  await requireAdmin();
  await prisma.battle.update({ where: { id: battleId }, data: { sponsorshipId: null } });
  revalidatePath(`/admin/sponsors/${sponsorId}`);
}
