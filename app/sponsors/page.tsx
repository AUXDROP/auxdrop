import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sponsors — AUXDROP",
  description: "Sponsor Beat Battles, the Championship, and AUXDROP TV coverage from day one.",
};

const WHY = [
  {
    title: "Get in before launch",
    body: "Lock in founding sponsor placement across the first season.",
  },
  {
    title: "Reach real Beatmakers",
    body: "AUXDROP's audience is competitive beatmakers, not passive viewers.",
  },
  {
    title: "Grow with the platform",
    body: "Sponsorship scales with AUXDROP TV and the Championship as they grow.",
  },
];

// Matches design/mockups/pages/Sponsor Portal.dc.html — a public pitch page,
// not a logged-in dashboard (that's /sponsor, for already-onboarded
// sponsors). These are illustrative starting packages, not a live catalog —
// real deals are negotiated and recorded per-sponsor in /admin/sponsors.
const PACKAGES = [
  {
    name: "Battle Sponsor",
    price: "$5,000/battle",
    desc: "Logo placement on a single Battle, results page, and broadcast overlay.",
  },
  {
    name: "Season Partner",
    price: "$40,000/season",
    desc: "Presence across every Battle in a season plus AUXDROP TV integration.",
  },
  {
    name: "Championship Title",
    price: "Custom",
    desc: "Full Championship title sponsorship with dedicated broadcast segments.",
  },
];

export default function SponsorsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <header className="flex items-center justify-between border-b border-border px-8 py-5 sm:px-16">
          <Link href="/" className="font-display text-lg font-extrabold text-on-dark">
            AUXDROP <span className="font-semibold text-faint">Sponsors</span>
          </Link>
          <Link
            href="/championship"
            className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
          >
            Championship
          </Link>
        </header>

        <div className="border-b border-border px-8 py-20 sm:px-16">
          <div className="mb-3 font-sans text-xs text-faint">Sponsors</div>
          <h1 className="mb-3 max-w-2xl font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
            Reach beatmaking&apos;s most engaged audience.
          </h1>
          <p className="max-w-xl font-sans text-base text-muted">
            Sponsor Beat Battles, the Championship, and AUXDROP TV coverage
            from day one.
          </p>
        </div>

        <div className="border-b border-border px-8 py-16 sm:px-16">
          <div className="mb-6 font-sans text-xs font-bold tracking-[0.1em] text-faint">
            WHY SPONSOR EARLY
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title}>
                <div className="mb-2 font-display text-lg font-bold text-on-dark">
                  {w.title}
                </div>
                <div className="font-sans text-sm leading-relaxed text-muted">{w.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-16 sm:px-16">
          <div className="mb-6 font-sans text-xs font-bold tracking-[0.1em] text-faint">
            SPONSORSHIP PACKAGES
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {PACKAGES.map((p) => (
              <div
                key={p.name}
                className="flex flex-col gap-3.5 rounded-card border border-border bg-elevated p-7"
              >
                <div className="font-display text-xl font-bold text-on-dark">{p.name}</div>
                <div className="font-display text-2xl font-extrabold text-on-dark">
                  {p.price}
                </div>
                <div className="font-sans text-[13px] leading-relaxed text-muted">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-8 py-14 sm:px-16">
          <a
            href="mailto:sponsors@auxdrop.com"
            className="rounded-button bg-signal px-6 py-3.5 font-sans text-sm font-bold text-on-dark"
          >
            Contact sales
          </a>
          <div className="font-sans text-xs text-faint">© 2026 AUXDROP</div>
        </div>
      </div>
    </div>
  );
}
