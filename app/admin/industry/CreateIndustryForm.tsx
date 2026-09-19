"use client";

import { useActionState, useState } from "react";
import { Button, Input } from "@/components/ui";
import { createIndustryContact, type CreateIndustryContactState } from "./actions";

export function CreateIndustryForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<CreateIndustryContactState, FormData>(
    createIndustryContact,
    {},
  );

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Create Industry Contact
      </Button>
    );
  }

  return (
    <form
      action={formAction}
      className="mb-8 flex flex-col gap-3 rounded-card border border-border bg-elevated p-6"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input name="companyName" placeholder="Company name" required />
        <Input name="handle" placeholder="Account handle (e.g. acme_records)" required />
        <Input name="contactName" placeholder="Contact name (optional)" />
        <Input name="contactEmail" type="email" placeholder="Contact email" required />
        <Input
          name="contactType"
          placeholder="Type (e.g. Label, A&R, Music Supervisor, Game Studio, Brand)"
          className="sm:col-span-2"
        />
      </div>
      <p className="font-sans text-xs text-faint">
        This sends the contact an email invite to set a password and log in.
      </p>
      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create & send invite"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
