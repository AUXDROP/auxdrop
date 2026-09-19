import type { Metadata } from "next";
import Link from "next/link";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { Card, CardBody } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { ReleaseStatus } from "@/generated/prisma/enums";

export const metadata: Metadata = {
  title: "Releases — AUXDROP",
  description: "Official AUXDROP compilation releases from Beat Battle standouts.",
};

// Without this, Next statically prerenders the release list at build time —
// same bug class as /beatmakers and /rankings.
export const dynamic = "force-dynamic";

export default async function ReleasesPage() {
  const releases = await prisma.release.findMany({
    where: { status: ReleaseStatus.LIVE },
    include: {
      tracks: {
        include: { track: { include: { creator: { select: { handle: true } } } } },
        orderBy: { position: "asc" },
      },
    },
    orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader
          navItems={[
            { label: "Shop" },
            { label: "Releases", href: "/releases" },
            { label: "Sound Kits" },
          ]}
          active="Releases"
        />

        {releases.length === 0 ? (
          <div className="grid flex-1 grid-cols-1 gap-14 p-16 lg:grid-cols-[380px_1fr]">
            <div className="aspect-square w-full rounded-2xl bg-elevated" />
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-2.5 font-sans text-xs font-bold tracking-[0.1em] text-accent">
                  FIRST OFFICIAL RELEASE
                </div>
                <h1 className="mb-2 font-display text-4xl font-extrabold text-on-dark">
                  AUXDROP Releases
                </h1>
                <p className="max-w-md font-sans text-sm leading-relaxed text-muted">
                  Standout beats from Beat Battles get picked for official
                  compilation releases, with streaming links and credit for
                  every Beatmaker involved.
                </p>
              </div>
              <div>
                <div className="mb-3.5 font-sans text-xs font-bold tracking-[0.1em] text-faint">
                  TRACKLIST
                </div>
                <Card className="p-8 text-center">
                  <CardBody className="mt-0">
                    No releases yet. The first compilation drops after the
                    first Beat Battle.
                  </CardBody>
                </Card>
              </div>
              <Link
                href="/signup"
                className="self-start rounded-button bg-signal px-6 py-3.5 font-sans text-sm font-bold text-on-dark"
              >
                Join early access
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex-1 px-8 py-16 sm:px-16">
            <h1 className="mb-10 font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
              AUXDROP Releases
            </h1>
            <div className="flex flex-col gap-8">
              {releases.map((r, i) => (
                <div
                  key={r.id}
                  className="grid grid-cols-1 gap-8 border-b border-border pb-8 last:border-0 lg:grid-cols-[220px_1fr]"
                >
                  <div className="aspect-square w-full rounded-2xl bg-elevated" />
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="mb-1.5 font-sans text-xs font-bold tracking-[0.1em] text-accent">
                        {i === 0 ? "LATEST RELEASE" : "RELEASE"}
                      </div>
                      <h2 className="font-display text-2xl font-extrabold text-on-dark">
                        {r.title}
                      </h2>
                      {r.season && (
                        <div className="mt-1 font-sans text-xs text-faint">{r.season}</div>
                      )}
                    </div>
                    {(r.spotifyUrl || r.appleMusicUrl || r.tidalUrl) && (
                      <div className="flex flex-wrap gap-3">
                        {r.spotifyUrl && (
                          <a
                            href={r.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-pill border border-border px-3.5 py-2 font-sans text-xs font-semibold text-muted hover:text-on-dark"
                          >
                            Spotify
                          </a>
                        )}
                        {r.appleMusicUrl && (
                          <a
                            href={r.appleMusicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-pill border border-border px-3.5 py-2 font-sans text-xs font-semibold text-muted hover:text-on-dark"
                          >
                            Apple Music
                          </a>
                        )}
                        {r.tidalUrl && (
                          <a
                            href={r.tidalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-pill border border-border px-3.5 py-2 font-sans text-xs font-semibold text-muted hover:text-on-dark"
                          >
                            Tidal
                          </a>
                        )}
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      {r.tracks.map((rt) => (
                        <Link
                          key={rt.id}
                          href={`/beats/${rt.track.id}`}
                          className="flex items-center justify-between rounded-input border border-border bg-elevated px-4 py-2.5 hover:border-accent"
                        >
                          <span className="font-sans text-[13px] font-semibold text-on-dark">
                            {rt.track.title}
                          </span>
                          <span className="font-sans text-xs text-faint">
                            {rt.track.creator.handle}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border px-8 py-7 font-sans text-xs text-faint sm:px-16">
          © 2026 AUXDROP
        </div>
      </div>
    </div>
  );
}
