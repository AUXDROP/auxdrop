import { type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeStatus =
  | "open"
  | "upcoming"
  | "pending"
  | "error"
  | "licensing"
  | "completed";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Same 4 colors back both status pills (OPEN/UPCOMING/PENDING/etc.) and the
   * commercial-asset badges (LICENSE AVAILABLE, OFFICIAL DSP RELEASE, ...) —
   * pass whatever label fits via `children`.
   */
  status: BadgeStatus;
}

const statusClasses: Record<BadgeStatus, string> = {
  open: "text-status-open bg-status-open/12",
  upcoming: "text-status-upcoming bg-status-upcoming/12",
  pending: "text-status-pending bg-status-pending/12",
  error: "text-status-error bg-status-error/12",
  licensing: "text-status-licensing bg-status-licensing/12",
  completed: "text-status-completed bg-status-completed/12",
};

export function Badge({ status, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wide",
        statusClasses[status],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
