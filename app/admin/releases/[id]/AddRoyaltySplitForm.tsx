"use client";

import { useActionState } from "react";
import { Button, Input } from "@/components/ui";
import { addRoyaltySplit, type AddRoyaltySplitState } from "./actions";

export function AddRoyaltySplitForm({ releaseId }: { releaseId: string }) {
  const boundAction = addRoyaltySplit.bind(null, releaseId);
  const [state, formAction, pending] = useActionState<AddRoyaltySplitState, FormData>(
    boundAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <Input
        name="handle"
        placeholder="Beatmaker handle (blank = platform)"
        className="sm:max-w-xs"
      />
      <Input name="percentage" type="number" step="0.01" placeholder="Percentage" className="sm:max-w-[140px]" />
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Adding..." : "Add split"}
      </Button>
      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}
    </form>
  );
}
