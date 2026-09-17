# AUXDROP — Project Context for Claude Code

AUXDROP is a competitive music-production battle network: beatmakers enter
timed 60-minute beat-making battles, get ranked on a public record, and top
performers get their tracks turned into real commercial output (compilation
releases, sound kits, beat licenses, sync placements). This repo is building
the web app for it.

**Read these before writing code**, in this order:

1. `docs/01-business-overview.md` — the product, its users, and the phased
   rollout order. Determines what's core vs. later-phase.
2. `docs/02-design-system.md` — colors, type, spacing, and shared components.
3. `docs/03-sitemap.md` — every page, its route, and its purpose, grouped by
   build phase.
4. `docs/04-data-model.md` — inferred entities/relationships. Flag anything
   here you need the user to confirm before locking in a schema.
5. `docs/05-build-plan.md` — **read this in full before touching
   `design/mockups/`.** It explains that the mockup files are design-tool
   exports, not runnable code, and how to actually use them as reference.

## Ground rules

- Visual/UX decisions should match the mockups in `design/mockups/pages/` and
  the tokens in `docs/02-design-system.md`. Don't invent a new visual
  direction without checking with the user first.
- Feature scope and build order should follow the phases in
  `docs/01-business-overview.md` and `docs/03-sitemap.md` — don't build
  Phase 2/3 surfaces before Phase 1 (the core battle loop) works end-to-end.
- The data model doc is a first pass, not a locked schema — confirm the open
  questions at the bottom of `docs/04-data-model.md` with the user before
  finalizing migrations.
- No tech stack has been confirmed yet. `docs/05-build-plan.md` has a
  recommendation — confirm it with the user (or use what they specify) before
  scaffolding the project.
- Keep these docs updated as real decisions get made — they're meant to stay
  accurate, not just serve as a one-time brief.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
