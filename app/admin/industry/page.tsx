import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CreateIndustryForm } from "./CreateIndustryForm";

export const metadata: Metadata = { title: "Industry Management — AUXDROP" };

export default async function IndustryManagementPage() {
  const contacts = await prisma.industryProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { handle: true } } },
  });

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/industry
      </div>
      <div className="p-12">
        <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
          Industry Management
        </h1>

        <CreateIndustryForm />

        <div className="mt-8 overflow-x-auto rounded-card border border-border">
          <div className="grid min-w-[600px] grid-cols-[1fr_1fr_140px] gap-4 bg-elevated px-5 py-3.5 font-sans text-[11px] font-bold tracking-[0.08em] text-faint">
            <div>COMPANY</div>
            <div>CONTACT</div>
            <div>TYPE</div>
          </div>
          {contacts.map((c) => (
            <div
              key={c.id}
              className="grid min-w-[600px] grid-cols-[1fr_1fr_140px] items-center gap-4 border-t border-border px-5 py-4"
            >
              <div>
                <div className="font-sans text-[13px] font-semibold text-on-dark">
                  {c.companyName}
                </div>
                <div className="font-sans text-xs text-faint">@{c.user.handle}</div>
              </div>
              <div className="font-sans text-[13px] text-muted">
                {c.contactName ? `${c.contactName} · ` : ""}
                {c.contactEmail}
              </div>
              <div className="font-sans text-[13px] text-muted">{c.contactType || "—"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
