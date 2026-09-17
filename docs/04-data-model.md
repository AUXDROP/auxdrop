# AUXDROP — Data Model (inferred)

This is **inferred** from the mockup pages' own data references (the `sc-for`
loop variables in each `.dc.html` file, e.g. `{{ battles }}`, `{{ submissions }}`)
plus the business plan. It is a starting point for schema design, not a final
spec — validate field names/types with the user before treating anything here
as locked in.

## Core entities

### User
The base account. Specializes into beatmaker, audience member, sponsor/brand,
or industry (A&R/sync) — likely a `role` or `type` field, or separate profile
tables joined to a shared `User`.

- id, email, handle/username, avatar, role(s), created_at
- auth state: email_verified, password (or OAuth)
- Onboarding fields: genre(s), primary role (producer/audience/brand/industry)

### BeatmakerProfile
Public-facing profile for a beatmaker (`Beatmaker Profile.dc.html`).

- user_id (FK)
- rank (global + genre), record (wins–losses, e.g. `8–2`)
- bio, socials
- badges: `commercial-badges` component — OFFICIAL DSP RELEASE, SOUND KIT
  CONTRIBUTOR, SYNC ROSTER QUALIFIED, LICENSE AVAILABLE: NON-EXCLUSIVE /
  EXCLUSIVE / STEMS
- follower/following relationships (`Following.dc.html`)

### Battle
A single challenge instance (`battles` data loop; `Beat Battles.dc.html`,
`Battle Detail.dc.html`, `Battle Management.dc.html`).

- id, title/prompt (e.g. "Flip This Sample"), genre
- status: OPEN / UPCOMING / PENDING / COMPLETED / ERROR (shared status enum,
  see design system)
- entry_fee (default $25), prize_pool (derived or set), entrant_count
- starts_at, duration (60 min default), submission_deadline
- judging_type: blind community / judge panel
- sponsor_id (nullable, FK → Sponsor) — for sponsored challenges
- bracket structure for tournament-style battles (`bracket` data loop —
  `Championship.dc.html`)

### Submission
A beatmaker's entry into a Battle (`submissions` data loop; `Submission Review.dc.html`).

- id, battle_id (FK), user_id (FK), track_id (FK, see Track), submitted_at
- status: pending review / accepted / flagged / disqualified
- `submissionStates` — the mockups have a dedicated states loop, meaning this
  needs an explicit state machine, not just a boolean.

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
`Results.dc.html`, `Charts.dc.html`).

- battle_id, user_id, placement, score/vote breakdown, advanced (bool, for
  bracket play)
- Feeds into BeatmakerProfile's aggregate rank + win/loss record

### Release
A commercial output — season compilation album (`releases` data loop;
`Releases.dc.html`, `Release Management.dc.html`).

- id, title (e.g. "Auxdrop Vol. X"), season, tracklist (Track IDs)
- DSP distribution status/links (Spotify/Apple Music/Tidal)
- royalty_split config (references RoyaltySplit)

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

- id, company_name, sponsorship packages purchased, sponsored battle_ids

### IndustryContact
A&R/sync/label industry account (`Industry Portal.dc.html`, `catalog` /
`pathways` loops) — access to the sync catalog and talent discovery.

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

## Open questions to resolve with the user before finalizing schema

- Exact judging mechanism: pure community vote vs. judge panel vs. hybrid —
  affects whether a `Vote`/`Judgment` entity is needed alongside Submission.
- Whether Battles are always 1-shot or also bracket/tournament (`bracket` data
  suggests tournament support is needed at least for Championship).
- Payment processor and payout provider (affects Wallet/Transaction fields).
- Whether "Industry Portal" and "Sponsor Portal" are separate account types or
  a permission/role on the base User.
