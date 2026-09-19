import type { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Card, CardBody, CardTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { ContentBlockType } from "@/generated/prisma/enums";

export const metadata: Metadata = {
  title: "FAQ — AUXDROP",
  description: "Frequently asked questions about AUXDROP.",
};

// Without this, Next statically prerenders the FAQ list at build time —
// same bug class as /beatmakers, /rankings, etc.
export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const entries = await prisma.contentBlock.findMany({
    where: { type: ContentBlockType.FAQ_ENTRY, publishedAt: { not: null } },
    orderBy: [{ position: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <MarketingHeader variant="subpage" />

        <div className="flex-1 px-8 py-20 sm:px-16">
          <h1 className="mb-10 font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
            Frequently Asked Questions
          </h1>

          {entries.length === 0 ? (
            <Card className="p-10 text-center">
              <CardBody className="mt-0">Nothing here yet.</CardBody>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              {entries.map((e) => (
                <Card key={e.id}>
                  <CardTitle>{e.title}</CardTitle>
                  <CardBody className="whitespace-pre-line">{e.body}</CardBody>
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
