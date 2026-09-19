"use client";

import { useActionState, useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { GENRES } from "@/lib/genres";
import { completeOnboarding, type OnboardingState } from "./actions";

const initialState: OnboardingState = {};

export function OnboardingForm({
  initialHandle,
  initialBio,
  initialLocation,
  initialGenres,
  isBeatmaker,
}: {
  initialHandle: string;
  initialBio: string;
  initialLocation: string;
  initialGenres: string[];
  isBeatmaker: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    completeOnboarding,
    initialState,
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialGenres);

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  }

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
          <>
            <Textarea
              name="bio"
              defaultValue={initialBio}
              placeholder="A short bio for your profile"
              rows={3}
            />
            <Input
              name="location"
              defaultValue={initialLocation}
              placeholder="Location (e.g. Atlanta, GA)"
            />
          </>
        )}
      </div>

      {isBeatmaker && (
        <div className="flex flex-col gap-2">
          <div className="font-sans text-xs font-semibold text-faint">
            Genres
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => {
              const selected = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={
                    "rounded-pill border px-3.5 py-2 font-sans text-xs font-semibold " +
                    (selected
                      ? "border-signal bg-signal/[0.14] text-on-dark"
                      : "border-border text-faint hover:text-muted")
                  }
                >
                  {genre}
                </button>
              );
            })}
          </div>
          {selectedGenres.map((g) => (
            <input key={g} type="hidden" name="genres" value={g} />
          ))}
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
