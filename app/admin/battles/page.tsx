import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BattleStatusSelect } from "./BattleStatusSelect";
import { CreateBattleForm } from "./CreateBattleForm";

export const metadata: Metadata = { title: "Battle Management — AUXDROP" };

export default async function BattleManagementPage() {
  const battles = await prisma.battle.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: true } } },
  });

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/battles
      </div>
      <div className="p-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-extrabold text-on-dark">
            Battle Management
          </h1>
        </div>

        <CreateBattleForm />

        <div className="mt-8 overflow-x-auto rounded-card border border-border">
          <div className="grid min-w-[600px] grid-cols-[1fr_120px_100px_100px] gap-4 bg-elevated px-5 py-3.5 font-sans text-[11px] font-bold tracking-[0.08em] text-faint">
            <div>NAME</div>
            <div>STATUS</div>
            <div>ENTRIES</div>
            <div>ACTIONS</div>
          </div>
          {battles.map((b) => (
            <div
              key={b.id}
              className="grid min-w-[600px] grid-cols-[1fr_120px_100px_100px] items-center gap-4 border-t border-border px-5 py-4"
            >
              <div className="font-sans text-[13px] font-semibold text-on-dark">
                {b.title}
              </div>
              <BattleStatusSelect battleId={b.id} status={b.status} />
              <div className="font-sans text-[13px] text-muted">
                {b._count.submissions}
              </div>
              <Link
                href={`/admin/battles/${b.id}`}
                className="font-sans text-xs font-semibold text-signal"
              >
                Manage
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
