import "server-only";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/generated/prisma/client";

// "Win" = placement 1 in a Battle. There's no separate wins/losses counter
// stored anywhere (see prisma/schema.prisma's BattleResult comment) — record
// and rank are always computed from BattleResult rows directly, so there's
// nothing to fall out of sync.

export interface BeatmakerRecord {
  wins: number;
  losses: number;
  battles: number;
  winRate: number; // 0-100, one decimal
}

export async function getBeatmakerRecord(userId: string): Promise<BeatmakerRecord> {
  const results = await prisma.battleResult.findMany({
    where: { userId },
    select: { placement: true },
  });
  const battles = results.length;
  const wins = results.filter((r) => r.placement === 1).length;
  const losses = battles - wins;
  const winRate = battles > 0 ? Math.round((wins / battles) * 1000) / 10 : 0;
  return { wins, losses, battles, winRate };
}

export interface RankingRow {
  userId: string;
  handle: string;
  wins: number;
  losses: number;
  battles: number;
  winRate: number;
}

export async function getGlobalRankings(limit = 50): Promise<RankingRow[]> {
  const users = await prisma.user.findMany({
    where: { role: UserRole.BEATMAKER, battleResults: { some: {} } },
    select: {
      id: true,
      handle: true,
      battleResults: { select: { placement: true } },
    },
  });

  return users
    .map((u) => {
      const battles = u.battleResults.length;
      const wins = u.battleResults.filter((r) => r.placement === 1).length;
      return {
        userId: u.id,
        handle: u.handle,
        wins,
        losses: battles - wins,
        battles,
        winRate: battles > 0 ? Math.round((wins / battles) * 1000) / 10 : 0,
      };
    })
    .sort((a, b) => b.wins - a.wins || b.winRate - a.winRate)
    .slice(0, limit);
}
