import type { Metadata } from "next";
import Link from "next/link";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { Card, CardBody, CardTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { GENRES } from "@/lib/genres";

export const metadata: Metadata = {
  title: "Discover Beatmakers — AUXDROP",
  description: "Browse Beatmaker profiles on AUXDROP.",
};

// Without this, Next statically prerenders the profile list at build time
// (no auth/cookies here to make it dynamic automatically), freezing it until
// the next deploy instead of reflecting newly-created profiles.
export const dynamic = "force-dynamic";

export default async function BeatmakersPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre } = await searchParams;

  const profiles = await prisma.beatmakerProfile.findMany({
    where: genre ? { genres: { has: genre } } : undefined,
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

          <div className="mb-8 flex flex-wrap gap-2">
            <Link
              href="/beatmakers"
              className={
                "rounded-pill border px-3.5 py-2 font-sans text-xs font-semibold " +
                (!genre
                  ? "border-signal bg-signal/[0.14] text-on-dark"
                  : "border-border text-faint hover:text-muted")
              }
            >
              All
            </Link>
            {GENRES.map((g) => (
              <Link
                key={g}
                href={`/beatmakers?genre=${encodeURIComponent(g)}`}
                className={
                  "rounded-pill border px-3.5 py-2 font-sans text-xs font-semibold " +
                  (genre === g
                    ? "border-signal bg-signal/[0.14] text-on-dark"
                    : "border-border text-faint hover:text-muted")
                }
              >
                {g}
              </Link>
            ))}
          </div>

          {profiles.length === 0 ? (
            <Card className="flex flex-col items-start gap-4 p-14">
              <div className="max-w-xl font-display text-xl font-bold text-on-dark">
                {genre
                  ? `No Beatmakers in ${genre} yet.`
                  : "Beatmaker profiles are just getting started."}
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
                    <div className="flex items-center gap-2">
                      <CardTitle className="mb-0">{p.user.handle}</CardTitle>
                      {p.isVerified && (
                        <span className="rounded-pill bg-accent/12 px-2 py-0.5 text-[10px] font-bold text-accent">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    {p.location && (
                      <div className="mt-1 font-sans text-xs text-faint">{p.location}</div>
                    )}
                    <CardBody className="line-clamp-2">
                      {p.bio || "No bio yet."}
                    </CardBody>
                    {p.genres.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.genres.map((g) => (
                          <span
                            key={g}
                            className="rounded-pill border border-border px-2 py-1 font-sans text-[10px] font-semibold text-muted"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
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
