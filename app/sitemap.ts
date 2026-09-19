import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://auxdrop.com"; // matches app/layout.tsx's metadataBase

// sitemap.ts is cached/static by default unless it uses a request-time API
// (per node_modules/next/dist/docs) — since this queries Prisma, force
// dynamic so new battles/beatmakers/tracks show up without a redeploy.
// Same bug class as /beatmakers, /rankings, /hall-of-fame, /releases.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/how-it-works`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/battles`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/beatmakers`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/rankings`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/hall-of-fame`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/releases`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/championship`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/sponsors`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/industry`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/tv`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const [battles, beatmakerProfiles, tracks] = await Promise.all([
    prisma.battle.findMany({ select: { id: true, updatedAt: true } }),
    prisma.beatmakerProfile.findMany({
      select: { updatedAt: true, user: { select: { handle: true } } },
    }),
    prisma.track.findMany({ select: { id: true, createdAt: true } }),
  ]);

  const battleEntries: MetadataRoute.Sitemap = battles.map((b) => ({
    url: `${BASE_URL}/battles/${b.id}`,
    lastModified: b.updatedAt,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const beatmakerEntries: MetadataRoute.Sitemap = beatmakerProfiles.map((p) => ({
    url: `${BASE_URL}/beatmakers/${p.user.handle}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const beatEntries: MetadataRoute.Sitemap = tracks.map((t) => ({
    url: `${BASE_URL}/beats/${t.id}`,
    lastModified: t.createdAt,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticEntries, ...battleEntries, ...beatmakerEntries, ...beatEntries];
}
