"use client";

import { useTransition } from "react";
import { setBeatmakerVerified } from "./actions";

export function VerifiedToggle({
  userId,
  isVerified,
}: {
  userId: string;
  isVerified: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => setBeatmakerVerified(userId, !isVerified))}
      className="font-sans text-xs font-semibold text-accent disabled:cursor-not-allowed disabled:text-faint"
    >
      {isVerified ? "Unverify" : "Verify"}
    </button>
  );
}
