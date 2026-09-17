import type { Metadata } from "next";
import { AuthShell } from "@/components/layout/AuthShell";
import { VerifyEmailPanel } from "./VerifyEmailPanel";

export const metadata: Metadata = {
  title: "Verify your email — AUXDROP",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <AuthShell maxWidth={420}>
      <VerifyEmailPanel email={email} />
    </AuthShell>
  );
}
