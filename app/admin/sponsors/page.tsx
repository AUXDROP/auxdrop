import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreateSponsorForm } from "./CreateSponsorForm";

export const metadata: Metadata = { title: "Sponsor Management — AUXDROP" };

export default async function SponsorManagementPage() {
  const sponsors = await prisma.sponsorProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { handle: true } }, _count: { select: { sponsorships: true } } },
  });

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/sponsors
      </div>
      <div className="p-12">
        <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
          Sponsor Management
        </h1>

        <CreateSponsorForm />

        <div className="mt-8 overflow-x-auto rounded-card border border-border">
          <div className="grid min-w-[600px] grid-cols-[1fr_1fr_120px_100px] gap-4 bg-elevated px-5 py-3.5 font-sans text-[11px] font-bold tracking-[0.08em] text-faint">
            <div>COMPANY</div>
            <div>CONTACT</div>
            <div>SPONSORSHIPS</div>
            <div>ACTIONS</div>
          </div>
          {sponsors.map((s) => (
            <div
              key={s.id}
              className="grid min-w-[600px] grid-cols-[1fr_1fr_120px_100px] items-center gap-4 border-t border-border px-5 py-4"
            >
              <div>
                <div className="font-sans text-[13px] font-semibold text-on-dark">
                  {s.companyName}
                </div>
                <div className="font-sans text-xs text-faint">@{s.user.handle}</div>
              </div>
              <div className="font-sans text-[13px] text-muted">
                {s.contactName ? `${s.contactName} · ` : ""}
                {s.contactEmail}
              </div>
              <div className="font-sans text-[13px] text-muted">{s._count.sponsorships}</div>
              <Link
                href={`/admin/sponsors/${s.id}`}
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
