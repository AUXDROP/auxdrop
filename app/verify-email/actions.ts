"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUserRow } from "@/lib/user";
import { getOrigin } from "@/lib/origin";

export interface CheckVerifiedState {
  error?: string;
}

export async function checkEmailVerified(): Promise<CheckVerifiedState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You're not signed in — sign up or log in again." };
  }
  if (!user.email_confirmed_at) {
    return { error: "Still waiting on that confirmation — check your inbox." };
  }

  await ensureUserRow(user);
  redirect("/onboarding");
}

export interface ResendState {
  error?: string;
  resent?: boolean;
}

export async function resendVerificationEmail(
  _prevState: ResendState,
  formData: FormData,
): Promise<ResendState> {
  const email = String(formData.get("email") || "");
  if (!email) {
    return { error: "Missing email address." };
  }

  const supabase = await createClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    return { error: error.message };
  }
  return { resent: true };
}
