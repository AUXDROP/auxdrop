import Link from "next/link";
import { Wordmark } from "./Wordmark";

interface NavItem {
  label: string;
  href?: string; // omitted until that route exists — rendered inert, not a dead link
}

const HOME_NAV: NavItem[] = [
  { label: "Beat Battles" },
  { label: "Charts" },
  { label: "Beatmakers" },
  { label: "Shop" },
  { label: "Releases" },
  { label: "TV" },
];

const SUBPAGE_NAV: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Beat Battles" },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
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

export function MarketingHeader({
  variant = "home",
  active,
}: {
  variant?: "home" | "subpage";
  active?: string;
}) {
  const nav = variant === "home" ? HOME_NAV : SUBPAGE_NAV;

  return (
    <header className="flex items-center justify-between border-b border-border px-8 py-5 sm:px-16">
      <Wordmark />
      <nav className="hidden items-center gap-7 md:flex">
        {nav.map((item) => (
          <NavLink key={item.label} item={item} active={item.label === active} />
        ))}
      </nav>
      {variant === "home" ? (
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-button bg-signal px-5 py-2.5 font-sans text-[13px] font-bold text-on-dark"
          >
            Get early access
          </Link>
        </div>
      ) : (
        // The mockup points this at Battle Detail, which doesn't exist yet —
        // routes to signup instead so the one real thing you can do (create
        // an account) is never a dead end.
        <Link
          href="/signup"
          className="rounded-button bg-signal px-5 py-2.5 font-sans text-[13px] font-bold text-on-dark"
        >
          Enter a Battle
        </Link>
      )}
    </header>
  );
}
