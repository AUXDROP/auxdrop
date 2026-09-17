# AUXDROP — Sitemap & Page Inventory

45 mockup pages exist in `design/mockups/pages/`. Each file name below matches
the file in that folder exactly (spaces included). Routes are taken from the
mockup's own `Page: /...` comment where present; inferred routes are marked
`(inferred)` — confirm/adjust during build.

Grouped by build phase per `docs/01-business-overview.md`. Build top-to-bottom
within a phase; public marketing pages and auth first, then the battle loop,
then commerce, then admin/ops, then enterprise/live.

## Phase 0 — Marketing & Auth (build first, unblocks everything else)

| Page | Route | Purpose |
|---|---|---|
| Home.dc.html | `/` | Marketing landing — "Beatmakers. Go head-to-head." Hero, value props per audience (beatmaker/audience/brand), the battle loop explainer. |
| About.dc.html | `/about` | Brand/mission story. |
| How It Works.dc.html | `/how-it-works` | Explains the 60-minute battle loop step by step. |
| Sign Up.dc.html | `/signup` | Account creation. |
| Login.dc.html | `/login` | Auth. |
| Forgot Password.dc.html | `/forgot-password` | Password reset request. |
| Email Verification.dc.html | `/verify-email` | Post-signup email confirmation. |
| Onboarding.dc.html | `/onboarding` | "Tell us about you" — post-signup profile setup (genre, role, etc). |
| UI States.dc.html | `/ui-states` | Internal reference: empty/loading/error states for shared components. Not a user-facing page — keep as a dev reference (e.g. Storybook-style route, or fold into a component library instead of shipping as a route). |
| Design System.dc.html | `/design-system` | Internal reference: tokens/components. Same treatment as UI States — dev reference, not a shipped page. |

## Phase 1 — Core Engine (the battle loop)

| Page | Route | Purpose |
|---|---|---|
| Beat Battles.dc.html | `/battles` | Browse open/upcoming/past battles/challenges. |
| Battle Detail.dc.html | `/battles/:id` (inferred) | A single battle: challenge brief, timer, entrants, submission CTA. |
| Beat Detail.dc.html | `/beats/:id` (inferred) | A single submitted track: player, waveform, metadata, licensing badges. |
| Submission Review.dc.html | `/admin/submissions` | **Admin.** Queue for reviewing/validating submitted entries (e.g. flagging rule violations before judging). |
| Results.dc.html | `/battles/:id/results` (inferred) | Battle outcome for a beatmaker — win/loss, score breakdown. Shown here under "Marcus Cole" as an example result page. |
| Charts.dc.html | `/rankings` | Global/genre leaderboards — the public ranking ladder (`#03 GLOBAL`, `8–2` records live here). |
| Beatmaker Profile.dc.html | `/beatmakers/:handle` (inferred) | Public profile — record, released tracks, commercial badges. Example shown: "Jordan Blake". |
| Beatmakers.dc.html | `/beatmakers` | Directory/discovery of beatmakers (filter by genre, rank, etc). |
| Following.dc.html | `/following` | The current user's followed beatmakers feed. |
| Activity Feed.dc.html | `/activity` (inferred) | Social/activity stream (battle results, new releases, follows). |
| Comments.dc.html | (embedded component, not a standalone route) | Comment thread component used on battle/beat/release pages. |
| Dashboard.dc.html | `/dashboard` | Logged-in beatmaker home — "Welcome to AUXDROP, Jordan." Active battles, stats, quick actions. |
| Notifications.dc.html | `/notifications` | Notification center. |
| Messages.dc.html | `/messages` | Direct messages between users. |
| Releases.dc.html | `/releases` | Season compilation albums — the Phase-1 commercial output. |
| Hall of Fame.dc.html | `/hall-of-fame` (inferred) | All-time/season champions showcase. |
| Championship.dc.html | `/championship` (inferred) | Tournament/bracket-style championship event page (`bracket` data loop). |
| Settings.dc.html | `/settings` | Account settings. |
| Analytics.dc.html | `/analytics` | Per-beatmaker performance analytics (their own stats, not admin-wide). |

## Phase 2 — Direct Monetization (Shop)

| Page | Route | Purpose |
|---|---|---|
| Shop.dc.html | `/shop` | Beat Shop marketplace — licensing storefront. |
| Sound Kits.dc.html | `/sound-kits` (inferred) | Winner co-branded sound kit storefront. |
| Licenses.dc.html | `/licenses` (inferred) | A buyer's or seller's purchased/sold license records. |
| Cart.dc.html | `/cart` | Shopping cart. |
| Checkout.dc.html | `/checkout` | Payment flow. |
| Wallet.dc.html | `/wallet` | Beatmaker earnings — payouts, balances, transaction history ("Beatmaker Earnings"). |
| Marketplace Moderation.dc.html | `/admin/shop` | **Admin.** Moderate shop listings. |
| Royalty Management.dc.html | `/admin/royalties` | **Admin.** Manage royalty splits/payouts for releases and kits. |
| Release Management.dc.html | `/admin/releases` | **Admin.** Manage compilation album releases (Phase 1 output, but the admin tool ships alongside Shop/Wallet infra). |

## Phase 3 — Enterprise & Live

| Page | Route | Purpose |
|---|---|---|
| Sponsor Portal.dc.html | (brand-facing, route TBD) | Brand-facing landing/dashboard — "Reach beatmaking's most engaged audience." |
| Industry Portal.dc.html | (A&R/sync-facing, route TBD) | Industry-facing talent discovery — "Discover Beatmaker talent, at scale." |
| TV.dc.html | `/tv` (inferred) | Live battle/championship streaming surface. |

## Cross-cutting Admin / Ops

Build each of these alongside the phase it supports (see business overview doc)
rather than as one big "admin" milestone.

| Page | Route | Purpose |
|---|---|---|
| Admin Dashboard.dc.html | `/admin` | Ops overview/home. |
| Battle Management.dc.html | `/admin/battles` | Create/edit/schedule battles & challenges. |
| Dispute Resolution.dc.html | `/admin/disputes` | Handle judging disputes / flagged content (`disputes`, `flagged` data). |
| User Management.dc.html | `/admin/users` | User accounts admin. |
| Financial Reporting.dc.html | `/admin/finance` | Platform-wide financial reporting (entry fees, commissions, sponsorships). |
| CMS.dc.html | `/admin/cms` | Content management for marketing/editorial content. |

## Notes for whoever builds routing

- Detail-page routes marked `(inferred)` don't have an explicit path in the
  mockup — confirm the real slug/ID scheme (e.g. numeric ID vs. slug vs. handle)
  before wiring up real data.
- `Comments.dc.html` and the audio-player-bar are **components**, not pages —
  don't scaffold them as top-level routes.
- `Design System.dc.html` and `UI States.dc.html` are for the build team, not
  end users — decide whether to ship them behind an internal-only route or
  leave them out of the deployed app entirely.
