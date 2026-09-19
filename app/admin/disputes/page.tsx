import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui";
import { DisputeStatus } from "@/generated/prisma/client";
import { DisputeActions } from "./DisputeActions";

export const metadata: Metadata = { title: "Dispute Resolution — AUXDROP" };

const STATUS_BADGE = {
  [DisputeStatus.OPEN]: "pending",
  [DisputeStatus.RESOLVED]: "open",
  [DisputeStatus.DISMISSED]: "completed",
} as const;

export default async function DisputeResolutionPage() {
  const disputes = await prisma.dispute.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      filedBy: { select: { handle: true } },
      battle: { select: { title: true } },
    },
  });

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/disputes
      </div>
      <div className="p-12">
        <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
          Dispute Resolution
        </h1>

        {disputes.length === 0 ? (
          <p className="font-sans text-[13px] text-faint">No disputes filed.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="flex flex-col gap-3 rounded-input border border-border bg-elevated p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-sans text-[13px] font-semibold text-on-dark">
                      {d.reason}
                    </div>
                    <div className="mt-1 font-sans text-xs text-faint">
                      Filed by {d.filedBy.handle}
                      {d.battle ? ` · ${d.battle.title}` : ""}
                    </div>
                  </div>
                  <Badge status={STATUS_BADGE[d.status]}>{d.status}</Badge>
                </div>
                {d.resolution && (
                  <div className="rounded-input bg-primary p-3 font-sans text-xs text-muted">
                    Resolution: {d.resolution}
                  </div>
                )}
                {d.status === DisputeStatus.OPEN && <DisputeActions disputeId={d.id} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
