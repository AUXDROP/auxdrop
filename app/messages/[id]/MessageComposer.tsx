"use client";

import { useActionState, useRef } from "react";
import { Input } from "@/components/ui";
import { sendMessage, type SendMessageState } from "../actions";

export function MessageComposer({ conversationId }: { conversationId: string }) {
  const boundAction = sendMessage.bind(null, conversationId);
  const [state, formAction, pending] = useActionState<SendMessageState, FormData>(
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
      className="flex items-center gap-3 border-t border-border p-4"
    >
      <Input name="body" placeholder="Write a message..." required className="flex-1" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-button bg-signal px-5 py-3.5 font-sans text-sm font-bold text-on-dark disabled:opacity-60"
      >
        Send
      </button>
      {state?.error && (
        <p className="font-sans text-xs text-status-error">{state.error}</p>
      )}
    </form>
  );
}
