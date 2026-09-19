import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RoundStatus, TournamentStatus } from "@/generated/prisma/client";
import { StartRoundForm } from "./StartRoundForm";
import { CancelTournamentButton } from "./CancelTournamentButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const tournament = await prisma.tournament.findUnique({ where: { id } });
  return { title: tournament ? `${tournament.title} — Admin — AUXDROP` : "Admin — AUXDROP" };
}

export default async function AdminTournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      entrants: { include: { user: { select: { handle: true } } }, orderBy: { seed: "asc" } },
      rounds: {
        orderBy: { roundNumber: "asc" },
        include: {
          matches: {
            orderBy: { position: "asc" },
            include: {
              userA: { select: { handle: true } },
              userB: { select: { handle: true } },
              byeWinner: { select: { handle: true } },
              battle: { select: { id: true, status: true } },
            },
          },
        },
      },
    },
  });
  if (!tournament) notFound();

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/tournaments/{tournament.id}
      </div>
      <div className="p-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-1 font-display text-3xl font-extrabold text-on-dark">
              {tournament.title}
            </h1>
            <div className="font-sans text-sm text-faint">
              {tournament.status} · {tournament.entrants.length} entrants
            </div>
          </div>
          {tournament.status !== TournamentStatus.CANCELLED &&
            tournament.status !== TournamentStatus.COMPLETED && (
              <CancelTournamentButton tournamentId={tournament.id} />
            )}
        </div>

        <div className="mb-10">
          <div className="mb-3 font-sans text-xs font-bold tracking-[0.08em] text-faint">
            SEEDS
          </div>
          <div className="flex flex-wrap gap-2">
            {tournament.entrants.map((e) => (
              <span
                key={e.id}
                className="rounded-pill border border-border bg-elevated px-3 py-1.5 font-sans text-xs font-semibold text-on-dark"
              >
                #{e.seed} {e.user.handle}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {tournament.rounds.map((round, i) => {
            const previousRound = tournament.rounds[i - 1];
            const canStart =
              round.status === RoundStatus.PENDING &&
              (round.roundNumber === 1 || previousRound?.status === RoundStatus.COMPLETED);

            return (
              <div key={round.id}>
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="font-display text-lg font-bold text-on-dark">{round.label}</h2>
                  <span className="font-sans text-xs font-semibold text-faint">
                    {round.status}
                  </span>
                </div>

                {round.matches.length === 0 ? (
                  <p className="mb-2 font-sans text-[13px] text-faint">
                    Not generated yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {round.matches.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-card border border-border bg-elevated p-4"
                      >
                        <div className="mb-2 font-sans text-[11px] text-faint">
                          Match {m.position}
                        </div>
                        <div className="font-sans text-[13px] font-semibold text-on-dark">
                          {m.userA?.handle ?? "—"}
                        </div>
                        <div className="font-sans text-[13px] font-semibold text-on-dark">
                          {m.userB?.handle ?? "—"}
                        </div>
                        {m.byeWinner && (
                          <div className="mt-2 font-sans text-xs text-status-open">
                            BYE — {m.byeWinner.handle} advances
                          </div>
                        )}
                        {!m.userA && !m.userB && !m.byeWinner && (
                          <div className="mt-2 font-sans text-xs text-faint">Vacant slot</div>
                        )}
                        {m.battle && (
                          <Link
                            href={`/admin/battles/${m.battle.id}`}
                            className="mt-2 block font-sans text-xs font-semibold text-signal"
                          >
                            {m.battle.status} — Manage battle →
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {canStart && <StartRoundForm roundId={round.id} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
