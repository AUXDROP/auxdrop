import type { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";

export const metadata: Metadata = {
  title: "About — AUXDROP",
  description:
    "AUXDROP runs timed Beat Battles that turn competitive beatmaking into real Charts standing, releases, and revenue.",
};

const FEATURES = [
  {
    title: "Compete in Beat Battles",
    body: "Blind judging and head-to-head Battles surface the best beats, not the loudest.",
  },
  {
    title: "Sell beats and licenses",
    body: "Winning beats can move into releases, your Shop, and license review.",
  },
  {
    title: "Build your name",
    body: "Charts, catalogs, and Hall of Fame status compound over time, not one Battle.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <MarketingHeader variant="subpage" active="About" />

        <div className="flex flex-col gap-6 border-b border-border px-8 py-20 sm:px-16 sm:py-24">
          <div className="font-sans text-xs font-bold tracking-[0.12em] text-accent">
            ABOUT AUXDROP
          </div>
          <h1 className="max-w-3xl font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
            The competitive home for beatmakers.
          </h1>
          <p className="max-w-2xl font-sans text-lg leading-relaxed text-muted">
            AUXDROP runs timed Beat Battles that turn competitive beatmaking
            into real Charts standing, releases, and revenue. Every Battle is
            a step in a longer run — not a one-off contest.
          </p>
        </div>

        <div className="border-b border-border px-8 py-16 sm:px-16">
          <div className="mb-5 font-sans text-xs font-bold tracking-[0.1em] text-faint">
            WHAT YOU CAN DO
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <div className="mb-2.5 font-display text-xl font-bold text-on-dark">
                  {f.title}
                </div>
                <div className="font-sans text-sm leading-relaxed text-muted">
                  {f.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <MarketingFooter />
        </div>
      </div>
    </div>
  );
}
