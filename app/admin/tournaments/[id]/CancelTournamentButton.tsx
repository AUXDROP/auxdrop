"use client";

import { useTransition } from "react";
import { cancelTournament } from "./actions";

export function CancelTournamentButton({ tournamentId }: { tournamentId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Cancel this tournament? Existing rounds and battles are kept as history.")) {
          startTransition(() => cancelTournament(tournamentId));
        }
      }}
      className="font-sans text-xs font-semibold text-status-error disabled:cursor-not-allowed disabled:text-faint"
    >
      Cancel tournament
    </button>
  );
}
