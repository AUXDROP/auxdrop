import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { Wordmark } from "@/components/layout/Wordmark";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign up — AUXDROP",
};

export default function SignUpPage() {
  return (
    <AuthShell>
      <Wordmark />
      <h1 className="font-display text-3xl font-extrabold text-on-dark">
        Create your account
      </h1>
      <SignUpForm />
    </AuthShell>
  );
}
