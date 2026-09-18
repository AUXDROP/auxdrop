import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { signOut } from "@/app/auth/actions";

// Wallet, Analytics, and Notifications aren't built yet (Phase 2 / step 5) —
// rendered inert like the marketing header's not-yet-built nav items.
export function AppHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border px-8 py-5 sm:px-16">
      <Wordmark size="small" href="/dashboard" />
      <nav className="hidden items-center gap-6 md:flex">
        <Link
          href="/dashboard"
          className="font-sans text-sm font-semibold text-on-dark"
        >
          Dashboard
        </Link>
        <span className="font-sans text-sm font-semibold text-faint" aria-disabled>
          Wallet
        </span>
        <span className="font-sans text-sm font-semibold text-faint" aria-disabled>
          Analytics
        </span>
        <Link
          href="/settings"
          className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
        >
          Settings
        </Link>
      </nav>
      <form action={signOut}>
        <button
          type="submit"
          className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
        >
          Sign out
        </button>
      </form>
    </header>
  );
}
