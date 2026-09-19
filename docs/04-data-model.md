# AUXDROP — Data Model (inferred)

This is **inferred** from the mockup pages' own data references (the `sc-for`
loop variables in each `.dc.html` file, e.g. `{{ battles }}`, `{{ submissions }}`)
plus the business plan. It is a starting point for schema design, not a final
spec — validate field names/types with the user before treating anything here
as locked in.

## Core entities

### User
The base account — single auth identity for everyone, backed by Supabase
Auth (`User.id` matches the Supabase `auth.users.id` UUID; email verification,
password/OAuth are handled by Supabase Auth itself, not duplicated here).
Role-specific data lives in a separate 1:1 profile table per role rather
than as columns on `User` (see `BeatmakerProfile` below; `SponsorProfile` /
`IndustryProfile` follow the same pattern whenever they're built).

- id (uuid, matches `auth.users.id`), email, handle/username, avatar, created_at
- `role`: enum — `BEATMAKER`, `AUDIENCE` (live now); `SPONSOR`, `INDUSTRY`
  reserved (values exist so the enum never needs a migration, but there is no
  signup UI for them — see "Resolved decisions" below)
- Onboarding fields: genre(s) — deferred until the Onboarding page is built

### BeatmakerProfile
Public-facing profile for a beatmaker (`Beatmaker Profile.dc.html`).

- user_id (FK)
- rank (global + genre), record (wins–losses, e.g. `8–2`)
- bio, socials
- badges: `commercial-badges` component — OFFICIAL DSP RELEASE, SOUND KIT
  CONTRIBUTOR, SYNC ROSTER QUALIFIED, LICENSE AVAILABLE: NON-EXCLUSIVE /
  EXCLUSIVE / STEMS
- follower/following relationships (`Following.dc.html`)
- `location` (free text), `genres` (`String[]`, plain strings — same
  precedent as `Battle.genre` — not an enum, so the starter list in
  `lib/genres.ts` can grow without a migration), `isVerified` (staff-set
  only via `/admin/users`, no self-serve UI). Added 2026-09-19; captured in
  the onboarding form (also used to edit an existing profile, not just at
  signup) and shown on `/beatmakers/:handle` and the `/beatmakers` directory,
  which also filters by genre.
- **Still not modeled**: commercial badges (needs `Release`/`SoundKit`/
  license entities — Phase 2/3) and career earnings (needs Wallet/
  Transaction, step 7). Omitted rather than faked.

### Battle
A single challenge instance (`battles` data loop; `Beat Battles.dc.html`,
`Battle Detail.dc.html`, `Battle Management.dc.html`).

- id, title/prompt (e.g. "Flip This Sample"), genre
- status: OPEN / UPCOMING / PENDING / COMPLETED / ERROR (shared status enum,
  see design system)
- entry_fee (default $25), prize_pool (derived or set), entrant_count
- starts_at, duration (60 min default), submission_deadline
- `judging_type`: enum — `COMMUNITY | JUDGE_PANEL | HYBRID`, configurable
  per-battle, defaults to `COMMUNITY` for Phase 1. Determines how `Judgment`
  rows for this battle get aggregated into a result; judge assignments
  (`BattleJudge`) only apply when this isn't `COMMUNITY`.
- `judging_deadline` (nullable) — when community/judge voting closes. Added
  when the voting UI was built (see "Community judging" below); optional,
  a battle without one is closed out manually by an admin.
- sponsor_id (nullable, FK → Sponsor) — for sponsored challenges
- `description` (plain text, the Battle Detail "CHALLENGE" paragraph —
  `title` stays the short prompt) and `bpm` (nullable `Int`, informational
  only — not enforced against a submitted track's actual tempo; there's no
  BPM-detection in `lib/audio-client.ts`, that would be a separate audio
  analysis feature). Both added 2026-09-19, editable from `CreateBattleForm`,
  shown on `/battles/:id`.
- Tournament/bracket play (`Championship.dc.html`) is **not** modeled on
  `Battle` — see the `Tournament` note under BattleResult below.

### Submission
A beatmaker's entry into a Battle (`submissions` data loop; `Submission Review.dc.html`).

- id, battle_id (FK), user_id (FK), track_id (FK, see Track), submitted_at
- status: pending review / accepted / flagged / disqualified
- `submissionStates` — the mockups have a dedicated states loop, meaning this
  needs an explicit state machine, not just a boolean.

### Judgment
A single judgment cast on a Submission — by a community member or an
assigned judge, depending on the Battle's `judging_type`. One entity covers
both cases rather than separate `Vote`/`Judgment` tables, so a battle can be
pure community, a judge panel, or a hybrid of both without a schema change.

- id, battle_id (FK), submission_id (FK), judged_by (FK → User)
- `judge_role`: enum — `COMMUNITY | JUDGE` (which capacity this judgment was
  cast in)
- score (or rank), optional criteria breakdown
- one judgment per (submission, judged_by) pair

### BattleJudge
Assigns a `User` as a judge for a specific Battle. Only relevant when that
Battle's `judging_type` is `JUDGE_PANEL` or `HYBRID` — empty for `COMMUNITY`
battles. Judge assignment UI lives at `/admin/battles/:id` (assign/remove by
handle).

- battle_id (FK), user_id (FK)

### Track / Beat
The actual audio asset (`Beat Detail.dc.html`, referenced everywhere the audio
player appears).

- id, title, audio_file_url, waveform_data, duration
- creator_id (FK → BeatmakerProfile)
- origin: battle submission vs. standalone shop upload
- licensing: available license types + prices (Non-Exclusive / Exclusive / Stems)
- commercial flags: DSP-released, sound-kit-sourced, sync-roster-qualified

### BattleResult / Ranking
Outcome of a battle for a participant (`outcomes`, `resultsStates` data loops;
`Results.dc.html`, `Charts.dc.html`). Placement/score is computed from that
battle's `Judgment` rows, aggregated per `judging_type`.

- battle_id, user_id, placement, score/vote breakdown, advanced (bool)
- Feeds into BeatmakerProfile's aggregate rank + win/loss record
- **Tournament/Championship** (Phase 3 only): a separate `Tournament` entity
  composes ordinary (always 1-shot) `Battle` rows into rounds/matchups.
  `advanced` is what lets a participant's result in one round's `Battle`
  qualify them for the next round's `Battle`. `Battle` itself never gets
  bracket/round fields — deferred entirely until Phase 3.

### Release
A commercial output — season compilation album (`releases` data loop;
`Releases.dc.html`, `Release Management.dc.html`). Built 2026-09-19.

- id, title (e.g. "AUXDROP Vol. X"), season (free-text label, currently just
  baked into most titles), status (`DRAFT | SCHEDULED | LIVE`), releaseDate
- DSP distribution links (Spotify/Apple Music/Tidal) — plain URLs an admin
  pastes in once the release is actually live elsewhere; nothing here
  submits to a DSP
- tracklist via `ReleaseTrack` (ordered join table, a Track can appear on
  more than one Release)
- royalty_split config via `RoyaltySplit` — recorded config only, doesn't
  move money (that's Wallet/Transaction, step 7); `userId` null means the
  platform's share. No `SoundKit` reference — `SoundKit` isn't modeled yet.
  Admin UI shows a running total but doesn't hard-enforce it summing to 100.
- Public `/releases` lists `LIVE` releases only; `/admin/releases` manages
  status, DSP links, tracklist, and royalty splits.

### SoundKit
Winner co-branded kit (`Sound Kits.dc.html`).

- id, title, season/battle reference, contributor Track/BeatmakerProfile IDs
- price, sales_count, commission_rate

### License
A purchased usage right on a Track (`licenses` data loop; `Licenses.dc.html`).

- id, track_id, buyer_id, type (non-exclusive/exclusive/stems), price, purchased_at

### ShopListing
A track/kit available for purchase (`listings` data loop; `Shop.dc.html`,
`Marketplace Moderation.dc.html`).

- id, item type (track license / sound kit), price, moderation_status

### Order / Cart / CartItem
Standard commerce flow (`Cart.dc.html`, `Checkout.dc.html`).

- cart: user_id, items[]
- order: id, user_id, items[], total, payment_status, created_at

### Wallet / Transaction
Beatmaker earnings ledger (`walletStates` data loop; `Wallet.dc.html`).
**Not designed yet** — payment processor direction is Stripe Connect
(pending confirmation of operating countries), targeted for build-order
step 7. Until then, don't design anything elsewhere in the schema that
would conflict with Connect's connected-account/split-payment model.

- wallet: user_id, balance, pending_balance
- transaction: id, wallet_id, type (entry fee, prize payout, royalty, kit
  commission, license sale, payout/withdrawal), amount, status, created_at

### RoyaltySplit
Configured payout shares for a Release or SoundKit (`royalties` data loop;
`Royalty Management.dc.html`).

- id, release_id or sound_kit_id, beneficiary (platform vs. creator), percentage

### Dispute
Judging/content dispute (`disputes`, `flagged` data loops; `Dispute Resolution.dc.html`).

- id, related battle_id/submission_id, filed_by, reason, status, resolution

### Sponsor
Brand sponsoring challenges (`packages` data loop; `Sponsor Portal.dc.html`).
Phase 3. Sponsor accounts are **staff-onboarded** (sales-driven deals, per
the business plan), not self-serve signup — created via an admin tool or
seed script once Sponsor Portal is built, using the reserved `User.role =
SPONSOR`. `SponsorProfile` (this entity, 1:1 with `User`) isn't designed
yet; built alongside Sponsor Portal in Phase 3.

- id, company_name, sponsorship packages purchased, sponsored battle_ids

### IndustryContact
A&R/sync/label industry account (`Industry Portal.dc.html`, `catalog` /
`pathways` loops) — access to the sync catalog and talent discovery.
Phase 3. Same staff-onboarded pattern as Sponsor (curated introductions, not
public signup) — reserved `User.role = INDUSTRY`, `IndustryProfile` not
designed yet.

### Notification
`notifications` data loop; `Notifications.dc.html`.

- id, user_id, type, payload, read_at, created_at

### Comment
`Comments.dc.html` — threaded comments attachable to a Battle, Track, or Release.

- id, parent_type, parent_id, user_id, body, created_at

## Shared enums worth centralizing early

- **Status pill enum**: `OPEN | UPCOMING | PENDING | ERROR | LICENSING_REVIEW | COMPLETED`
  — reused across Battle, Submission, Order, Dispute. Model as one shared enum/
  component rather than one-off per entity if the framework allows it.
- **License type enum**: `NON_EXCLUSIVE | EXCLUSIVE | STEMS`
- **Commercial badge enum**: `OFFICIAL_DSP_RELEASE | SOUND_KIT_CONTRIBUTOR |
  SYNC_ROSTER_QUALIFIED | LICENSE_AVAILABLE_*`
- **Judging type enum**: `COMMUNITY | JUDGE_PANEL | HYBRID` — on `Battle`.
- **Judge role enum**: `COMMUNITY | JUDGE` — on `Judgment`.

## Resolved decisions

The four open questions below have been resolved with the user (2026-09-17).

1. **Sponsor/Industry — separate tables or a role on `User`?** Both: `User`
   carries a `role` enum for auth/access control (`BEATMAKER`, `AUDIENCE` live;
   `SPONSOR`, `INDUSTRY` reserved), and role-specific data lives in a 1:1
   profile table per role (`BeatmakerProfile` now; `SponsorProfile` /
   `IndustryProfile` later), the same pattern throughout. Sponsor/Industry
   accounts are staff-onboarded, not self-serve — no signup UI for those two
   roles.
2. **Judging mechanism — community vote vs. judge panel vs. hybrid?** One
   `Judgment` entity handles all three, discriminated by `judge_role` and
   aggregated per the battle's `judging_type` (`COMMUNITY | JUDGE_PANEL |
   HYBRID`), configurable per-battle from day one. Default for Phase 1
   battles is `COMMUNITY`. `BattleJudge` assigns judges when needed.
   Voting UI (2026-09-19): any authenticated user (except the submission's
   own creator) can cast a 1–5 `Judgment` on `PENDING` battles at
   `/battles/:id`; `JUDGE_PANEL` battles restrict voting to users assigned
   via `BattleJudge`. Results are ranked by weighted average score
   (`lib/judging.ts`) — `HYBRID` weights judge votes at 70% and community
   votes at 30% (named constants `JUDGE_WEIGHT`/`COMMUNITY_WEIGHT`, tunable),
   reflecting that `JUDGE_PANEL`/`HYBRID` exist mainly for sponsored battles
   where a brand is paying for credentialed judging. The admin results
   screen at `/admin/battles/:id` pre-fills placement from this computed
   ranking but still allows a manual override per submission (dispute
   resolution, ties).
3. **Are Battles always 1-shot, or also bracket/tournament?** `Battle` is
   always 1-shot. Bracket/tournament structure is a separate `Tournament`
   entity (Phase 3 only) that composes ordinary `Battle` rows via
   `BattleResult.advanced` — no fields added to `Battle` itself.
4. **Payment processor and payout provider?** Direction is Stripe Connect,
   pending the user's confirmation of operating countries. No payment
   integration work yet; `Wallet`/`Transaction`/`Order` design is deferred to
   build-order step 7 and must not be designed in a way that conflicts with
   Connect's connected-account/split-payment model in the meantime.
