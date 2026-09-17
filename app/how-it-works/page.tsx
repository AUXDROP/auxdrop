import type { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";

export const metadata: Metadata = {
  title: "How It Works — AUXDROP",
  description:
    "From entering a Battle to building a Beatmaker career on AUXDROP.",
};

const STEPS = [
  {
    num: "01",
    title: "Discover a Battle",
    desc: "Browse open Battles by genre, prize, and time limit.",
  },
  {
    num: "02",
    title: "Enter and create",
    desc: "Pay the entry fee and produce your beat to the challenge brief before the deadline.",
  },
  {
    num: "03",
    title: "Blind judging",
    desc: "Judges score submissions without knowing who made them.",
  },
  {
    num: "04",
    title: "Results and Ranking",
    desc: "Placements update your Battle Record and global Ranking immediately.",
  },
  {
    num: "05",
    title: "Review",
    desc: "Standout beats are considered for official Releases, the Shop, Sound Kits, and Licensing.",
  },
  {
    num: "06",
    title: "Growth",
    desc: "Royalties, followers, and Hall of Fame status build over every season you compete.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <MarketingHeader variant="subpage" active="How It Works" />

        <div className="border-b border-border px-8 py-16 sm:px-16 sm:py-20">
          <h1 className="mb-3 font-display text-3xl font-extrabold text-on-dark sm:text-5xl">
            How It Works
          </h1>
          <p className="max-w-xl font-sans text-base text-muted">
            From entering a Battle to building a Beatmaker career on AUXDROP.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-border border-b border-border">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="grid grid-cols-[56px_1fr] gap-6 px-8 py-8 sm:grid-cols-[80px_1fr] sm:px-16"
            >
              <div className="font-display text-2xl font-extrabold text-accent sm:text-3xl">
                {step.num}
              </div>
              <div>
                <div className="mb-2 font-display text-lg font-bold text-on-dark sm:text-xl">
                  {step.title}
                </div>
                <div className="max-w-xl font-sans text-sm leading-relaxed text-muted">
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <MarketingFooter cta={{ label: "Enter a Battle", href: "/signup" }} />
        </div>
      </div>
    </div>
  );
}
