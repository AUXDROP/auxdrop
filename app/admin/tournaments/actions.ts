"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { bracketSizeFor, roundLabel } from "@/lib/tournaments";

export interface CreateTournamentState {
  error?: string;
}

export async function createTournament(
  _prevState: CreateTournamentState,
  formData: FormData,
): Promise<CreateTournamentState> {
  await requireAdmin();

  const title = String(formData.get("title") || "").trim();
  const handlesRaw = String(formData.get("handles") || "");
  const handles = [...new Set(handlesRaw.split("\n").map((h) => h.trim()).filter(Boolean))];

  if (!title) {
    return { error: "Title is required." };
  }
  if (handles.length < 2) {
    return { error: "Enter at least 2 distinct Beatmaker handles, one per line, in seed order." };
  }

  const users = await prisma.user.findMany({ where: { handle: { in: handles } } });
  const byHandle = new Map(users.map((u) => [u.handle, u]));
  const missing = handles.filter((h) => !byHandle.has(h));
  if (missing.length > 0) {
    return { error: `No user found for handle(s): ${missing.join(", ")}` };
  }

  const bracketSize = bracketSizeFor(handles.length);
  const totalRounds = Math.log2(bracketSize);

  const tournament = await prisma.$transaction(async (tx) => {
    const t = await tx.tournament.create({ data: { title } });
    await tx.tournamentEntrant.createMany({
      data: handles.map((h, i) => ({
        tournamentId: t.id,
        userId: byHandle.get(h)!.id,
        seed: i + 1,
      })),
    });
    for (let r = 1; r <= totalRounds; r++) {
      await tx.round.create({
        data: { tournamentId: t.id, roundNumber: r, label: roundLabel(r, totalRounds) },
      });
    }
    return t;
  });

  revalidatePath("/admin/tournaments");
  redirect(`/admin/tournaments/${tournament.id}`);
}
