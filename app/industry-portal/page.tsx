import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Wordmark } from "@/components/layout/Wordmark";
import { Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { signOut } from "@/app/auth/actions";
import { UserRole } from "@/generated/prisma/client";

export const metadata: Metadata = { title: "Industry Portal — AUXDROP" };

// Minimal, per the approved proposal — the mockup (design/mockups/pages/
// Industry Portal.dc.html) turned out to be a logged-out pitch page (now
// /industry), not a dashboard, so there's no mockup to match here. The
// real differentiator (a sync/licensing catalog) needs Track licensing
// fields + a License model, both deferred to step 7/commerce — this links
// to the real, already-public /beatmakers directory instead of faking one.
export default async function IndustryPortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) redirect("/login");
  if (dbUser.role !== UserRole.INDUSTRY) redirect("/dashboard");

  const industryProfile = await prisma.industryProfile.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <header className="flex items-center justify-between border-b border-border px-8 py-5 sm:px-16">
          <Wordmark size="small" href="/industry-portal" />
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
            {industryProfile?.companyName ?? "Industry Portal"}
          </h1>
          <div className="mb-10 font-sans text-sm text-faint">
            {industryProfile?.contactType ? `${industryProfile.contactType} · ` : ""}
            Discover Beatmaker talent on AUXDROP.
          </div>

          <Card className="mb-6 flex flex-col gap-2 p-8">
            <div className="font-sans text-sm font-semibold text-on-dark">
              Browse Beatmaker talent
            </div>
            <div className="font-sans text-[13px] text-muted">
              Browse verified Beatmaker profiles, records, and released
              tracks.
            </div>
            <Link
              href="/beatmakers"
              className="mt-2 self-start rounded-button bg-signal px-5 py-2.5 font-sans text-[13px] font-bold text-on-dark"
            >
              Open Beatmakers directory
            </Link>
          </Card>

          <Card className="p-8 text-center">
            <div className="font-sans text-[13px] text-faint">
              Sync &amp; licensing catalog access is coming with AUXDROP Shop.
            </div>
          </Card>
        </div>

        <div className="border-t border-border px-8 py-7 font-sans text-xs text-faint sm:px-16">
          © 2026 AUXDROP
        </div>
      </div>
    </div>
  );
}
