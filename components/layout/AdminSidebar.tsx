"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./Wordmark";

interface NavItem {
  label: string;
  href?: string; // omitted until that admin page exists (Phase 2/3 tools)
}

const NAV: NavItem[] = [
  { label: "Admin Dashboard", href: "/admin" },
  { label: "Battle Management", href: "/admin/battles" },
  { label: "User Management", href: "/admin/users" },
  { label: "Submission Review", href: "/admin/submissions" },
  { label: "Tournament Management", href: "/admin/tournaments" },
  { label: "Shop Moderation" },
  { label: "Release Management", href: "/admin/releases" },
  { label: "Royalty Management" },
  { label: "CMS" },
  { label: "Financial Reporting" },
  { label: "Dispute Resolution", href: "/admin/disputes" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-[220px] flex-shrink-0 flex-col gap-1 border-r border-border bg-primary p-4">
      <div className="mb-3 px-2">
        <Wordmark size="small" href="/admin" />
        <div className="mt-1 font-sans text-[11px] font-semibold text-faint">Admin</div>
      </div>
      {NAV.map((item) => {
        const active = item.href && pathname === item.href;
        if (!item.href) {
          return (
            <span
              key={item.label}
              className="rounded-button px-3 py-2.5 font-sans text-[13px] font-semibold text-faint"
              aria-disabled
            >
              {item.label}
            </span>
          );
        }
        return (
          <Link
            key={item.label}
            href={item.href}
            className={
              "rounded-button px-3 py-2.5 font-sans text-[13px] font-semibold " +
              (active ? "bg-elevated text-on-dark" : "text-muted hover:bg-elevated")
            }
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
