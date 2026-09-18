import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowseHeader } from "@/components/layout/BrowseHeader";
import { getBeatmakerRecord, getGlobalRankings } from "@/lib/battles";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  return { title: `${handle} — AUXDROP` };
}

export default async function BeatmakerProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const user = await prisma.user.findUnique({
    where: { handle },
    include: { beatmakerProfile: true },
  });
  if (!user || !user.beatmakerProfile) notFound();

  const [record, rankings] = await Promise.all([
    getBeatmakerRecord(user.id),
    getGlobalRankings(),
  ]);
  const rank = rankings.findIndex((r) => r.userId === user.id);

  const stats = [
    { label: "Global rank", value: rank >= 0 ? `#${rank + 1}` : "Unranked" },
    { label: "Record", value: `${record.wins}–${record.losses}` },
    { label: "Win rate", value: `${record.winRate}%` },
    { label: "Beat Battles", value: String(record.battles) },
  ];

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <BrowseHeader navItems={[{ label: "Beatmakers", href: "/beatmakers" }]} />

        <div className="flex-1 px-8 py-16 sm:px-16">
          <div className="flex items-end gap-9 border-b border-border pb-10">
            <div
              className="h-[120px] w-[120px] flex-shrink-0 rounded-2xl"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #1f1f23, #1f1f23 8px, #18181B 8px, #18181B 16px)",
              }}
            />
            <div>
              <h1 className="font-display text-4xl font-extrabold text-on-dark">
                {user.handle}
              </h1>
              {user.beatmakerProfile.bio && (
                <p className="mt-2 max-w-lg font-sans text-sm text-muted">
                  {user.beatmakerProfile.bio}
                </p>
              )}
            </div>
          </div>

          <div className="my-10 grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-primary p-6 text-center">
                <div className="font-display text-2xl font-extrabold text-on-dark">
                  {s.value}
                </div>
                <div className="mt-1.5 font-sans text-[11px] text-faint">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border px-8 py-7 font-sans text-xs text-faint sm:px-16">
          © 2026 AUXDROP
        </div>
      </div>
    </div>
  );
}
