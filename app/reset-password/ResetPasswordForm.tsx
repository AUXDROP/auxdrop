"use client";

import { useActionState } from "react";
import { Button, Input } from "@/components/ui";
import { resetPassword, type ResetPasswordState } from "./actions";

const initialState: ResetPasswordState = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPassword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Input
          type="password"
          name="password"
          placeholder="New password"
          autoComplete="new-password"
          required
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          autoComplete="new-password"
          required
        />
      </div>

      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : "Set new password"}
      </Button>
    </form>
  );
}
