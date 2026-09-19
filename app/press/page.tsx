import type { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Card, CardBody, CardTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { ContentBlockType } from "@/generated/prisma/enums";

export const metadata: Metadata = {
  title: "Press — AUXDROP",
  description: "AUXDROP press releases and announcements.",
};

// Without this, Next statically prerenders the press list at build time —
// same bug class as /beatmakers, /rankings, etc.
export const dynamic = "force-dynamic";

export default async function PressPage() {
  const releases = await prisma.contentBlock.findMany({
    where: { type: ContentBlockType.PRESS_RELEASE, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <MarketingHeader variant="subpage" />

        <div className="flex-1 px-8 py-20 sm:px-16">
          <h1 className="mb-10 font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
            Press
          </h1>

          {releases.length === 0 ? (
            <Card className="p-10 text-center">
              <CardBody className="mt-0">No press releases yet.</CardBody>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {releases.map((r) => (
                <Card key={r.id}>
                  <div className="mb-1.5 font-sans text-xs text-faint">
                    {r.publishedAt?.toLocaleDateString()}
                  </div>
                  <CardTitle>{r.title}</CardTitle>
                  <CardBody className="whitespace-pre-line">{r.body}</CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <MarketingFooter />
        </div>
      </div>
    </div>
  );
}
