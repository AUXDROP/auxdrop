"use client";

import { useActionState, useRef } from "react";
import { Input } from "@/components/ui";
import { addBattleComment, type AddCommentState } from "./actions";

export function CommentForm({ battleId }: { battleId: string }) {
  const boundAction = addBattleComment.bind(null, battleId);
  const [state, formAction, pending] = useActionState<AddCommentState, FormData>(
    boundAction,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="mt-8 flex flex-col gap-2"
    >
      <Input name="body" placeholder="Add a comment..." required disabled={pending} />
      {state?.error && (
        <p className="font-sans text-xs text-status-error">{state.error}</p>
      )}
    </form>
  );
}
