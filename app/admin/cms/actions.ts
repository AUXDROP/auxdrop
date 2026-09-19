"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { ContentBlockType } from "@/generated/prisma/client";

export interface CreateContentBlockState {
  error?: string;
}

const PATHS_BY_TYPE: Record<ContentBlockType, string> = {
  [ContentBlockType.STATIC_PAGE]: "",
  [ContentBlockType.FAQ_ENTRY]: "/faq",
  [ContentBlockType.PRESS_RELEASE]: "/press",
};

function revalidatePublicPaths(type: ContentBlockType, slug: string | null) {
  if (type === ContentBlockType.STATIC_PAGE && slug) {
    revalidatePath(`/${slug}`);
  } else {
    revalidatePath(PATHS_BY_TYPE[type]);
  }
}

export async function createContentBlock(
  _prevState: CreateContentBlockState,
  formData: FormData,
): Promise<CreateContentBlockState> {
  await requireAdmin();

  const typeRaw = String(formData.get("type") || "");
  const type = (Object.values(ContentBlockType) as string[]).includes(typeRaw)
    ? (typeRaw as ContentBlockType)
    : null;
  const slug = String(formData.get("slug") || "").trim() || null;
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const positionRaw = String(formData.get("position") || "").trim();
  const position = positionRaw ? Number(positionRaw) : null;
  const publish = formData.get("publish") === "on";

  if (!type || !title || !body) {
    return { error: "Type, title, and body are required." };
  }
  if (type === ContentBlockType.STATIC_PAGE && !slug) {
    return { error: "Static pages need a slug (e.g. terms-of-service)." };
  }

  await prisma.contentBlock.create({
    data: {
      type,
      slug: type === ContentBlockType.STATIC_PAGE ? slug : null,
      title,
      body,
      position,
      publishedAt: publish ? new Date() : null,
    },
  });

  revalidatePublicPaths(type, slug);
  revalidatePath("/admin/cms");
  redirect("/admin/cms");
}
