"use client";

import { useTransition } from "react";
import { ReleaseStatus } from "@/generated/prisma/enums";
import { setReleaseStatus } from "./actions";

export function ReleaseStatusSelect({
  releaseId,
  status,
}: {
  releaseId: string;
  status: ReleaseStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => setReleaseStatus(releaseId, e.target.value as ReleaseStatus))
      }
      className="rounded-input border border-border bg-elevated px-2 py-1 font-sans text-[11px] font-bold text-on-dark"
    >
      {Object.values(ReleaseStatus).map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
