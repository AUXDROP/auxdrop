"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui";
import { assignBattle } from "./actions";

export function AssignBattleForm({
  sponsorshipId,
  availableBattles,
}: {
  sponsorshipId: string;
  availableBattles: { id: string; title: string }[];
}) {
  const [pending, startTransition] = useTransition();

  if (availableBattles.length === 0) {
    return <p className="font-sans text-xs text-faint">No unsponsored battles to assign.</p>;
  }

  return (
    <form
      action={(formData) => startTransition(() => assignBattle(sponsorshipId, formData))}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <select
        name="battleId"
        className="rounded-input border border-border bg-elevated px-3 py-2.5 font-sans text-sm text-on-dark sm:max-w-sm"
      >
        {availableBattles.map((b) => (
          <option key={b.id} value={b.id}>
            {b.title}
          </option>
        ))}
      </select>
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Assigning..." : "Assign battle"}
      </Button>
    </form>
  );
}
