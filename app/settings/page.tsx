import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { createClient } from "@/lib/supabase/server";
import { AccountSettings } from "./AccountSettings";

export const metadata: Metadata = {
  title: "Settings — AUXDROP",
};

// The mockup's sidebar splits settings across 7 sections; only "Account"
// (email, password, delete account) is built here per instructions — the
// rest depend on data (Profile) or infra (Payment Methods) from later steps.
const SECTIONS = [
  "Account",
  "Profile",
  "Security",
  "Notifications",
  "Privacy",
  "Payment Methods",
  "Preferences",
];

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-[1440px] border-x border-border bg-primary">
        <AppHeader />
        <div className="grid grid-cols-1 gap-8 px-8 py-14 sm:grid-cols-[220px_1fr] sm:gap-14 sm:px-16">
          <div className="flex flex-col gap-1">
            {SECTIONS.map((section) => {
              const active = section === "Account";
              return (
                <div
                  key={section}
                  className={
                    "rounded-button px-4 py-3 font-sans text-sm font-semibold " +
                    (active ? "bg-elevated text-on-dark" : "text-faint")
                  }
                >
                  {section}
                </div>
              );
            })}
          </div>
          <div>
            <h1 className="mb-8 font-display text-3xl font-extrabold text-on-dark">
              Account
            </h1>
            <AccountSettings email={user.email ?? ""} />
          </div>
        </div>
      </div>
    </div>
  );
}
