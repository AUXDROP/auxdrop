import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset your password — AUXDROP",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <h1 className="font-display text-3xl font-extrabold text-on-dark">
        Reset your password
      </h1>
      <p className="font-sans text-[13px] text-muted">
        We&apos;ll send a reset link to your email.
      </p>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
