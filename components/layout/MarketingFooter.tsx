import Link from "next/link";

export function MarketingFooter({
  cta,
}: {
  cta?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-8 py-10 sm:px-16">
      <div className="font-sans text-xs text-faint">© 2026 AUXDROP</div>
      {cta ? (
        <Link
          href={cta.href}
          className="rounded-button bg-signal px-6 py-3.5 font-sans text-sm font-bold text-on-dark"
        >
          {cta.label}
        </Link>
      ) : (
        <div className="flex gap-5 font-sans text-xs text-faint">
          <Link href="/terms" className="hover:text-muted">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-muted">
            Privacy
          </Link>
        </div>
      )}
    </div>
  );
}
