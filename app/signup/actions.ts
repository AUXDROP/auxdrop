"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUserRow } from "@/lib/user";
import { getOrigin } from "@/lib/origin";

export interface SignupState {
  error?: string;
}

const HANDLE_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;

export async function signup(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = String(formData.get("email") || "").trim();
  const handle = String(formData.get("handle") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "");

  if (!email || !handle || !password) {
    return { error: "All fields are required." };
  }
  if (role !== "BEATMAKER" && role !== "AUDIENCE") {
    return { error: "Choose whether you're competing or here as audience." };
  }
  if (!HANDLE_PATTERN.test(handle)) {
    return {
      error: "Username must be 3-20 characters — letters, numbers, underscore only.",
    };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { handle, role },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }
  if (!data.user) {
    return { error: "Something went wrong creating your account." };
  }

  if (data.session) {
    // Email confirmation isn't required on this Supabase project — the
    // session is already active, so skip straight to onboarding.
    await ensureUserRow(data.user);
    redirect("/onboarding");
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}
