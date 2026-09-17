# AUXDROP

The AUXDROP web app — a Next.js/Prisma/Supabase project — plus the business
context, design system, sitemap, and data-model docs it's being built from.

Start at `CLAUDE.md` — Claude Code loads it automatically. Everything else
lives in `docs/` (written docs) and `design/` (mockups + brand assets).

```
CLAUDE.md                  ← start here (auto-loaded by Claude Code)
docs/
  01-business-overview.md
  02-design-system.md
  03-sitemap.md
  04-data-model.md
  05-build-plan.md
  source/                  ← original business plan docs, for reference
design/
  mockups/pages/           ← 45 mockup pages (reference only — see 05-build-plan.md)
  assets/                  ← brand icon
app/                       ← Next.js App Router routes
components/                ← shared component library (ui/, audio/)
lib/                       ← Prisma client, Supabase clients, helpers
prisma/                    ← schema (no models yet — see docs/04-data-model.md)
```

## Getting started

```
npm install
cp .env.example .env   # fill in your Supabase project's values
npm run dev            # http://localhost:3000
```

The shared component library lives at `/dev/components` — an internal dev
reference, not a shipped route (see `docs/03-sitemap.md`'s treatment of
`Design System.dc.html` / `UI States.dc.html`).

Prisma is wired to Supabase Postgres via a driver adapter
(`@prisma/adapter-pg`, see `lib/prisma.ts`) rather than a schema-level `url`,
per Prisma 7's config system (`prisma7.config.ts`). No models are defined yet
— the data model in `docs/04-data-model.md` has open questions to resolve
with the user first.
