"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Prisma, UserRole } from "@/generated/prisma/client";

export interface OnboardingState {
  error?: string;
}

const HANDLE_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export async function completeOnboarding(
  _prevState: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const handle = String(formData.get("handle") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const genres = formData.getAll("genres").map(String);

  if (!HANDLE_PATTERN.test(handle)) {
    return {
      error: "Username must be 3-20 characters — letters, numbers, underscore only.",
    };
  }

  let dbUser;
  try {
    dbUser = await prisma.user.update({ where: { id: user.id }, data: { handle } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "That username is already taken." };
    }
    throw e;
  }

  if (dbUser.role === UserRole.BEATMAKER) {
    await prisma.beatmakerProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, bio: bio || null, location: location || null, genres },
      update: { bio: bio || null, location: location || null, genres },
    });
  }

  redirect("/dashboard");
}
