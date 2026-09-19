"use client";

import { useActionState, useState } from "react";
import { Button, Input } from "@/components/ui";
import { fileDispute, type FileDisputeState } from "./actions";

export function DisputeForm({ battleId }: { battleId: string }) {
  const [open, setOpen] = useState(false);
  const boundAction = fileDispute.bind(null, battleId);
  const [state, formAction, pending] = useActionState<FileDisputeState, FormData>(
    boundAction,
    {},
  );

  if (state?.success) {
    return (
      <p className="font-sans text-xs text-status-open">
        Thanks — a moderator will take a look.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-sans text-xs text-faint underline underline-offset-4"
      >
        Report an issue with this battle
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <Input name="reason" placeholder="What's wrong?" required />
      {state?.error && (
        <p className="font-sans text-xs text-status-error">{state.error}</p>
      )}
      <Button type="submit" variant="secondary" disabled={pending} className="self-start">
        {pending ? "Submitting..." : "Submit report"}
      </Button>
    </form>
  );
}
