import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardBody, CardTitle } from "@/components/ui";
import { BattleStatusBadge } from "@/components/battles/BattleStatusBadge";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Dashboard — AUXDROP" };

const JOURNEY = [
  "Enter a Battle",
  "Upload your beat",
  "Get judged",
  "See results",
  "Sell in your Shop",
  "Sell licenses",
  "Release music",
  "Get paid",
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { beatmakerProfile: true },
  });
  if (!dbUser) redirect("/login");

  const isBeatmaker = dbUser.role === UserRole.BEATMAKER;
  const profileIncomplete = isBeatmaker && !dbUser.beatmakerProfile?.bio;

  const submissions = isBeatmaker
    ? await prisma.submission.findMany({
        where: { userId: user.id },
        include: { battle: true },
        orderBy: { submittedAt: "desc" },
        take: 5,
      })
    : [];

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <AppHeader isAdmin={dbUser.isAdmin} />

        <div className="px-8 pt-14 sm:px-16">
          <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
            Welcome to AUXDROP, {dbUser.handle}
          </h1>

          {profileIncomplete && (
            <Card className="mb-10 flex flex-wrap items-center justify-between gap-6 p-8">
              <div>
                <div className="font-display text-lg font-bold text-on-dark">
                  Complete your profile
                </div>
                <div className="mt-1.5 font-sans text-[13px] text-faint">
                  Add a bio so other Beatmakers can find you.
                </div>
              </div>
              <Link
                href="/onboarding"
                className="whitespace-nowrap rounded-button bg-signal px-5 py-3 font-sans text-[13px] font-bold text-on-dark"
              >
                Complete profile
              </Link>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 gap-10 px-8 pb-14 sm:px-16 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="font-sans text-xs font-bold tracking-[0.1em] text-faint">
                  {isBeatmaker ? "ACTIVE BATTLES" : "BATTLES"}
                </div>
                <Link
                  href="/battles"
                  className="font-sans text-[13px] font-semibold text-muted hover:text-on-dark"
                >
                  View all →
                </Link>
              </div>
              {submissions.length === 0 ? (
                <Card>
                  <CardTitle>Start your first Beat Battle</CardTitle>
                  <CardBody>No Battles yet. Enter one when they open.</CardBody>
                </Card>
              ) : (
                <div className="flex flex-col gap-3">
                  {submissions.map((s) => (
                    <Link key={s.id} href={`/battles/${s.battle.id}`}>
                      <Card className="flex flex-row items-center justify-between hover:border-accent">
                        <CardTitle className="mb-0">{s.battle.title}</CardTitle>
                        <BattleStatusBadge status={s.battle.status} />
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 font-sans text-xs font-bold tracking-[0.1em] text-faint">
                GET STARTED
              </div>
              <div className="flex flex-col gap-px overflow-hidden rounded-input bg-border">
                <Link
                  href="/battles"
                  className="bg-elevated px-4 py-3.5 font-sans text-[13px] font-semibold text-on-dark hover:bg-primary"
                >
                  Upload your first beat
                </Link>
                <span className="bg-elevated px-4 py-3.5 font-sans text-[13px] font-semibold text-faint">
                  Create your Shop
                </span>
                <span className="bg-elevated px-4 py-3.5 font-sans text-[13px] font-semibold text-faint">
                  Connect your payout account
                </span>
              </div>
            </div>

            <div>
              <div className="mb-4 font-sans text-xs font-bold tracking-[0.1em] text-faint">
                WHAT&apos;S NEXT
              </div>
              <div className="flex items-center overflow-x-auto pb-2">
                {JOURNEY.map((step, i) => (
                  <div key={step} className="flex flex-shrink-0 items-center">
                    <div
                      className={
                        "flex items-center gap-1.5 whitespace-nowrap rounded-pill border px-3.5 py-2 " +
                        (i === 0
                          ? "border-signal bg-signal/[0.14]"
                          : "border-border bg-transparent")
                      }
                    >
                      <span
                        className={
                          "h-1.5 w-1.5 rounded-full " +
                          (i === 0 ? "bg-signal" : "bg-border")
                        }
                      />
                      <span
                        className={
                          "font-sans text-[11px] font-bold " +
                          (i === 0 ? "text-on-dark" : "text-faint")
                        }
                      >
                        {step}
                      </span>
                    </div>
                    {i < JOURNEY.length - 1 && (
                      <span className="mx-1.5 text-xs text-border">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Card className="flex flex-col gap-1.5">
              <span className="font-sans text-xs text-faint">Wallet balance</span>
              <span className="font-display text-xl font-extrabold text-on-dark">
                $0.00
              </span>
            </Card>
            <Card className="flex flex-col gap-1.5">
              <span className="font-sans text-xs text-faint">Shop</span>
              <span className="font-display text-sm font-bold text-on-dark">
                Create your Shop
              </span>
            </Card>
            <Card className="flex flex-col gap-1.5">
              <span className="font-sans text-xs text-faint">Licenses</span>
              <span className="font-display text-sm font-bold text-on-dark">
                No licenses yet
              </span>
            </Card>
            <Card className="flex flex-col gap-1.5">
              <span className="font-sans text-xs text-faint">Analytics</span>
              <span className="font-display text-sm font-bold text-on-dark">
                Not tracked yet
              </span>
            </Card>
          </div>
        </div>

        <div className="mt-auto border-t border-border px-8 py-7 font-sans text-xs text-faint sm:px-16">
          © 2026 AUXDROP
        </div>
      </div>
    </div>
  );
}
