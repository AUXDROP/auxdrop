import type { Metadata } from "next";
import Link from "next/link";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Card, CardBody } from "@/components/ui";

export const metadata: Metadata = {
  title: "AUXDROP — Beatmakers. Go head-to-head.",
  description:
    "Compete in timed Beat Battles, build your Beatmaker profile, and sell beats in your own Shop. Sign up for early access.",
};

const FEATURES = [
  {
    title: "Compete in Beat Battles",
    body: "Timed challenges, judged results, real standing on the Charts.",
  },
  {
    title: "Sell beats and licenses",
    body: "Set up your Shop and price exclusive or non-exclusive licenses.",
  },
  {
    title: "Upload Sound Kits",
    body: "Share drum kits, loops, and samples with other Beatmakers.",
  },
  {
    title: "Discover other Beatmakers",
    body: "Follow, message, and connect with Beatmakers you rate.",
  },
];

const JOURNEY = [
  "Enter a Battle",
  "Upload your beat",
  "Get judged",
  "See results",
  "Move up the Charts",
  "Sell in your Shop",
  "Sell licenses",
  "Release music",
  "Get paid",
  "Enter the Championship",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <MarketingHeader variant="home" />

        <div className="flex flex-col items-start gap-7 border-b border-border px-8 py-20 sm:px-16 sm:py-24">
          <div className="font-sans text-xs font-bold tracking-[0.12em] text-accent">
            EARLY ACCESS
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-on-dark sm:text-7xl">
            Beatmakers. Go head-to-head.
          </h1>
          <p className="max-w-xl font-sans text-lg font-medium text-muted">
            Compete in timed Beat Battles, build your Beatmaker profile, and
            sell beats in your own Shop. Sign up for early access.
          </p>
          <Link
            href="/signup"
            className="mt-2 rounded-button bg-signal px-7 py-4 font-sans text-sm font-bold text-on-dark"
          >
            Join early access
          </Link>
        </div>

        <div className="border-b border-border px-8 py-16 sm:px-16">
          <div className="mb-8 font-sans text-xs font-bold tracking-[0.12em] text-faint">
            WHAT YOU CAN DO ON AUXDROP
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <div className="mb-2 font-display text-lg font-bold text-on-dark">
                  {f.title}
                </div>
                <div className="font-sans text-sm leading-relaxed text-muted">
                  {f.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-border px-8 py-16 sm:px-16">
          <div className="mb-6 font-sans text-xs font-bold tracking-[0.12em] text-faint">
            HOW A BEAT BATTLE LEADS SOMEWHERE
          </div>
          <div className="flex items-center overflow-x-auto pb-2">
            {JOURNEY.map((step, i) => (
              <div key={step} className="flex flex-shrink-0 items-center">
                <div
                  className={
                    "flex items-center gap-1.5 whitespace-nowrap rounded-pill border px-3.5 py-2 " +
                    (i === 0
                      ? "border-signal bg-signal/[0.14]"
                      : "border-border bg-transparent")
                  }
                >
                  <span
                    className={
                      "h-1.5 w-1.5 rounded-full " +
                      (i === 0 ? "bg-signal" : "bg-border")
                    }
                  />
                  <span
                    className={
                      "font-sans text-[11px] font-bold " +
                      (i === 0 ? "text-on-dark" : "text-faint")
                    }
                  >
                    {step}
                  </span>
                </div>
                {i < JOURNEY.length - 1 && (
                  <span className="mx-1.5 text-xs text-border">→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-border px-8 py-16 sm:px-16">
          <h3 className="mb-7 font-display text-2xl font-bold text-on-dark">
            Charts
          </h3>
          <Card className="flex flex-wrap items-center justify-between gap-6 p-10">
            <CardBody className="mt-0 max-w-lg text-sm leading-relaxed">
              Charts track every Beatmaker&apos;s Battle record. Sign up now so
              yours starts counting from day one.
            </CardBody>
            <Link
              href="/signup"
              className="whitespace-nowrap rounded-button bg-signal px-6 py-3.5 font-sans text-sm font-bold text-on-dark"
            >
              Join early access
            </Link>
          </Card>
        </div>

        <div className="mt-auto">
          <MarketingFooter />
        </div>
      </div>
    </div>
  );
}
