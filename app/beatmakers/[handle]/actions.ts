"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@/generated/prisma/client";

export async function followUser(targetUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.id === targetUserId) return;

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: user.id, followingId: targetUserId } },
    create: { followerId: user.id, followingId: targetUserId },
    update: {},
  });

  await prisma.notification.create({
    data: {
      userId: targetUserId,
      type: NotificationType.NEW_FOLLOWER,
      payload: { followerId: user.id },
    },
  });

  revalidatePath("/beatmakers");
  revalidatePath("/following");
}

export async function unfollowUser(targetUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await prisma.follow.deleteMany({
    where: { followerId: user.id, followingId: targetUserId },
  });

  revalidatePath("/beatmakers");
  revalidatePath("/following");
}

export async function startConversation(targetUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.id === targetUserId) return;

  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: user.id } } },
        { participants: { some: { userId: targetUserId } } },
      ],
    },
    select: { id: true, _count: { select: { participants: true } } },
  });

  const conversation =
    existing && existing._count.participants === 2
      ? existing
      : await prisma.conversation.create({
          data: {
            participants: { create: [{ userId: user.id }, { userId: targetUserId }] },
          },
        });

  redirect(`/messages/${conversation.id}`);
}
