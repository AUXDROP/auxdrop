"use client";

import { useActionState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { completeOnboarding, type OnboardingState } from "./actions";

const initialState: OnboardingState = {};

// Matches the mockup's fixture genre list. Purely decorative for now — see
// the caption below.
const GENRES = ["Trap", "R&B", "Drill", "Boom Bap", "Lo-fi", "Afrobeats"];

export function OnboardingForm({
  initialHandle,
  initialBio,
  isBeatmaker,
}: {
  initialHandle: string;
  initialBio: string;
  isBeatmaker: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    completeOnboarding,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Input
          name="handle"
          defaultValue={initialHandle}
          placeholder="Username"
          autoComplete="username"
          required
        />
        {isBeatmaker && (
          <Textarea
            name="bio"
            defaultValue={initialBio}
            placeholder="A short bio for your profile"
            rows={3}
          />
        )}
      </div>

      {isBeatmaker && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <span
                key={genre}
                className="cursor-not-allowed rounded-pill border border-border px-3.5 py-2 font-sans text-xs font-semibold text-faint"
              >
                {genre}
              </span>
            ))}
          </div>
          {/* Genre preference isn't representable in the schema yet (see
              docs/04-data-model.md) — shown but inert rather than silently
              dropped, so it's visibly not being saved. */}
          <p className="font-sans text-xs text-faint">
            Genre preferences aren&apos;t saved yet — not supported by the
            schema until a later step.
          </p>
        </div>
      )}

      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : "Finish setup"}
      </Button>
    </form>
  );
}
