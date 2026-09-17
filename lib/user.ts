import "server-only";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/generated/prisma/client";

const SIGNUP_ROLES: UserRole[] = [UserRole.BEATMAKER, UserRole.AUDIENCE];

/**
 * Creates (or updates) the app-side User row for a Supabase Auth user. Safe
 * to call on every login, not just the first — it's an idempotent upsert.
 * `role`/`handle` come from the signup form via Supabase Auth user metadata
 * (set at signUp()); anything else defaults to AUDIENCE so a metadata gap
 * never silently grants BEATMAKER (or the staff-only SPONSOR/INDUSTRY roles).
 */
export async function ensureUserRow(user: SupabaseUser) {
  const metadata = user.user_metadata as { handle?: string; role?: string };
  const role = SIGNUP_ROLES.includes(metadata.role as UserRole)
    ? (metadata.role as UserRole)
    : UserRole.AUDIENCE;

  const row = await prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email!,
      handle: metadata.handle || user.id,
      role,
    },
    update: {
      email: user.email!,
    },
  });

  if (row.role === UserRole.BEATMAKER) {
    await prisma.beatmakerProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
    });
  }

  return row;
}
