"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export interface JoinWaitlistState {
  error?: string;
  success?: boolean;
}

export async function joinWaitlist(
  _prevState: JoinWaitlistState,
  formData: FormData,
): Promise<JoinWaitlistState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { error: "Enter a valid email." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    await prisma.tvWaitlistEntry.create({ data: { email, userId: user?.id ?? null } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      // Already on the list — treat as success, not an error.
      return { success: true };
    }
    throw e;
  }

  return { success: true };
}
