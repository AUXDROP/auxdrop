"use client";

import { useActionState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { updateContentBlock, type UpdateContentBlockState } from "./actions";

export function EditContentBlockForm({
  id,
  title,
  body,
  position,
  isPublished,
  showPosition,
}: {
  id: string;
  title: string;
  body: string;
  position: number | null;
  isPublished: boolean;
  showPosition: boolean;
}) {
  const boundAction = updateContentBlock.bind(null, id);
  const [state, formAction, pending] = useActionState<UpdateContentBlockState, FormData>(
    boundAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Input name="title" defaultValue={title} placeholder="Title" required />
      {showPosition && (
        <Input
          name="position"
          type="number"
          defaultValue={position ?? undefined}
          placeholder="Position (display order)"
        />
      )}
      <Textarea name="body" defaultValue={body} rows={12} required />
      <label className="flex items-center gap-2 font-sans text-[13px] text-muted">
        <input type="checkbox" name="publish" defaultChecked={isPublished} />
        Published
      </label>
      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
