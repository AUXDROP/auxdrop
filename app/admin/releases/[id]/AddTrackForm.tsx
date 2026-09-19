"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui";
import { addTrackToRelease } from "./actions";

export function AddTrackForm({
  releaseId,
  availableTracks,
}: {
  releaseId: string;
  availableTracks: { id: string; title: string; handle: string }[];
}) {
  const [pending, startTransition] = useTransition();

  if (availableTracks.length === 0) {
    return (
      <p className="font-sans text-xs text-faint">
        No more tracks available to add.
      </p>
    );
  }

  return (
    <form
      action={(formData) => startTransition(() => addTrackToRelease(releaseId, formData))}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <select
        name="trackId"
        className="rounded-input border border-border bg-elevated px-3 py-2.5 font-sans text-sm text-on-dark sm:max-w-sm"
      >
        {availableTracks.map((t) => (
          <option key={t.id} value={t.id}>
            {t.title} — by {t.handle}
          </option>
        ))}
      </select>
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Adding..." : "Add track"}
      </Button>
    </form>
  );
}
