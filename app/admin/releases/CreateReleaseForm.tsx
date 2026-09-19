"use client";

import { useActionState, useState } from "react";
import { Button, Input } from "@/components/ui";
import { createRelease, type CreateReleaseState } from "./actions";

export function CreateReleaseForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<CreateReleaseState, FormData>(
    createRelease,
    {},
  );

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Create Release
      </Button>
    );
  }

  return (
    <form
      action={formAction}
      className="mb-8 flex flex-col gap-3 rounded-card border border-border bg-elevated p-6"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input name="title" placeholder="Title (e.g. Season 03 Compilation)" required />
        <Input name="season" placeholder="Season label (optional, e.g. Season 3)" />
      </div>
      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Save Release"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
