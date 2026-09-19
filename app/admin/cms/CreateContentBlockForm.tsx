"use client";

import { useActionState, useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { ContentBlockType } from "@/generated/prisma/enums";
import { createContentBlock, type CreateContentBlockState } from "./actions";

export function CreateContentBlockForm() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<string>(ContentBlockType.STATIC_PAGE);
  const [state, formAction, pending] = useActionState<CreateContentBlockState, FormData>(
    createContentBlock,
    {},
  );

  if (!open) {
    return (
      <Button type="button" onClick={() => setOpen(true)}>
        Create Content
      </Button>
    );
  }

  return (
    <form
      action={formAction}
      className="mb-8 flex flex-col gap-3 rounded-card border border-border bg-elevated p-6"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 font-sans text-xs text-faint">
          Type
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-input border border-border bg-primary px-3 py-2.5 font-sans text-sm text-on-dark"
          >
            {Object.values(ContentBlockType).map((t) => (
              <option key={t} value={t}>
                {t.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        {type === ContentBlockType.STATIC_PAGE && (
          <Input name="slug" placeholder="Slug (e.g. terms-of-service)" required />
        )}
        <Input name="title" placeholder="Title" required className="sm:col-span-2" />
        {type === ContentBlockType.FAQ_ENTRY && (
          <Input name="position" type="number" placeholder="Position (display order)" />
        )}
        <Textarea
          name="body"
          placeholder="Body (plain text/markdown)"
          rows={6}
          required
          className="sm:col-span-2"
        />
      </div>
      <label className="flex items-center gap-2 font-sans text-[13px] text-muted">
        <input type="checkbox" name="publish" />
        Publish immediately
      </label>
      {state?.error && (
        <p className="font-sans text-[13px] text-status-error">{state.error}</p>
      )}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
