"use client";

import { useRef } from "react";
import { Button, Input } from "@/components/ui";
import { DisputeStatus } from "@/generated/prisma/enums";
import { resolveDispute } from "./actions";

export function DisputeActions({ disputeId }: { disputeId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} className="flex items-center gap-2">
      <Input name="resolution" placeholder="Resolution notes (optional)" className="flex-1" />
      <Button
        type="submit"
        variant="secondary"
        formAction={resolveDispute.bind(null, disputeId, DisputeStatus.RESOLVED)}
      >
        Resolve
      </Button>
      <Button
        type="submit"
        variant="secondary"
        formAction={resolveDispute.bind(null, disputeId, DisputeStatus.DISMISSED)}
      >
        Dismiss
      </Button>
    </form>
  );
}
