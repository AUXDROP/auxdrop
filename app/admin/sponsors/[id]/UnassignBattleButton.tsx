"use client";

import { useTransition } from "react";
import { unassignBattle } from "./actions";

export function UnassignBattleButton({
  sponsorId,
  battleId,
}: {
  sponsorId: string;
  battleId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => unassignBattle(sponsorId, battleId))}
      className="font-sans text-xs font-semibold text-status-error disabled:cursor-not-allowed disabled:text-faint"
    >
      Remove
    </button>
  );
}
