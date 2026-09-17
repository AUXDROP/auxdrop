# AUXDROP — Design System

Extracted from `design/mockups/pages/Design System.dc.html` (the mockup's own
design-tokens page) and cross-checked against the other mockup pages. Treat
this as the source of truth for tokens; the mockup markup itself is reference
only (see `docs/05-build-plan.md` for why).

## Brand

- Wordmark: **AUXDROP** — set in Syne, weight 800.
- Icon: `design/assets/auxdrop_original_icon.svg` — an "A" built from a
  waveform, in `#09090B` (near-black). On dark backgrounds throughout the
  mockups it's shown inverted (white) — treat the icon as recolorable, not a
  fixed-color asset.

## Colors / tokens

| Name | Hex | Token | Usage |
|---|---|---|---|
| AUXDROP Black | `#050506` | `bg-canvas` | outer page background |
| AUXDROP Dark | `#09090B` / `#18181B` | `bg-primary` / `bg-elevated` | page shell / cards, inputs |
| AUXDROP White | `#F7F7F5` | `text-on-dark` | primary text on dark |
| Border | `#27272A` | `border-default` | all hairline borders |
| AUXDROP Signal (red) | `#FF3B30` | `action-primary` | primary buttons, links, played-waveform, active nav |
| AUXDROP Electric (violet) | `#7C3AED` | `accent` | focus rings, "licensing review" / "sync roster" status, scrub state |
| Muted text | `#A1A1AA` | `text-muted` | secondary text, nav labels |
| Faint text | `#71717A` | `text-faint` | eyebrow labels, timestamps, section labels |

Status colors (used consistently as pill badges across battles, disputes,
submissions, wallet, licensing):

| Status | Color |
|---|---|
| OPEN | `#22C55E` (green) |
| UPCOMING | `#3B82F6` (blue) |
| PENDING | `#F59E0B` (amber) |
| ERROR | `#EF4444` (red) |
| LICENSING REVIEW | `#7C3AED` (violet) |
| COMPLETED | `#A1A1AA` (muted grey) |

Commercial-asset badges (same pill component, different copy):
`OFFICIAL DSP RELEASE` (violet), `SOUND KIT CONTRIBUTOR` (amber),
`LICENSE AVAILABLE: NON-EXCLUSIVE / EXCLUSIVE / STEMS` (green),
`SYNC ROSTER QUALIFIED` (blue).

The dark palette + signal red + electric violet is used everywhere — this is a
dark-mode-only product in the mockups, not a light/dark toggle. Don't build a
light theme unless the user asks for one.

## Typography

- **Syne** (Google Font, weights 600/700/800) — display and headings only.
  - `800` — hero/display headlines
  - `700` — section headings, card titles
- **Manrope** (Google Font, weights 400–800) — everything else.
  - `600` — UI text, labels, nav, buttons
  - `400` — body copy (usually in `text-muted` `#A1A1AA`)

Load via Google Fonts: `Syne:wght@600;700;800` and
`Manrope:wght@400;500;600;700;800`.

## Components

- **Buttons** — 3 states: Primary (`#FF3B30` fill, white text), Secondary
  (transparent, `1px` `border-default`), Disabled (`#18181B` fill, `#71717A`
  text). `border-radius: 8px`, `padding: 14px 24px`, label weight 700/14px.
- **Status/asset badges** — pill (`border-radius: 100px`), `padding: 6px 12px`,
  `font-weight: 700`, `font-size: 11px`, colored text on a 12%-opacity tint of
  the same color.
- **Cards** — `#18181B` fill, `1px` `border-default`, `border-radius: 12px`,
  `padding: 24px`. Title in Syne 700/16px, body in Manrope/13px `text-muted`.
- **Form inputs** — `#18181B` fill, `1px` `border-default`, `border-radius: 10px`,
  `padding: 14px 16px`. Focus state swaps border to `#7C3AED` (accent). Error
  state swaps border to `#EF4444`.
- **Audio player bar** (`data-component="audio-player-bar"`) — the recurring
  cross-page component: round play/pause button (signal red), inline waveform,
  elapsed/total time. This is the single most reused component in the product —
  build it once, well, and reuse everywhere a track appears (battle detail,
  beat detail, shop listing, profile, results).
- **Waveform** (`data-component="waveform"` / `waveform-mini`) — bars colored
  `border-default` (unplayed) → `action-primary` (played) → `accent` (scrub/hover).

## Layout

- Base spacing unit: `4px`.
- Section padding: `56–64px` (desktop).
- Card radius: `10–16px`. Pill radius: `100px`.
- Max content width: `1440px`, centered, with a `1px border-default` left/right
  rail (visible as a vertical line on wide viewports).
- Mobile: single-column reflow of the same components/type/color system —
  the mockups include a `375px` mobile frame per page as the reference
  breakpoint, not a separate design.
