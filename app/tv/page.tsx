import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { NotifyForm } from "./NotifyForm";

export const metadata: Metadata = {
  title: "TV — AUXDROP",
  description: "Live coverage of Beat Battles and the Championship, coming soon to AUXDROP TV.",
};

// Matches design/mockups/pages/TV.dc.html exactly — it's already an honest
// "coming soon" page (COMING SOON eyebrow, "Nothing to watch yet", no data
// loop). This state is unconditional, not data-driven: there's no live
// video state to flip to, because no streaming infra exists (no ingest, no
// player beyond the audio-only AudioPlayerBar, no vendor chosen). Building
// that needs a real vendor decision (Mux/Livepeer/etc.) first — see
// docs/04-data-model.md's TV note. Only real thing here: the "Get
// notified" waitlist capture.
export default function TvPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-8 py-5 sm:px-16">
          <Link href="/" className="font-display text-lg font-extrabold text-on-dark">
            AUXDROP <span className="font-semibold text-faint">TV</span>
          </Link>
          <nav className="flex items-center gap-7">
            <Link href="/tv" className="font-sans text-sm font-semibold text-on-dark">
              Live
            </Link>
            <Link
              href="/championship"
              className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
            >
              Championship
            </Link>
          </nav>
          <NotifyForm />
        </header>

        <div className="flex flex-col items-center gap-10 border-b border-border px-8 py-14 sm:flex-row sm:px-16">
          <div className="aspect-video w-full flex-shrink-0 rounded-2xl bg-elevated sm:w-[280px]" />
          <div>
            <div className="mb-2.5 font-sans text-xs text-faint">AUXDROP TV</div>
            <div className="mb-2.5 font-sans text-xs font-bold tracking-[0.1em] text-accent">
              COMING SOON
            </div>
            <h1 className="max-w-lg font-display text-2xl font-bold text-on-dark sm:text-3xl">
              Live coverage of Beat Battles and the Championship
            </h1>
          </div>
        </div>

        <div className="px-8 py-14 sm:px-16">
          <Card className="p-14 text-center">
            <div className="font-display text-xl font-bold text-on-dark">
              Nothing to watch yet
            </div>
            <div className="mt-2.5 font-sans text-sm text-faint">
              AUXDROP TV goes live once the first Beat Battles start.
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
