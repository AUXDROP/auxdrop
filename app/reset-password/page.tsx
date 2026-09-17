import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set a new password — AUXDROP",
};

// Not part of the original mockup list — the second half of the Forgot
// Password flow (arrived at via the emailed reset link, through
// /auth/callback). Without it, Forgot Password could request a reset email
// but never actually let anyone set a new password.
export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <h1 className="font-display text-3xl font-extrabold text-on-dark">
        Set a new password
      </h1>
      <ResetPasswordForm />
    </AuthShell>
  );
}
