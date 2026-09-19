"use client";

import { useTransition } from "react";
import { removeRoyaltySplit } from "./actions";

export function RoyaltySplitRow({
  releaseId,
  splitId,
  beneficiary,
  percentage,
}: {
  releaseId: string;
  splitId: string;
  beneficiary: string;
  percentage: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between rounded-input border border-border bg-elevated px-4 py-2.5">
      <span className="font-sans text-[13px] font-semibold text-on-dark">{beneficiary}</span>
      <div className="flex items-center gap-4">
        <span className="font-sans text-[13px] text-muted">{percentage}%</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => removeRoyaltySplit(releaseId, splitId))}
          className="font-sans text-xs font-semibold text-status-error disabled:cursor-not-allowed disabled:text-faint"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
