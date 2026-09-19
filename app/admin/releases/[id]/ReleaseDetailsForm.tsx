"use client";

import { useActionState } from "react";
import { Button, Input } from "@/components/ui";
import { updateReleaseDetails, type UpdateReleaseDetailsState } from "./actions";

export function ReleaseDetailsForm({
  releaseId,
  releaseDate,
  spotifyUrl,
  appleMusicUrl,
  tidalUrl,
}: {
  releaseId: string;
  releaseDate: string;
  spotifyUrl: string;
  appleMusicUrl: string;
  tidalUrl: string;
}) {
  const boundAction = updateReleaseDetails.bind(null, releaseId);
  const [state, formAction, pending] = useActionState<UpdateReleaseDetailsState, FormData>(
    boundAction,
    {},
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded-card border border-border bg-elevated p-6"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 font-sans text-xs text-faint">
          Release date
          <Input name="releaseDate" type="date" defaultValue={releaseDate} />
        </label>
        <Input name="spotifyUrl" defaultValue={spotifyUrl} placeholder="Spotify URL" />
        <Input name="appleMusicUrl" defaultValue={appleMusicUrl} placeholder="Apple Music URL" />
        <Input name="tidalUrl" defaultValue={tidalUrl} placeholder="Tidal URL" />
      </div>
      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving..." : "Save details"}
      </Button>
    </form>
  );
}
