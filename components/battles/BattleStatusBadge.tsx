import { Badge, type BadgeStatus } from "@/components/ui";
import { BattleStatus } from "@/generated/prisma/client";

const STATUS_MAP: Record<BattleStatus, BadgeStatus> = {
  UPCOMING: "upcoming",
  OPEN: "open",
  PENDING: "pending",
  COMPLETED: "completed",
  ERROR: "error",
};

export function BattleStatusBadge({ status }: { status: BattleStatus }) {
  return <Badge status={STATUS_MAP[status]}>{status}</Badge>;
}
