import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ContentBlockType } from "@/generated/prisma/client";
import { CreateContentBlockForm } from "./CreateContentBlockForm";

export const metadata: Metadata = { title: "Content Management — AUXDROP" };

const SECTION_LABELS: Record<ContentBlockType, string> = {
  [ContentBlockType.STATIC_PAGE]: "Static Pages",
  [ContentBlockType.FAQ_ENTRY]: "FAQ Entries",
  [ContentBlockType.PRESS_RELEASE]: "Press Releases",
};

function relativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [604800, "w"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secondsInUnit, label] of units) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return `${value}${label} ago`;
  }
  return "just now";
}

export default async function ContentManagementPage() {
  const blocks = await prisma.contentBlock.findMany({
    orderBy: [{ type: "asc" }, { position: "asc" }, { updatedAt: "desc" }],
  });

  const sections = Object.values(ContentBlockType).map((type) => ({
    type,
    label: SECTION_LABELS[type],
    items: blocks.filter((b) => b.type === type),
  }));

  return (
    <div>
      <div className="border-b border-border px-12 py-6 font-sans text-xs text-faint">
        Page: /admin/cms
      </div>
      <div className="p-12">
        <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
          Content Management
        </h1>

        <CreateContentBlockForm />

        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <div key={section.type}>
              <div className="mb-3 font-sans text-xs font-bold tracking-[0.08em] text-faint">
                {section.label.toUpperCase()}
              </div>
              {section.items.length === 0 ? (
                <p className="font-sans text-[13px] text-faint">Nothing here yet.</p>
              ) : (
                <div className="flex flex-col gap-px overflow-hidden rounded-card bg-border">
                  {section.items.map((item) => (
                    <Link
                      key={item.id}
                      href={`/admin/cms/${item.id}`}
                      className="flex items-center justify-between bg-elevated px-5 py-3.5 hover:bg-primary"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-[13px] font-semibold text-on-dark">
                          {item.title}
                        </span>
                        {!item.publishedAt && (
                          <span className="rounded-pill bg-status-error/12 px-2 py-0.5 text-[10px] font-bold text-status-error">
                            DRAFT
                          </span>
                        )}
                      </div>
                      <span className="font-sans text-xs text-faint">
                        Edited {relativeTime(item.updatedAt)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
