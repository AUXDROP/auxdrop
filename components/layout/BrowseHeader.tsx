import Link from "next/link";
import { Wordmark } from "./Wordmark";

export interface BrowseNavItem {
  label: string;
  href?: string; // omitted until that route exists — rendered inert, not a dead link
}

function NavLink({ item, active }: { item: BrowseNavItem; active: boolean }) {
  if (!item.href) {
    return (
      <span className="font-sans text-sm font-semibold text-faint" aria-disabled>
        {item.label}
      </span>
    );
  }
  return (
    <Link
      href={item.href}
      className={
        "font-sans text-sm font-semibold " +
        (active ? "text-on-dark" : "text-muted hover:text-on-dark")
      }
    >
      {item.label}
    </Link>
  );
}

// Header for logged-out browsing pages (Beat Battles, Charts, Beatmakers,
// Beatmaker Profile) — each has a different, smaller nav than the marketing
// pages, per design/mockups/pages/{Beat Battles,Charts,Beatmakers,
// Beatmaker Profile}.dc.html.
export function BrowseHeader({
  navItems,
  active,
  cta,
}: {
  navItems: BrowseNavItem[];
  active?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <header className="flex items-center justify-between border-b border-border px-8 py-5 sm:px-16">
      <Wordmark />
      <nav className="hidden items-center gap-7 md:flex">
        {navItems.map((item) => (
          <NavLink key={item.label} item={item} active={item.label === active} />
        ))}
      </nav>
      {cta ? (
        <Link
          href={cta.href}
          className="rounded-button bg-signal px-5 py-2.5 font-sans text-[13px] font-bold text-on-dark"
        >
          {cta.label}
        </Link>
      ) : (
        <span />
      )}
    </header>
  );
}
