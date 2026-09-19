import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CreateSponsorshipForm } from "./CreateSponsorshipForm";
import { AssignBattleForm } from "./AssignBattleForm";
import { UnassignBattleButton } from "./UnassignBattleButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const sponsor = await prisma.sponsorProfile.findUnique({ where: { id } });
  return { title: sponsor ? `${sponsor.companyName} — Admin — AUXDROP` : "Admin — AUXDROP" };
}

export default async function AdminSponsorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sponsor = await prisma.sponsorProfile.findUnique({
    where: { id },
    include: {
      user: { select: { handle: true, email: true } },
      sponsorships: {
        orderBy: { createdAt: "desc" },
        include: { battles: { select: { id: true, title: true, status: true } } },
      },
    },
  });
  if (!sponsor) notFound();

  const unsponsoredBattles = await prisma.battle.findMany({
    where: { sponsorshipId: null },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/sponsors/{sponsor.id}
      </div>
      <div className="flex flex-col gap-10 p-12">
        <div>
          <h1 className="mb-1 font-display text-3xl font-extrabold text-on-dark">
            {sponsor.companyName}
          </h1>
          <div className="font-sans text-sm text-faint">
            @{sponsor.user.handle} · {sponsor.contactName ? `${sponsor.contactName} · ` : ""}
            {sponsor.contactEmail ?? sponsor.user.email}
          </div>
        </div>

        <div>
          <div className="mb-4 font-sans text-xs font-bold tracking-[0.08em] text-faint">
            SPONSORSHIPS
          </div>
          <CreateSponsorshipForm sponsorId={sponsor.id} />

          {sponsor.sponsorships.length === 0 ? (
            <p className="font-sans text-[13px] text-faint">No sponsorships yet.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {sponsor.sponsorships.map((s) => (
                <div key={s.id} className="rounded-card border border-border bg-elevated p-6">
                  <div className="mb-3 flex flex-wrap items-baseline gap-3">
                    <div className="font-sans text-sm font-bold text-on-dark">
                      {s.packageName || "Untitled sponsorship"}
                    </div>
                    {s.amountContributed != null && (
                      <div className="font-sans text-xs text-faint">
                        ${Number(s.amountContributed).toLocaleString()}
                      </div>
                    )}
                    {(s.startDate || s.endDate) && (
                      <div className="font-sans text-xs text-faint">
                        {s.startDate?.toLocaleDateString() ?? "—"} –{" "}
                        {s.endDate?.toLocaleDateString() ?? "—"}
                      </div>
                    )}
                  </div>
                  {s.productNotes && (
                    <p className="mb-4 font-sans text-[13px] text-muted">{s.productNotes}</p>
                  )}

                  <div className="mb-3 font-sans text-[11px] font-bold tracking-[0.08em] text-faint">
                    SPONSORED BATTLES
                  </div>
                  <div className="mb-4 flex flex-col gap-2">
                    {s.battles.length === 0 ? (
                      <p className="font-sans text-xs text-faint">No battles assigned yet.</p>
                    ) : (
                      s.battles.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between rounded-input border border-border bg-primary px-4 py-2.5"
                        >
                          <span className="font-sans text-[13px] font-semibold text-on-dark">
                            {b.title}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-sans text-xs text-faint">{b.status}</span>
                            <UnassignBattleButton sponsorId={sponsor.id} battleId={b.id} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <AssignBattleForm sponsorshipId={s.id} availableBattles={unsponsoredBattles} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
