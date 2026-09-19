import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentBlockType } from "@/generated/prisma/client";
import { EditContentBlockForm } from "./EditContentBlockForm";
import { DeleteButton } from "./DeleteButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const block = await prisma.contentBlock.findUnique({ where: { id } });
  return { title: block ? `${block.title} — Admin — AUXDROP` : "Admin — AUXDROP" };
}

export default async function AdminContentBlockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const block = await prisma.contentBlock.findUnique({ where: { id } });
  if (!block) notFound();

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/cms/{block.id}
      </div>
      <div className="p-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-1 font-display text-3xl font-extrabold text-on-dark">
              {block.title}
            </h1>
            <div className="font-sans text-sm text-faint">
              {block.type.replace("_", " ")}
              {block.slug ? ` · /${block.slug}` : ""}
            </div>
          </div>
          <DeleteButton id={block.id} />
        </div>

        <EditContentBlockForm
          id={block.id}
          title={block.title}
          body={block.body}
          position={block.position}
          isPublished={Boolean(block.publishedAt)}
          showPosition={block.type === ContentBlockType.FAQ_ENTRY}
        />
      </div>
    </div>
  );
}
