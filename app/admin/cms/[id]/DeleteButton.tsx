"use client";

import { useTransition } from "react";
import { deleteContentBlock } from "./actions";

export function DeleteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this content block? This can't be undone.")) {
          startTransition(() => deleteContentBlock(id));
        }
      }}
      className="font-sans text-xs font-semibold text-status-error disabled:cursor-not-allowed disabled:text-faint"
    >
      Delete
    </button>
  );
}
