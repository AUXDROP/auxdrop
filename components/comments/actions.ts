"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export interface AddCommentState {
  error?: string;
}

// Exactly one of battleId/trackId, mirroring Comment's own battleId/trackId
// exclusivity (validated in application code, same as Dispute).
export type CommentTarget =
  | { battleId: string; trackId?: undefined }
  | { trackId: string; battleId?: undefined };

export async function addComment(
  target: CommentTarget,
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
    data: { ...target, userId: user.id, body },
  });

  if (target.battleId) {
    revalidatePath(`/battles/${target.battleId}/results`);
  } else {
    revalidatePath(`/beats/${target.trackId}`);
  }
  return {};
}
