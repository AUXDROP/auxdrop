# AUXDROP — Business Overview

This file gives Claude Code the "why" behind the product so implementation decisions
(what's core vs. nice-to-have, what copy/tone to use, what a feature is actually for)
stay aligned with the business model. It is a condensed version of the founder's
business plan — go to the source docs in `docs/source/` for full detail if needed.

## One-liner

AUXDROP is a competitive music-production battle network that turns beatmakers'
work into commercial assets — not just a beat store, and not a winner-takes-all
contest where losers leave empty-handed.

## Who it's for

- **Beatmakers** — compete, get ranked, get released, get paid. Even non-winners
  can have tracks selected for commercial output.
- **Audiences** — watch live 60-minute battles, blind-judged brackets, and discover
  new music in real time.
- **Brands** — sponsor challenges, place products, get co-branded releases.
- **Industry (A&R / sync / labels)** — source pre-vetted talent with a verified
  competitive track record and pre-cleared, usable music.

## The core loop: 60-Minute Battle

1. **Challenge** — AUXDROP posts a prompt (e.g. "Flip This Sample") with a 60-minute timer.
2. **Create & Submit** — beatmaker produces a track, pays a **$25 entry fee**, submits one audio file.
3. **Blind Judging** — submissions are judged anonymously (community or judges) to remove clout bias.
4. **Ranking** — win/loss record is public (e.g. `#03 GLOBAL`, `8–2`).
5. **Commercial Selection** — top tracks qualify for monetization regardless of whether they won.

This loop (**Compete → Rank → Release → Monetize**) is the spine of the product —
everything else (shop, releases, sync catalog, wallet) exists to pay off a battle result.

## The 5 commercial asset outputs

These are the actual product surfaces that need to exist, not just marketing ideas:

1. **Compilation Albums** — curated season compilations distributed to Spotify / Apple
   Music / Tidal, with master royalty splits back to creators.
2. **Sound Kits** — winner co-branded drum kits / sample loops / 808 packs, sold
   in-platform with a sales commission to the contributing producers.
3. **Beat Shop** — instant post-battle licensing (Non-Exclusive, Exclusive, Stems),
   surfaced right where live audience traffic already is.
4. **Sync & Licensing Catalog** — pre-cleared tracks pitched to music supervisors,
   game studios, and TV/ad production.
5. **Industry Access** — producer camps, studio sessions, A&R intros, gated by
   verified competitive performance.

## Revenue model (4 streams)

- **Battle entry fees** — direct (e.g. 32 entrants × $25 = $800 pool).
- **Brand sponsorships** — co-branded challenge packages (e.g. $1,000+ per sponsored
  challenge with plugin/hardware prizes).
- **Commercial asset commission** — platform cut of compilation streaming royalties,
  sound kit sales, and beat licenses.
- **Audience & media revenue** — event ticketing, premium livestream access, brand
  partnerships.

## The flywheel

```
More Beatmakers Enter
        ↓
Structured Battles Occur
        ↓
Commercial Assets Created (Releases, Sound Kits, Beat Licenses)
        ↓
Audience Discovers & Streams Music
        ↓
Commercial Revenue & Sponsorship Value Increases
        ↓
Larger Cash Prizes & High-Value Industry Opportunities
        ↓
More Beatmakers Join
```

## Phased rollout — **build in this order**

This is the single most important thing for scoping build work. Do not build
Phase 2/3 surfaces before Phase 1 is solid — they depend on Phase 1 data
(verified battle results, ranked profiles) to mean anything.

- **Phase 1 — Core Engine (build first):**
  Online 60-minute battles, cash prizes, verified profiles & charts, season
  compilation releases.
  → Maps to: Home, How It Works, Sign Up / Login / Onboarding, Beat Battles,
  Battle Detail, Submission flow, blind judging, Results, Charts (rankings),
  Beatmaker Profile, Dashboard, Releases, Notifications.

- **Phase 2 — Direct Monetization:**
  AUXDROP Shop launch — beat licensing + co-branded winner sound kits.
  → Maps to: Shop, Sound Kits, Cart, Checkout, Licenses, Wallet.

- **Phase 3 — Enterprise & Live:**
  Pre-cleared sync catalog, major brand partnerships, tournaments/regional
  competitions, live championships.
  → Maps to: Sponsor Portal, Industry Portal, Championship, TV (livestream),
  Hall of Fame.

Admin/ops surfaces (Admin Dashboard, Battle/Release/Royalty Management, Dispute
Resolution, User Management, Financial Reporting, CMS, Marketplace Moderation,
Submission Review, Analytics) should be built **alongside whichever phase they
support** — e.g. Battle Management and Submission Review are needed as soon as
Phase 1 battles go live, Royalty Management isn't needed until Phase 2.

## What actually motivates producers (design implication)

Producers are pragmatic business operators, not just seeking "exposure." Rank,
copy, and notification design should foreground concrete outcomes in this order:
1. Direct monetization pathways (cash, royalties, sales commission)
2. IP leverage (owning/controlling what happens to their track after a battle)
3. Verified industry access (A&R, sync, camps)

Any feature or piece of UI copy that leans only on "exposure" or "community" is
underselling the actual value prop and should tie back to one of the three above.
