import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { AdminToggle } from "./AdminToggle";
import { VerifiedToggle } from "./VerifiedToggle";

export const metadata: Metadata = { title: "User Management — AUXDROP" };

export default async function UserManagementPage() {
  const me = await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { beatmakerProfile: true },
  });

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/users
      </div>
      <div className="p-12">
        <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
          User Management
        </h1>

        <div className="overflow-x-auto rounded-card border border-border">
          <div className="grid min-w-[700px] grid-cols-[1fr_120px_140px_160px] gap-4 bg-elevated px-5 py-3.5 font-sans text-[11px] font-bold tracking-[0.08em] text-faint">
            <div>USER</div>
            <div>ROLE</div>
            <div>JOINED</div>
            <div>ACTIONS</div>
          </div>
          {users.map((u) => (
            <div
              key={u.id}
              className="grid min-w-[700px] grid-cols-[1fr_120px_140px_160px] items-center gap-4 border-t border-border px-5 py-4"
            >
              <div>
                <div className="font-sans text-[13px] font-semibold text-on-dark">
                  {u.handle}
                </div>
                <div className="font-sans text-xs text-faint">{u.email}</div>
              </div>
              <div className="font-sans text-[13px] text-muted">
                {u.role}
                {u.isAdmin && (
                  <span className="ml-2 rounded-pill bg-accent/12 px-2 py-0.5 text-[10px] font-bold text-accent">
                    ADMIN
                  </span>
                )}
                {u.beatmakerProfile?.isVerified && (
                  <span className="ml-2 rounded-pill bg-accent/12 px-2 py-0.5 text-[10px] font-bold text-accent">
                    VERIFIED
                  </span>
                )}
              </div>
              <div className="font-sans text-[13px] text-muted">
                {u.createdAt.toLocaleDateString()}
              </div>
              <div className="flex flex-col items-start gap-1.5">
                <AdminToggle userId={u.id} isAdmin={u.isAdmin} isSelf={u.id === me.id} />
                {u.beatmakerProfile && (
                  <VerifiedToggle
                    userId={u.id}
                    isVerified={u.beatmakerProfile.isVerified}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
