import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { signOut } from "@/app/auth/actions";

export function AppHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border px-8 py-5 sm:px-16">
      <Wordmark size="small" href="/dashboard" />
      <nav className="flex items-center gap-6">
        <Link
          href="/dashboard"
          className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
        >
          Dashboard
        </Link>
        <Link
          href="/settings"
          className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
        >
          Settings
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="font-sans text-sm font-semibold text-muted hover:text-on-dark"
          >
            Sign out
          </button>
        </form>
      </nav>
    </header>
  );
}
