import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreateReleaseForm } from "./CreateReleaseForm";
import { ReleaseStatusSelect } from "./ReleaseStatusSelect";

export const metadata: Metadata = { title: "Release Management — AUXDROP" };

export default async function ReleaseManagementPage() {
  const releases = await prisma.release.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tracks: true } } },
  });

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/releases
      </div>
      <div className="p-12">
        <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
          Release Management
        </h1>

        <CreateReleaseForm />

        <div className="mt-8 overflow-x-auto rounded-card border border-border">
          <div className="grid min-w-[600px] grid-cols-[1fr_140px_100px_100px] gap-4 bg-elevated px-5 py-3.5 font-sans text-[11px] font-bold tracking-[0.08em] text-faint">
            <div>NAME</div>
            <div>STATUS</div>
            <div>TRACKS</div>
            <div>ACTIONS</div>
          </div>
          {releases.map((r) => (
            <div
              key={r.id}
              className="grid min-w-[600px] grid-cols-[1fr_140px_100px_100px] items-center gap-4 border-t border-border px-5 py-4"
            >
              <div className="font-sans text-[13px] font-semibold text-on-dark">
                {r.title}
                {r.season && (
                  <span className="ml-2 font-sans text-xs font-normal text-faint">
                    {r.season}
                  </span>
                )}
              </div>
              <ReleaseStatusSelect releaseId={r.id} status={r.status} />
              <div className="font-sans text-[13px] text-muted">{r._count.tracks}</div>
              <Link
                href={`/admin/releases/${r.id}`}
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
