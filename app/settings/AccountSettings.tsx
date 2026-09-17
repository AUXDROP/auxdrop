"use client";

import { useActionState } from "react";
import { Button, Input } from "@/components/ui";
import {
  updateEmail,
  updatePassword,
  deleteAccount,
  type EmailState,
  type PasswordState,
} from "./actions";

function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [state, formAction, pending] = useActionState<EmailState, FormData>(
    updateEmail,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="font-sans text-xs font-semibold text-faint">Email</div>
      <Input
        type="email"
        name="email"
        defaultValue={currentEmail}
        autoComplete="email"
        required
      />
      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}
      {state?.success && (
        <p className="font-sans text-[13px] text-status-open">{state.success}</p>
      )}
      <Button
        type="submit"
        variant="secondary"
        disabled={pending}
        className="mt-1 self-start"
      >
        {pending ? "Saving..." : "Update email"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const [state, formAction, pending] = useActionState<PasswordState, FormData>(
    updatePassword,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <div className="font-sans text-xs font-semibold text-faint">Password</div>
      <div className="flex flex-col gap-2">
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
      {state?.success && (
        <p className="font-sans text-[13px] text-status-open">{state.success}</p>
      )}
      <Button
        type="submit"
        variant="secondary"
        disabled={pending}
        className="mt-1 self-start"
      >
        {pending ? "Saving..." : "Update password"}
      </Button>
    </form>
  );
}

function DeleteAccountButton() {
  return (
    <form
      action={deleteAccount}
      onSubmit={(e) => {
        if (
          !confirm(
            "Delete your AUXDROP account? This can't be undone.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="secondary" className="border-status-error text-status-error">
        Delete account
      </Button>
    </form>
  );
}

export function AccountSettings({ email }: { email: string }) {
  return (
    <div className="flex max-w-[480px] flex-col gap-8">
      <EmailForm currentEmail={email} />
      <PasswordForm />
      <div className="flex flex-col gap-2 border-t border-border pt-8">
        <div className="font-sans text-xs font-semibold text-faint">Danger zone</div>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
