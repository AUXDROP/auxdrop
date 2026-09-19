"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrigin } from "@/lib/origin";
import { UserRole } from "@/generated/prisma/client";

export interface CreateSponsorState {
  error?: string;
}

const HANDLE_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export async function createSponsor(
  _prevState: CreateSponsorState,
  formData: FormData,
): Promise<CreateSponsorState> {
  await requireAdmin();

  const companyName = String(formData.get("companyName") || "").trim();
  const contactName = String(formData.get("contactName") || "").trim();
  const contactEmail = String(formData.get("contactEmail") || "").trim();
  const handle = String(formData.get("handle") || "").trim();

  if (!companyName || !contactEmail) {
    return { error: "Company name and contact email are required." };
  }
  if (!HANDLE_PATTERN.test(handle)) {
    return { error: "Handle must be 3-20 characters — letters, numbers, underscore only." };
  }

  const existingHandle = await prisma.user.findUnique({ where: { handle } });
  if (existingHandle) {
    return { error: "That handle is already taken." };
  }

  const admin = createAdminClient();
  const origin = await getOrigin();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(contactEmail, {
    redirectTo: `${origin}/auth/callback?next=/sponsor`,
  });
  if (error || !data.user) {
    return { error: error?.message || "Couldn't create the sponsor's account." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: data.user.id,
          email: contactEmail,
          handle,
          role: UserRole.SPONSOR,
        },
      });
      await tx.sponsorProfile.create({
        data: {
          userId: data.user.id,
          companyName,
          contactName: contactName || null,
          contactEmail,
        },
      });
    });
  } catch (e) {
    // Roll back the auth user so a failed create doesn't leave a stranded
    // account with no matching User/SponsorProfile row.
    await admin.auth.admin.deleteUser(data.user.id);
    throw e;
  }

  revalidatePath("/admin/sponsors");
  redirect("/admin/sponsors");
}
