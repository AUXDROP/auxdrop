import "server-only";
import { prisma } from "@/lib/prisma";

// No ActivityEvent table — computed from BattleResult + Follow at read
// time (see prisma/schema.prisma's comment on this). Only battle results
// are a real activity type today; Release-based activity will join in
// once Release exists.
export async function getActivityFeed(userId: string, limit = 30) {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);
  if (followingIds.length === 0) return [];

  return prisma.battleResult.findMany({
    where: { userId: { in: followingIds } },
    include: { user: { select: { handle: true } }, battle: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
