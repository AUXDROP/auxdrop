import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardBody, CardTitle } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard — AUXDROP",
};

// Not one of the six auth pages this step builds — added as the real
// post-login/onboarding landing target (the mockups link there, but the
// actual Dashboard is build-order step 4). Same "not built yet" treatment
// as the root page.tsx placeholder.
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1440px] border-x border-border bg-primary">
        <AppHeader />
        <div className="px-8 py-16 sm:px-16">
          <h1 className="mb-2 font-display text-2xl font-extrabold text-on-dark">
            Welcome to AUXDROP{dbUser ? `, ${dbUser.handle}` : ""}.
          </h1>
          <p className="mb-8 max-w-md font-sans text-sm text-muted">
            The real dashboard (active battles, stats, quick actions) hasn&apos;t
            been built yet — that&apos;s build-order step 4.
          </p>
          <Card className="max-w-sm">
            <CardTitle>You&apos;re signed in</CardTitle>
            <CardBody>
              Role: {dbUser?.role ?? "unknown"}
              <br />
              Email: {user.email}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
