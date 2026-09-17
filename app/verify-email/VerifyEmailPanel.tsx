"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { checkEmailVerified, resendVerificationEmail } from "./actions";

export function VerifyEmailPanel({ email }: { email?: string }) {
  const [checkState, checkAction, checkPending] = useActionState(
    checkEmailVerified,
    {},
  );
  const [resendState, resendAction, resendPending] = useActionState(
    resendVerificationEmail,
    {},
  );

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/[0.14]">
        <span className="h-2.5 w-2.5 rounded-full bg-accent" />
      </div>
      <h1 className="font-display text-2xl font-extrabold text-on-dark">
        Verify your email
      </h1>
      <p className="font-sans text-sm text-muted">
        We sent a verification link to{" "}
        {email ? <span className="text-on-dark">{email}</span> : "your inbox"}.
        Click it to activate your account.
      </p>

      <form action={checkAction}>
        <Button type="submit" disabled={checkPending}>
          {checkPending ? "Checking..." : "I've verified my email"}
        </Button>
      </form>
      {checkState?.error && (
        <p className="font-sans text-[13px] text-status-error">{checkState.error}</p>
      )}

      {email && (
        <form action={resendAction}>
          <input type="hidden" name="email" value={email} />
          <button
            type="submit"
            disabled={resendPending}
            className="font-sans text-xs text-faint underline underline-offset-4"
          >
            {resendPending
              ? "Resending..."
              : resendState?.resent
                ? "Sent — check your inbox"
                : "Didn't get it? Resend"}
          </button>
        </form>
      )}
    </div>
  );
}
