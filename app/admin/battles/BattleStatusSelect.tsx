"use client";

import { useTransition } from "react";
import { BattleStatus } from "@/generated/prisma/enums";
import { setBattleStatus } from "./actions";

export function BattleStatusSelect({
  battleId,
  status,
}: {
  battleId: string;
  status: BattleStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => setBattleStatus(battleId, e.target.value as BattleStatus))
      }
      className="rounded-input border border-border bg-elevated px-2 py-1 font-sans text-[11px] font-bold text-on-dark"
    >
      {Object.values(BattleStatus).map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
