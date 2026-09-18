"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export interface SendMessageState {
  error?: string;
}

export async function sendMessage(
  conversationId: string,
  _prevState: SendMessageState,
  formData: FormData,
): Promise<SendMessageState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: user.id } },
  });
  if (!participant) {
    return { error: "You're not part of this conversation." };
  }

  const body = String(formData.get("body") || "").trim();
  if (!body) {
    return { error: "Message can't be empty." };
  }

  await prisma.message.create({
    data: { conversationId, senderId: user.id, body },
  });

  revalidatePath(`/messages/${conversationId}`);
  return {};
}
