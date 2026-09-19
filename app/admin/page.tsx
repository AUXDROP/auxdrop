import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BattleStatus, SubmissionStatus, DisputeStatus } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Admin — AUXDROP" };

export default async function AdminDashboardPage() {
  const [activeBattles, pendingSubmissions, openDisputes, totalUsers, flaggedSubmissions, disputes] =
    await Promise.all([
      prisma.battle.count({ where: { status: BattleStatus.OPEN } }),
      prisma.submission.count({ where: { status: SubmissionStatus.PENDING_REVIEW } }),
      prisma.dispute.count({ where: { status: DisputeStatus.OPEN } }),
      prisma.user.count(),
      prisma.submission.findMany({
        where: { status: SubmissionStatus.FLAGGED },
        include: { track: { select: { title: true } }, battle: { select: { id: true, title: true } } },
        take: 10,
      }),
      prisma.dispute.findMany({
        where: { status: DisputeStatus.OPEN },
        take: 10,
      }),
    ]);

  const stats = [
    { label: "Active battles", value: activeBattles },
    { label: "Pending submissions", value: pendingSubmissions },
    { label: "Open disputes", value: openDisputes },
    // Mockup's 4th stat was "Users flagged" — no suspend/ban is modeled
    // (deliberately skipped, see docs/04-data-model.md), so this is a
    // real substitute stat rather than a fake number.
    { label: "Total users", value: totalUsers },
  ];

  const flaggedItems = [
    ...flaggedSubmissions.map((s) => ({
      key: `sub-${s.id}`,
      label: `Submission — ${s.track.title} (${s.battle.title})`,
      type: "Flagged",
      href: `/admin/submissions`,
    })),
    ...disputes.map((d) => ({
      key: `dispute-${d.id}`,
      label: `Dispute — ${d.reason}`,
      type: "Open",
      href: `/admin/disputes`,
    })),
  ];

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin
      </div>
      <div className="p-12">
        <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
          Admin Overview
        </h1>

        <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-card bg-border lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-elevated p-6">
              <div className="font-sans text-xs text-faint">{s.label}</div>
              <div className="mt-2 font-display text-2xl font-extrabold text-on-dark">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4 font-sans text-xs font-bold tracking-[0.1em] text-faint">
          FLAGGED FOR REVIEW
        </div>
        {flaggedItems.length === 0 ? (
          <div className="rounded-input border border-border bg-elevated p-8 text-center font-sans text-[13px] text-faint">
            Nothing flagged right now.
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border overflow-hidden rounded-input bg-border">
            {flaggedItems.map((f) => (
              <Link
                key={f.key}
                href={f.href}
                className="flex justify-between bg-elevated px-5 py-4 hover:bg-primary"
              >
                <span className="font-sans text-[13px] font-semibold text-on-dark">
                  {f.label}
                </span>
                <span className="font-sans text-[11px] font-bold text-status-pending">
                  {f.type}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
