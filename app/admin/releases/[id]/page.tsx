import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReleaseDetailsForm } from "./ReleaseDetailsForm";
import { TrackRow } from "./TrackRow";
import { AddTrackForm } from "./AddTrackForm";
import { RoyaltySplitRow } from "./RoyaltySplitRow";
import { AddRoyaltySplitForm } from "./AddRoyaltySplitForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const release = await prisma.release.findUnique({ where: { id } });
  return { title: release ? `${release.title} — Admin — AUXDROP` : "Admin — AUXDROP" };
}

export default async function AdminReleaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const release = await prisma.release.findUnique({
    where: { id },
    include: {
      tracks: {
        include: { track: { include: { creator: { select: { handle: true } } } } },
        orderBy: { position: "asc" },
      },
      royaltySplits: { include: { user: { select: { handle: true } } }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!release) notFound();

  const existingTrackIds = release.tracks.map((rt) => rt.trackId);
  const availableTracks = await prisma.track.findMany({
    where: { id: { notIn: existingTrackIds } },
    include: { creator: { select: { handle: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const totalPercentage = release.royaltySplits.reduce(
    (sum, s) => sum + Number(s.percentage),
    0,
  );

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/releases/{release.id}
      </div>
      <div className="flex flex-col gap-10 p-12">
        <div>
          <h1 className="mb-1 font-display text-3xl font-extrabold text-on-dark">
            {release.title}
          </h1>
          <div className="mb-6 font-sans text-sm text-faint">
            {release.status}
            {release.season ? ` · ${release.season}` : ""}
          </div>
          <ReleaseDetailsForm
            releaseId={release.id}
            releaseDate={release.releaseDate ? release.releaseDate.toISOString().slice(0, 10) : ""}
            spotifyUrl={release.spotifyUrl ?? ""}
            appleMusicUrl={release.appleMusicUrl ?? ""}
            tidalUrl={release.tidalUrl ?? ""}
          />
        </div>

        <div>
          <div className="mb-4 font-sans text-xs font-bold tracking-[0.08em] text-faint">
            TRACKLIST
          </div>
          <div className="mb-4 flex flex-col gap-2">
            {release.tracks.length === 0 ? (
              <p className="font-sans text-[13px] text-faint">No tracks yet.</p>
            ) : (
              release.tracks.map((rt, i) => (
                <TrackRow
                  key={rt.id}
                  releaseId={release.id}
                  releaseTrackId={rt.id}
                  title={rt.track.title}
                  handle={rt.track.creator.handle}
                  isFirst={i === 0}
                  isLast={i === release.tracks.length - 1}
                />
              ))
            )}
          </div>
          <AddTrackForm
            releaseId={release.id}
            availableTracks={availableTracks.map((t) => ({
              id: t.id,
              title: t.title,
              handle: t.creator.handle,
            }))}
          />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="font-sans text-xs font-bold tracking-[0.08em] text-faint">
              ROYALTY SPLITS
            </div>
            <div
              className={
                "font-sans text-xs font-bold " +
                (totalPercentage === 100 ? "text-status-open" : "text-status-error")
              }
            >
              {totalPercentage}% allocated
            </div>
          </div>
          <div className="mb-4 flex flex-col gap-2">
            {release.royaltySplits.length === 0 ? (
              <p className="font-sans text-[13px] text-faint">No splits configured yet.</p>
            ) : (
              release.royaltySplits.map((s) => (
                <RoyaltySplitRow
                  key={s.id}
                  releaseId={release.id}
                  splitId={s.id}
                  beneficiary={s.user ? s.user.handle : "Platform"}
                  percentage={String(s.percentage)}
                />
              ))
            )}
          </div>
          <AddRoyaltySplitForm releaseId={release.id} />
        </div>
      </div>
    </div>
  );
}
