"use client";

import { useTransition } from "react";
import { removeTrackFromRelease, moveTrack } from "./actions";

export function TrackRow({
  releaseId,
  releaseTrackId,
  title,
  handle,
  isFirst,
  isLast,
}: {
  releaseId: string;
  releaseTrackId: string;
  title: string;
  handle: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between gap-4 rounded-input border border-border bg-elevated px-4 py-3">
      <div>
        <div className="font-sans text-[13px] font-semibold text-on-dark">{title}</div>
        <div className="font-sans text-xs text-faint">by {handle}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={pending || isFirst}
          onClick={() => startTransition(() => moveTrack(releaseId, releaseTrackId, "up"))}
          className="font-sans text-xs font-bold text-muted disabled:cursor-not-allowed disabled:text-faint"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={pending || isLast}
          onClick={() => startTransition(() => moveTrack(releaseId, releaseTrackId, "down"))}
          className="font-sans text-xs font-bold text-muted disabled:cursor-not-allowed disabled:text-faint"
        >
          ↓
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => removeTrackFromRelease(releaseId, releaseTrackId))}
          className="font-sans text-xs font-semibold text-status-error disabled:cursor-not-allowed disabled:text-faint"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
