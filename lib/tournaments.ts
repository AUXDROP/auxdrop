import "server-only";
import { prisma } from "@/lib/prisma";
import { RoundStatus } from "@/generated/prisma/enums";

// --- Pure bracket math (no DB) ----------------------------------------------

export function bracketSizeFor(entrantCount: number): number {
  let size = 2;
  while (size < entrantCount) size *= 2;
  return size;
}

// Standard "straight seeding" (1 vs N, 2 vs N-1, ...) rather than the
// recursive seed-distribution algorithm big sports brackets use to keep top
// seeds apart for as long as possible. Simpler, and correct for byes: when
// entrantCount < bracketSize, the padding naturally gives byes to the best
// remaining seeds.
export function roundLabel(roundNumber: number, totalRounds: number): string {
  const remaining = totalRounds - roundNumber;
  if (remaining === 0) return "Final";
  if (remaining === 1) return "Semifinal";
  if (remaining === 2) return "Quarterfinal";
  return `Round ${roundNumber}`;
}

export interface SeedPair {
  position: number;
  userAId: string | null;
  userBId: string | null;
}

export function firstRoundPairs(entrants: { userId: string; seed: number }[]): SeedPair[] {
  const size = bracketSizeFor(entrants.length);
  const bySeed = new Map(entrants.map((e) => [e.seed, e.userId]));
  const pairs: SeedPair[] = [];
  for (let i = 0; i < size / 2; i++) {
    const seedA = i + 1;
    const seedB = size - i;
    pairs.push({
      position: i + 1,
      userAId: bySeed.get(seedA) ?? null,
      userBId: bySeed.get(seedB) ?? null,
    });
  }
  return pairs;
}

export function nextRoundPairs(
  previousMatches: { position: number; winnerId: string | null }[],
): SeedPair[] {
  const byPosition = new Map(previousMatches.map((m) => [m.position, m.winnerId]));
  const matchCount = previousMatches.length / 2;
  const pairs: SeedPair[] = [];
  for (let i = 0; i < matchCount; i++) {
    pairs.push({
      position: i + 1,
      userAId: byPosition.get(i * 2 + 1) ?? null,
      userBId: byPosition.get(i * 2 + 2) ?? null,
    });
  }
  return pairs;
}

// --- DB-touching helpers -----------------------------------------------------

export interface RoundMatchWinner {
  position: number;
  winnerId: string | null;
  resolved: boolean; // true = has a final answer (bye, vacant slot, or a completed Battle); false = still pending
}

// A match's outcome, independent of whether it's a bye, a genuinely empty
// slot (both sides null — only possible with a non-power-of-2 entrant
// count), or a real, judged Battle.
export async function getRoundMatchWinners(roundId: string): Promise<RoundMatchWinner[]> {
  const matches = await prisma.roundMatch.findMany({
    where: { roundId },
    orderBy: { position: "asc" },
    include: {
      battle: { include: { results: true } },
    },
  });

  return matches.map((m) => {
    if (m.byeWinnerId) {
      return { position: m.position, winnerId: m.byeWinnerId, resolved: true };
    }
    if (!m.userAId && !m.userBId) {
      // Vacant slot — no entrant was ever assigned here.
      return { position: m.position, winnerId: null, resolved: true };
    }
    if (!m.battle) {
      return { position: m.position, winnerId: null, resolved: false };
    }
    const winner = m.battle.results.find((r) => r.placement === 1);
    return { position: m.position, winnerId: winner?.userId ?? null, resolved: Boolean(winner) };
  });
}

export async function isRoundResolved(roundId: string): Promise<boolean> {
  const winners = await getRoundMatchWinners(roundId);
  return winners.length > 0 && winners.every((w) => w.resolved);
}

// Persists a round's pairing: real matches (both sides present) get a real
// Battle created with the given params; byes and vacant slots get a
// RoundMatch row with no Battle. Marks the round ACTIVE, or COMPLETED
// immediately if every match turned out to be a bye/vacant (nothing to wait
// on — e.g. a round with only 1 real entrant remaining after byes).
export async function generateRoundMatches(
  roundId: string,
  pairs: SeedPair[],
  battleParams: {
    title: string;
    genre: string | null;
    description: string | null;
    bpm: number | null;
    entryFee: number;
    durationMinutes: number;
    startsAt: Date;
    submissionDeadline: Date;
    judgingDeadline: Date | null;
    judgingType: "COMMUNITY" | "JUDGE_PANEL" | "HYBRID";
  },
): Promise<void> {
  let anyRealBattle = false;

  await prisma.$transaction(async (tx) => {
    for (const pair of pairs) {
      if (pair.userAId && pair.userBId) {
        anyRealBattle = true;
        const battle = await tx.battle.create({
          data: {
            title: `${battleParams.title} — Match ${pair.position}`,
            genre: battleParams.genre,
            description: battleParams.description,
            bpm: battleParams.bpm,
            entryFee: battleParams.entryFee,
            durationMinutes: battleParams.durationMinutes,
            startsAt: battleParams.startsAt,
            submissionDeadline: battleParams.submissionDeadline,
            judgingDeadline: battleParams.judgingDeadline,
            judgingType: battleParams.judgingType,
            status: "OPEN",
          },
        });
        await tx.roundMatch.create({
          data: {
            roundId,
            position: pair.position,
            userAId: pair.userAId,
            userBId: pair.userBId,
            battleId: battle.id,
          },
        });
      } else {
        // Bye (exactly one side) or vacant (neither side) — no Battle.
        const byeWinnerId = pair.userAId ?? pair.userBId ?? null;
        await tx.roundMatch.create({
          data: {
            roundId,
            position: pair.position,
            userAId: pair.userAId,
            userBId: pair.userBId,
            byeWinnerId,
          },
        });
      }
    }

    await tx.round.update({
      where: { id: roundId },
      data: { status: anyRealBattle ? RoundStatus.ACTIVE : RoundStatus.COMPLETED },
    });
  });
}
