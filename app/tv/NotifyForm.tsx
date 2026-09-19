"use client";

import { useActionState, useState } from "react";
import { Button, Input } from "@/components/ui";
import { joinWaitlist, type JoinWaitlistState } from "./actions";

export function NotifyForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<JoinWaitlistState, FormData>(
    joinWaitlist,
    {},
  );

  if (state?.success) {
    return (
      <span className="font-sans text-[13px] font-bold text-status-open">
        You&apos;re on the list.
      </span>
    );
  }

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Get notified
      </Button>
    );
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <Input
        name="email"
        type="email"
        required
        placeholder="you@email.com"
        className="w-48 py-2.5"
      />
      <Button type="submit" disabled={pending} className="whitespace-nowrap px-4 py-2.5">
        {pending ? "..." : "Notify me"}
      </Button>
      {state?.error && (
        <span className="font-sans text-xs text-status-error">{state.error}</span>
      )}
    </form>
  );
}
