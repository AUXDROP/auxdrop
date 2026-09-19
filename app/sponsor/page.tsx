import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/layout/Wordmark";
import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/app/auth/actions";
import { UserRole } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Sponsor Portal — AUXDROP" };

// Minimal and read-only, per docs/04-data-model.md's Sponsor Portal note —
// the mockup (design/mockups/pages/Sponsor Portal.dc.html) is actually a
// logged-out pitch page (see /sponsors), not a dashboard, so this view has
// no mockup to match. Shows exactly what's real: sponsorships and the
// battles they cover. No performance metrics — no view/play tracking
// exists anywhere in the app yet (same limitation noted on /analytics).
export default async function SponsorPortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) redirect("/login");
  if (dbUser.role !== UserRole.SPONSOR) redirect("/dashboard");

  const sponsorProfile = await prisma.sponsorProfile.findUnique({
    where: { userId: user.id },
    include: {
      sponsorships: {
        orderBy: { createdAt: "desc" },
        include: {
          battles: { select: { id: true, title: true, status: true, startsAt: true } },
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <header className="flex items-center justify-between border-b border-border px-8 py-5 sm:px-16">
          <Wordmark size="small" href="/sponsor" />
          <form action={signOut}>
            <button
              type="submit"
              className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
            >
              Sign out
            </button>
          </form>
        </header>

        <div className="flex-1 px-8 py-14 sm:px-16">
          <h1 className="mb-1 font-display text-3xl font-extrabold text-on-dark">
            {sponsorProfile?.companyName ?? "Sponsor Portal"}
          </h1>
          <div className="mb-10 font-sans text-sm text-faint">
            Your AUXDROP sponsorships and the battles they cover.
          </div>

          {!sponsorProfile || sponsorProfile.sponsorships.length === 0 ? (
            <Card className="p-10 text-center">
              <div className="font-sans text-[13px] text-faint">
                No sponsorships on file yet.
              </div>
            </Card>
          ) : (
            <div className="flex flex-col gap-6">
              {sponsorProfile.sponsorships.map((s) => (
                <Card key={s.id} className="p-6">
                  <div className="mb-3 flex flex-wrap items-baseline gap-3">
                    <div className="font-display text-lg font-bold text-on-dark">
                      {s.packageName || "Sponsorship"}
                    </div>
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

                  <div className="mb-2 font-sans text-[11px] font-bold tracking-[0.08em] text-faint">
                    SPONSORED BATTLES
                  </div>
                  {s.battles.length === 0 ? (
                    <p className="font-sans text-xs text-faint">No battles assigned yet.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {s.battles.map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between rounded-input border border-border bg-elevated px-4 py-2.5"
                        >
                          <span className="font-sans text-[13px] font-semibold text-on-dark">
                            {b.title}
                          </span>
                          <span className="font-sans text-xs text-faint">{b.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
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
