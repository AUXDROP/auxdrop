"use client";

import { useTransition } from "react";
import { setUserAdmin } from "./actions";

export function AdminToggle({
  userId,
  isAdmin,
  isSelf,
}: {
  userId: string;
  isAdmin: boolean;
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending || (isSelf && isAdmin)}
      onClick={() => startTransition(() => setUserAdmin(userId, !isAdmin))}
      className="font-sans text-xs font-semibold text-signal disabled:cursor-not-allowed disabled:text-faint"
    >
      {isAdmin ? "Revoke admin" : "Make admin"}
    </button>
  );
}
