"use client";

import { useActionState, useState } from "react";
import { Button, Input } from "@/components/ui";
import { JudgingType } from "@/generated/prisma/enums";
import { createBattle, type CreateBattleState } from "./actions";

export function CreateBattleForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<CreateBattleState, FormData>(
    createBattle,
    {},
  );

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Create Battle
      </Button>
    );
  }

  return (
    <form
      action={formAction}
      className="mb-8 flex flex-col gap-3 rounded-card border border-border bg-elevated p-6"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input name="title" placeholder="Title (e.g. Flip This Sample)" required />
        <Input name="genre" placeholder="Genre (optional)" />
        <Input name="entryFee" type="number" defaultValue={25} placeholder="Entry fee" />
        <Input
          name="durationMinutes"
          type="number"
          defaultValue={60}
          placeholder="Duration (minutes)"
        />
        <label className="flex flex-col gap-1 font-sans text-xs text-faint">
          Starts at
          <Input name="startsAt" type="datetime-local" required />
        </label>
        <label className="flex flex-col gap-1 font-sans text-xs text-faint">
          Submission deadline
          <Input name="submissionDeadline" type="datetime-local" required />
        </label>
        <label className="flex flex-col gap-1 font-sans text-xs text-faint">
          Judging type
          <select
            name="judgingType"
            defaultValue={JudgingType.COMMUNITY}
            className="rounded-input border border-border bg-elevated px-3 py-2.5 font-sans text-sm text-on-dark"
          >
            {Object.values(JudgingType).map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 font-sans text-xs text-faint">
          Voting deadline (optional)
          <Input name="judgingDeadline" type="datetime-local" />
        </label>
      </div>
      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Save Battle"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
