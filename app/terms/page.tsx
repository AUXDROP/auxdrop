import type { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Card, CardBody } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { ContentBlockType } from "@/generated/prisma/enums";

export const metadata: Metadata = { title: "Terms of Service — AUXDROP" };

// Without this, Next statically prerenders the page at build time — same
// bug class as /beatmakers, /rankings, etc.
export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const block = await prisma.contentBlock.findUnique({
    where: { type_slug: { type: ContentBlockType.STATIC_PAGE, slug: "terms-of-service" } },
  });
  const isPublished = block && block.publishedAt;

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col border-x border-border bg-primary">
        <MarketingHeader variant="subpage" />

        <div className="flex-1 px-8 py-20 sm:px-16">
          <h1 className="mb-10 font-display text-4xl font-extrabold text-on-dark sm:text-5xl">
            {isPublished ? block.title : "Terms of Service"}
          </h1>

          {isPublished ? (
            <p className="max-w-3xl whitespace-pre-line font-sans text-sm leading-relaxed text-muted">
              {block.body}
            </p>
          ) : (
            <Card className="p-10 text-center">
              <CardBody className="mt-0">Not published yet.</CardBody>
            </Card>
          )}
        </div>

        <div className="mt-auto">
          <MarketingFooter />
        </div>
      </div>
    </div>
  );
}
