"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { ContentBlockType } from "@/generated/prisma/client";

export interface UpdateContentBlockState {
  error?: string;
}

function publicPathFor(type: ContentBlockType, slug: string | null): string {
  if (type === ContentBlockType.STATIC_PAGE) return slug ? `/${slug}` : "/admin/cms";
  if (type === ContentBlockType.FAQ_ENTRY) return "/faq";
  return "/press";
}

export async function updateContentBlock(
  id: string,
  _prevState: UpdateContentBlockState,
  formData: FormData,
): Promise<UpdateContentBlockState> {
  await requireAdmin();

  const existing = await prisma.contentBlock.findUnique({ where: { id } });
  if (!existing) return { error: "Not found." };

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const positionRaw = String(formData.get("position") || "").trim();
  const position = positionRaw ? Number(positionRaw) : null;
  const publish = formData.get("publish") === "on";

  if (!title || !body) {
    return { error: "Title and body are required." };
  }

  await prisma.contentBlock.update({
    where: { id },
    data: {
      title,
      body,
      position,
      publishedAt: publish ? (existing.publishedAt ?? new Date()) : null,
    },
  });

  revalidatePath(publicPathFor(existing.type, existing.slug));
  revalidatePath(`/admin/cms/${id}`);
  revalidatePath("/admin/cms");
  return {};
}

export async function deleteContentBlock(id: string) {
  await requireAdmin();

  const existing = await prisma.contentBlock.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.contentBlock.delete({ where: { id } });

  revalidatePath(publicPathFor(existing.type, existing.slug));
  revalidatePath("/admin/cms");
  redirect("/admin/cms");
}
