import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreateTournamentForm } from "./CreateTournamentForm";

export const metadata: Metadata = { title: "Tournament Management — AUXDROP" };

export default async function TournamentManagementPage() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { entrants: true } } },
  });

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/tournaments
      </div>
      <div className="p-12">
        <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
          Tournament Management
        </h1>

        <CreateTournamentForm />

        <div className="mt-8 overflow-x-auto rounded-card border border-border">
          <div className="grid min-w-[600px] grid-cols-[1fr_140px_100px_100px] gap-4 bg-elevated px-5 py-3.5 font-sans text-[11px] font-bold tracking-[0.08em] text-faint">
            <div>NAME</div>
            <div>STATUS</div>
            <div>ENTRANTS</div>
            <div>ACTIONS</div>
          </div>
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="grid min-w-[600px] grid-cols-[1fr_140px_100px_100px] items-center gap-4 border-t border-border px-5 py-4"
            >
              <div className="font-sans text-[13px] font-semibold text-on-dark">{t.title}</div>
              <div className="font-sans text-[13px] text-muted">{t.status}</div>
              <div className="font-sans text-[13px] text-muted">{t._count.entrants}</div>
              <Link
                href={`/admin/tournaments/${t.id}`}
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
