"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export interface AddCommentState {
  error?: string;
}

export async function addBattleComment(
  battleId: string,
  _prevState: AddCommentState,
  formData: FormData,
): Promise<AddCommentState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const body = String(formData.get("body") || "").trim();
  if (!body) {
    return { error: "Comment can't be empty." };
  }

  await prisma.comment.create({
    data: { battleId, userId: user.id, body },
  });

  revalidatePath(`/battles/${battleId}/results`);
  return {};
}
