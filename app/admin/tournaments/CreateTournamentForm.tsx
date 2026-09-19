"use client";

import { useActionState, useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { createTournament, type CreateTournamentState } from "./actions";

export function CreateTournamentForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<CreateTournamentState, FormData>(
    createTournament,
    {},
  );

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Create Tournament
      </Button>
    );
  }

  return (
    <form
      action={formAction}
      className="mb-8 flex flex-col gap-3 rounded-card border border-border bg-elevated p-6"
    >
      <Input name="title" placeholder="Title (e.g. AUXDROP Championship)" required />
      <Textarea
        name="handles"
        placeholder={"Beatmaker handles, one per line, in seed order (seed 1 first)"}
        rows={6}
      />
      <p className="font-sans text-xs text-faint">
        Round shells are created for the whole bracket immediately. Round 1&apos;s
        actual matches (and every round after it) are generated separately —
        you&apos;ll start each round from this tournament&apos;s page.
      </p>
      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Save Tournament"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
