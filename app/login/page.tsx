import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { Wordmark } from "@/components/layout/Wordmark";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in — AUXDROP",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <Wordmark />
      <h1 className="font-display text-3xl font-extrabold text-on-dark">Log in</h1>
      <LoginForm />
    </AuthShell>
  );
}
