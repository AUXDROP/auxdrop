"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui";
import { startConversation } from "./actions";

export function MessageButton({ targetUserId }: { targetUserId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="secondary"
      disabled={pending}
      onClick={() => startTransition(() => startConversation(targetUserId))}
    >
      Message
    </Button>
  );
}
