"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function setUserAdmin(userId: string, isAdmin: boolean) {
  const me = await requireAdmin();
  if (me.id === userId && !isAdmin) {
    // Refuse to let an admin demote themselves and lock everyone out.
    return;
  }

  await prisma.user.update({ where: { id: userId }, data: { isAdmin } });
  revalidatePath("/admin/users");
}
