import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { AudioPlayerBar } from "@/components/audio";
import { CommentsSection } from "@/components/comments/CommentsSection";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const track = await prisma.track.findUnique({ where: { id } });
  return { title: track ? `${track.title} — AUXDROP` : "Beat — AUXDROP" };
}

// Simplified vs. the "Beat Detail" mockup, which is actually Shop/commerce
// content (license pricing, add-to-cart) — that's Phase 2/step 7, still
// blocked. This covers what step 4 needs: play the beat, see who made it
// and which battle it came from.
export default async function BeatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const track = await prisma.track.findUnique({
    where: { id },
    include: {
      creator: { select: { handle: true } },
      submission: { include: { battle: { select: { id: true, title: true } } } },
    },
  });
  if (!track) notFound();

  const peaks = Array.isArray(track.waveformPeaks)
    ? (track.waveformPeaks as number[])
    : undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader navItems={[{ label: "Beatmakers", href: "/beatmakers" }]} />

        <div className="flex-1 px-8 py-16 sm:px-16">
          <div className="mx-auto flex max-w-xl flex-col gap-6">
            <div>
              <h1 className="font-display text-3xl font-extrabold text-on-dark">
                {track.title}
              </h1>
              <div className="mt-2 font-sans text-sm text-muted">
                by{" "}
                <Link
                  href={`/beatmakers/${track.creator.handle}`}
                  className="font-semibold text-on-dark hover:text-signal"
                >
                  {track.creator.handle}
                </Link>
                {track.submission?.battle && (
                  <>
                    {" "}
                    · submitted to{" "}
                    <Link
                      href={`/battles/${track.submission.battle.id}`}
                      className="font-semibold text-on-dark hover:text-signal"
                    >
                      {track.submission.battle.title}
                    </Link>
                  </>
                )}
              </div>
            </div>
            <AudioPlayerBar src={track.audioUrl} peaks={peaks} title={track.title} />
          </div>
        </div>

        <div className="border-t border-border">
          <CommentsSection
            target={{ trackId: track.id }}
            subtitle={track.title}
            isAuthenticated={Boolean(user)}
          />
        </div>

        <div className="border-t border-border px-8 py-7 font-sans text-xs text-faint sm:px-16">
          © 2026 AUXDROP
        </div>
      </div>
    </div>
  );
}
