import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { BattleStatusBadge } from "@/components/battles/BattleStatusBadge";
import { Countdown } from "@/components/battles/Countdown";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { UserRole, BattleStatus } from "@/generated/prisma/client";
import { SubmissionForm } from "./SubmissionForm";
import { DisputeForm } from "./DisputeForm";

// Evergreen marketing copy, not per-battle data.
const OUTCOMES = [
  "Cash prize",
  "Chart points",
  "Championship spot",
  "Shop feature",
  "Release pick",
  "Sound Kit pick",
  "License review",
  "Featured on Auxdrop TV",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const battle = await prisma.battle.findUnique({ where: { id } });
  return { title: battle ? `${battle.title} — AUXDROP` : "Battle — AUXDROP" };
}

export default async function BattleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const battle = await prisma.battle.findUnique({
    where: { id },
    include: { _count: { select: { submissions: true } } },
  });
  if (!battle) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dbUser = user ? await prisma.user.findUnique({ where: { id: user.id } }) : null;
  const mySubmission = user
    ? await prisma.submission.findUnique({
        where: { battleId_userId: { battleId: battle.id, userId: user.id } },
      })
    : null;

  const isOpen = battle.status === BattleStatus.OPEN && battle.submissionDeadline > new Date();

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader navItems={[{ label: "Beat Battles", href: "/battles" }]} />

        <div className="flex-1 px-8 py-11 sm:px-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            <div className="flex flex-col gap-8">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <h1 className="font-display text-3xl font-extrabold text-on-dark sm:text-4xl">
                    {battle.title}
                  </h1>
                  <BattleStatusBadge status={battle.status} />
                </div>
                <div className="flex gap-4 font-sans text-sm font-semibold text-muted">
                  <span>{battle.genre ?? "All genres"}</span>
                  <span className="text-border">|</span>
                  <span>{battle.durationMinutes} minutes</span>
                  <span className="text-border">|</span>
                  <span>{battle._count.submissions} entered</span>
                </div>
              </div>

              <div>
                <div className="mb-3.5 font-sans text-xs font-bold tracking-[0.1em] text-faint">
                  WHAT YOU&apos;RE COMPETING FOR
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {OUTCOMES.map((o) => (
                    <div
                      key={o}
                      className="flex items-center gap-2.5 rounded-input border border-border bg-elevated px-3.5 py-3"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <span className="font-sans text-[13px] font-semibold text-on-dark">
                        {o}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {user && (
                <div>
                  <DisputeForm battleId={battle.id} />
                </div>
              )}
            </div>

            <Card className="flex h-fit flex-col gap-5 p-7">
              <div className="text-center">
                <div className="font-sans text-xs text-faint">
                  {isOpen ? "Submission deadline" : "Status"}
                </div>
                {isOpen ? (
                  <div className="mt-1.5 font-display text-4xl font-extrabold text-on-dark">
                    <Countdown target={battle.submissionDeadline.toISOString()} />
                  </div>
                ) : (
                  <div className="mt-1.5 font-display text-2xl font-extrabold text-on-dark">
                    {battle.status === BattleStatus.COMPLETED
                      ? "Battle completed"
                      : battle.status === BattleStatus.UPCOMING
                        ? "Not open yet"
                        : "Judging in progress"}
                  </div>
                )}
              </div>

              {!user ? (
                <Link
                  href="/signup"
                  className="rounded-button bg-signal px-6 py-4 text-center font-sans text-sm font-bold text-on-dark"
                >
                  Join early access
                </Link>
              ) : dbUser?.role !== UserRole.BEATMAKER ? (
                <p className="text-center font-sans text-[13px] text-faint">
                  Only Beatmaker accounts can submit to battles.
                </p>
              ) : mySubmission ? (
                <p className="text-center font-sans text-[13px] text-status-open">
                  You&apos;re entered — check back after judging for results.
                </p>
              ) : isOpen ? (
                <SubmissionForm battleId={battle.id} />
              ) : (
                <p className="text-center font-sans text-[13px] text-faint">
                  This battle isn&apos;t accepting submissions right now.
                </p>
              )}
            </Card>
          </div>
        </div>

        <div className="border-t border-border px-8 py-7 font-sans text-xs text-faint sm:px-16">
          © 2026 AUXDROP
        </div>
      </div>
    </div>
  );
}
