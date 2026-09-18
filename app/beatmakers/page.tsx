import type { Metadata } from "next";
import Link from "next/link";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { Card, CardBody, CardTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Discover Beatmakers — AUXDROP",
  description: "Browse Beatmaker profiles on AUXDROP.",
};

export default async function BeatmakersPage() {
  const profiles = await prisma.beatmakerProfile.findMany({
    include: { user: { select: { handle: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader
          navItems={[{ label: "Beatmakers", href: "/beatmakers" }]}
          active="Beatmakers"
        />

        <div className="flex-1 px-8 py-16 sm:px-16">
          <h1 className="mb-6 font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
            Discover Beatmakers
          </h1>

          {profiles.length === 0 ? (
            <Card className="flex flex-col items-start gap-4 p-14">
              <div className="max-w-xl font-display text-xl font-bold text-on-dark">
                Beatmaker profiles are just getting started.
              </div>
              <CardBody className="mt-0 max-w-xl text-sm leading-relaxed">
                Build your profile now to be one of the first Beatmakers
                people find here.
              </CardBody>
              <Link
                href="/signup"
                className="rounded-button bg-signal px-6 py-3.5 font-sans text-sm font-bold text-on-dark"
              >
                Build your profile
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((p) => (
                <Link key={p.id} href={`/beatmakers/${p.user.handle}`}>
                  <Card className="h-full hover:border-accent">
                    <CardTitle>{p.user.handle}</CardTitle>
                    <CardBody className="line-clamp-2">
                      {p.bio || "No bio yet."}
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border px-8 py-7 font-sans text-xs text-faint sm:px-16">
          © 2026 AUXDROP
        </div>
      </div>
    </div>
  );
}
