import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/layout/AuthShell";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/generated/prisma/client";
import { OnboardingForm } from "./OnboardingForm";

export const metadata: Metadata = {
  title: "Set up your profile — AUXDROP",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { beatmakerProfile: true },
  });
  if (!dbUser) {
    // Shouldn't happen — ensureUserRow runs at the auth callback and at
    // login — but fail safe rather than crash the page.
    redirect("/login");
  }

  return (
    <AuthShell maxWidth={480}>
      <div className="font-sans text-xs font-bold tracking-[0.1em] text-faint">
        STEP 1 OF 1 — SET UP YOUR PROFILE
      </div>
      <h1 className="font-display text-3xl font-extrabold text-on-dark">
        Tell us about you
      </h1>
      <div
        className="h-[88px] w-[88px] self-center rounded-2xl"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #1f1f23, #1f1f23 8px, #18181B 8px, #18181B 16px)",
        }}
      />
      <OnboardingForm
        initialHandle={dbUser.handle}
        initialBio={dbUser.beatmakerProfile?.bio ?? ""}
        isBeatmaker={dbUser.role === UserRole.BEATMAKER}
      />
    </AuthShell>
  );
}
