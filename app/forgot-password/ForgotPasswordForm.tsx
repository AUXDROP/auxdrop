"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { requestPasswordReset, type ForgotPasswordState } from "./actions";

const initialState: ForgotPasswordState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  if (state?.success) {
    return (
      <p className="font-sans text-[13px] text-muted">
        If that email has an account, we&apos;ve sent a reset link to it.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input
        type="email"
        name="email"
        placeholder="Email address"
        autoComplete="email"
        required
      />

      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending..." : "Send reset link"}
      </Button>

      <div className="text-center font-sans text-[13px] text-faint">
        <Link href="/login" className="font-semibold text-on-dark">
          Back to log in
        </Link>
      </div>
    </form>
  );
}
