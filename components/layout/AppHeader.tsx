import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { signOut } from "@/app/auth/actions";

// Wallet and Analytics aren't built yet (Phase 2 / not yet scheduled) —
// rendered inert like the marketing header's not-yet-built nav items.
// Activity/Messages/Following/Notifications are real as of step 5.
export function AppHeader({ isAdmin }: { isAdmin?: boolean }) {
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
        <Link
          href="/activity"
          className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
        >
          Activity
        </Link>
        <Link
          href="/messages"
          className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
        >
          Messages
        </Link>
        <Link
          href="/following"
          className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
        >
          Following
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
      <div className="flex items-center gap-5">
        {isAdmin && (
          <Link
            href="/admin"
            className="font-sans text-sm font-semibold text-accent hover:text-on-dark"
          >
            Admin
          </Link>
        )}
        <Link
          href="/notifications"
          className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
        >
          Notifications
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
