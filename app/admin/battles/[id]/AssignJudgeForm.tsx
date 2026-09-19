"use client";

import { useActionState } from "react";
import { Button, Input } from "@/components/ui";
import { assignJudge, type AssignJudgeState } from "./actions";

export function AssignJudgeForm({ battleId }: { battleId: string }) {
  const boundAction = assignJudge.bind(null, battleId);
  const [state, formAction, pending] = useActionState<AssignJudgeState, FormData>(
    boundAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <Input name="handle" placeholder="Beatmaker handle" className="sm:max-w-xs" />
      <Button type="submit" disabled={pending} variant="secondary">
        {pending ? "Assigning..." : "Assign judge"}
      </Button>
      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}
    </form>
  );
}
