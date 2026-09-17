# AUXDROP — Build Plan & Notes for Claude Code

## What the mockups actually are (read this first)

The 45 files in `design/mockups/pages/*.dc.html` were exported from Claude's
own Design artifact tool. They are **not production-ready HTML/React** — each
file is a `<x-dc>` wrapper around a CDATA block that uses that tool's own
templating syntax (`sc-for` loops, `{{ variable }}` interpolation,
`data-component`/`data-action` hooks) plus a `support.js` runtime the design
tool injects at preview time. Opening one of these files outside the design
tool will not render correctly, and copy-pasting the markup as-is into a real
app will not work.

**Use them as visual and structural reference only:**
- Layout, spacing, colors, type, component composition → copy faithfully
  (see `docs/02-design-system.md` for extracted tokens).
- The literal markup / `sc-for` / `{{ }}` syntax → do not port. Re-implement
  each page as real components in whatever framework is chosen below, wiring
  the same visual structure to real data instead of the mockup's placeholder loop.
- `data-component="audio-player-bar"`, `data-component="waveform"`,
  `data-component="license-option"`, `data-component="shop-listing"`,
  `data-action="add-to-cart"`, `data-action="toggle-play"` are useful signals
  for **which pieces of UI should become their own reusable component** —
  treat them as a component inventory hint, not as code to reuse.
- Each page also includes a mobile (375px) frame at the bottom — that's the
  reference for the mobile/responsive layout of that same page, not a
  separate page.

If you want to view a mockup page's rendered look before rebuilding it, ask
Claude (in claude.ai) to open it via the Design artifact tool rather than
treating the raw file as runnable code.

## Recommended stack (adjust to the user's actual preference before starting)

No stack has been confirmed with the user yet. A reasonable default for a
data-heavy, auth-gated, commerce-enabled web app like this:

- **Frontend:** React (Next.js) — SSR/SEO matters for the public marketing
  pages (Home, About, How It Works, Beatmaker/Beat detail pages meant to be
  discoverable), while the logged-in app (Dashboard, Battles, Shop) can be
  client-rendered.
- **Styling:** Tailwind, with the tokens in `docs/02-design-system.md` set up
  as custom theme values (colors, font families, radii) rather than hardcoded
  hex values scattered through components.
- **Backend/DB:** whatever the user already has infra for; if greenfield, a
  Postgres-backed API (or a managed backend) fits the relational data model
  in `docs/04-data-model.md` well — battles/submissions/results/royalties are
  all relational with clear foreign keys.
- **Audio:** needs real waveform generation + playback (the audio-player-bar
  is used everywhere) — plan for an audio processing step on upload (e.g.
  generate a waveform peaks file) rather than computing it client-side each time.
- **Payments/payouts:** entry fees, shop purchases, and creator payouts are
  three different money-movement flows (charge, charge, payout) — confirm the
  payment processor early since it shapes the Wallet/Transaction/Order schema.

**Ask the user to confirm or override this stack before scaffolding a repo** —
this section is a starting recommendation, not a decision that's been made.

## Suggested build order

1. **Design tokens & component library** — colors/type/buttons/badges/cards/
   inputs from `docs/02-design-system.md`, plus the audio-player-bar and
   waveform components (highest-reuse component in the whole product).
2. **Auth & account shell** — Sign Up, Login, Forgot Password, Email
   Verification, Onboarding, Settings.
3. **Marketing pages** — Home, About, How It Works (mostly static content,
   good early win, no data model dependency).
4. **Battle loop core** — Beat Battles, Battle Detail, submission flow, Beat
   Detail, Results, Charts, Beatmaker Profile/Directory, Dashboard. This is
   the product — everything else is downstream of this working end-to-end.
5. **Social/retention layer** — Following, Activity Feed, Notifications,
   Messages, Comments.
6. **Admin for the core loop** — Admin Dashboard, Battle Management,
   Submission Review, Dispute Resolution, User Management (needed as soon as
   real battles run, not optional).
7. **Commerce (Phase 2)** — Shop, Sound Kits, Licenses, Cart, Checkout,
   Wallet, plus Marketplace Moderation, Royalty Management, Release Management
   on the admin side.
8. **Enterprise/live (Phase 3)** — Sponsor Portal, Industry Portal, TV,
   Championship, Hall of Fame, Financial Reporting, CMS, Analytics.

## What to do with this docs folder in the repo

Put this whole `docs/` folder plus `design/` at the repo root, and keep
`CLAUDE.md` at the repo root (Claude Code loads it automatically at the start
of every session in this repo). As real architecture decisions get made
(final stack, actual DB schema, folder structure), update these docs in place
— they should stay the living source of truth, not a one-time brief.
