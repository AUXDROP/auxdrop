"use client";

import { useTransition } from "react";
import { unassignJudge } from "./actions";

export function UnassignJudgeButton({
  battleId,
  userId,
}: {
  battleId: string;
  userId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => unassignJudge(battleId, userId))}
      className="font-sans text-xs font-semibold text-status-error disabled:cursor-not-allowed disabled:text-faint"
    >
      Remove
    </button>
  );
}
