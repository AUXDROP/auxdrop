"use client";

import { useState, useTransition } from "react";
import { castJudgment } from "./actions";

export function VoteWidget({
  submissionId,
  initialScore,
}: {
  submissionId: string;
  initialScore: number | null;
}) {
  const [score, setScore] = useState(initialScore ?? 0);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function vote(value: number) {
    setError("");
    startTransition(async () => {
      const result = await castJudgment(submissionId, value);
      if (result?.error) {
        setError(result.error);
      } else {
        setScore(value);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            disabled={pending}
            onClick={() => vote(n)}
            aria-label={`Rate ${n} out of 5`}
            className={
              "font-display text-xl leading-none disabled:cursor-not-allowed " +
              (n <= score ? "text-signal" : "text-border hover:text-muted")
            }
          >
            ★
          </button>
        ))}
      </div>
      {error && <span className="font-sans text-xs text-status-error">{error}</span>}
    </div>
  );
}
