import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Industry — AUXDROP",
  description: "Discover Beatmaker talent, at scale — for labels, A&R, music supervisors, game studios and brands.",
};

// Without this, Next statically prerenders the profile count at build
// time — same bug class fixed on /beatmakers, /rankings, etc.
export const dynamic = "force-dynamic";

// Matches design/mockups/pages/Industry Portal.dc.html — a public pitch
// page, not a logged-in dashboard (that's /industry-portal, for
// already-onboarded contacts). Two deliberate deviations from the mockup,
// per the approved proposal: a real profile count instead of the mockup's
// stale "No Beatmaker profiles yet" (Beatmaker profiles are real now),
// and "Request access" instead of a signup link (there's no self-serve
// path to the INDUSTRY role).
export default async function IndustryPage() {
  const profileCount = await prisma.beatmakerProfile.count();

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <header className="flex items-center justify-between border-b border-border px-8 py-5 sm:px-16">
          <Link href="/" className="font-display text-lg font-extrabold text-on-dark">
            AUXDROP <span className="font-semibold text-faint">Industry</span>
          </Link>
          <Link
            href="/beatmakers"
            className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
          >
            Beatmakers
          </Link>
        </header>

        <div className="border-b border-border px-8 py-20 sm:px-16">
          <div className="mb-3 font-sans text-xs text-faint">Industry</div>
          <h1 className="mb-3 max-w-2xl font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
            Discover Beatmaker talent, at scale.
          </h1>
          <p className="max-w-xl font-sans text-base text-muted">
            For labels, A&amp;R, music supervisors, game studios and brands.
          </p>
        </div>

        <div className="px-8 py-16 sm:px-16">
          {profileCount === 0 ? (
            <div className="rounded-card border border-border bg-elevated p-14 text-center">
              <div className="font-display text-xl font-bold text-on-dark">
                No Beatmaker profiles yet
              </div>
              <div className="mt-2.5 font-sans text-sm text-faint">
                Check back once Beatmakers start joining AUXDROP.
              </div>
            </div>
          ) : (
            <div className="rounded-card border border-border bg-elevated p-14 text-center">
              <div className="font-display text-3xl font-extrabold text-on-dark">
                {profileCount} Beatmaker{profileCount === 1 ? "" : "s"}
              </div>
              <div className="mt-2.5 font-sans text-sm text-faint">
                Ready to discover on AUXDROP.
              </div>
              <Link
                href="/beatmakers"
                className="mt-6 inline-block rounded-button bg-signal px-6 py-3.5 font-sans text-sm font-bold text-on-dark"
              >
                Browse Beatmakers
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-8 py-14 sm:px-16">
          <a
            href="mailto:industry@auxdrop.com"
            className="rounded-button bg-signal px-6 py-3.5 font-sans text-sm font-bold text-on-dark"
          >
            Request access
          </a>
          <div className="font-sans text-xs text-faint">© 2026 AUXDROP</div>
        </div>
      </div>
    </div>
  );
}
