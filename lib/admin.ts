import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma/client";

/**
 * Gates access to /admin/* — called both in app/admin/layout.tsx (covers
 * every nested page) and independently inside every admin Server Action,
 * since a layout check alone doesn't protect Server Functions (Next 16's
 * own guidance: proxy/layout checks aren't sufficient by themselves).
 */
export async function requireAdmin(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.isAdmin) redirect("/dashboard");

  return dbUser;
}
