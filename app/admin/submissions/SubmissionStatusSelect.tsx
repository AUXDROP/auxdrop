"use client";

import { useTransition } from "react";
import { SubmissionStatus } from "@/generated/prisma/enums";
import { setSubmissionStatus } from "./actions";

export function SubmissionStatusSelect({
  submissionId,
  status,
}: {
  submissionId: string;
  status: SubmissionStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(() =>
          setSubmissionStatus(submissionId, e.target.value as SubmissionStatus),
        )
      }
      className="rounded-input border border-border bg-elevated px-2 py-1 font-sans text-[11px] font-bold text-on-dark"
    >
      {Object.values(SubmissionStatus).map((s) => (
        <option key={s} value={s}>
          {s.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
