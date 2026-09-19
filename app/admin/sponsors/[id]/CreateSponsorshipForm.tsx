"use client";

import { useActionState, useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { createSponsorship, type CreateSponsorshipState } from "./actions";

export function CreateSponsorshipForm({ sponsorId }: { sponsorId: string }) {
  const [open, setOpen] = useState(false);
  const boundAction = createSponsorship.bind(null, sponsorId);
  const [state, formAction, pending] = useActionState<CreateSponsorshipState, FormData>(
    boundAction,
    {},
  );

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Add Sponsorship
      </Button>
    );
  }

  return (
    <form
      action={formAction}
      className="mb-8 flex flex-col gap-3 rounded-card border border-border bg-elevated p-6"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input name="packageName" placeholder="Package name (e.g. Season Partner)" />
        <Input name="amountContributed" type="number" step="0.01" placeholder="Amount contributed" />
        <label className="flex flex-col gap-1 font-sans text-xs text-faint">
          Start date
          <Input name="startDate" type="date" />
        </label>
        <label className="flex flex-col gap-1 font-sans text-xs text-faint">
          End date
          <Input name="endDate" type="date" />
        </label>
        <Textarea
          name="productNotes"
          placeholder="Non-cash contributions (optional) — e.g. plugin licenses, hardware prizes"
          rows={2}
          className="sm:col-span-2"
        />
      </div>
      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Sponsorship"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
