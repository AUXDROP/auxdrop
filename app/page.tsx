import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-8 text-center">
      <h1 className="font-display text-2xl font-extrabold text-on-dark">
        Auxdrop — scaffold
      </h1>
      <p className="max-w-md font-sans text-sm text-muted">
        The marketing homepage hasn&apos;t been built yet (see build order,
        step 3 in <code className="text-faint">docs/05-build-plan.md</code>).
        For now, see the component library.
      </p>
      <Link
        href="/dev/components"
        className="font-sans text-sm font-bold text-signal underline underline-offset-4"
      >
        View component library →
      </Link>
    </div>
  );
}
