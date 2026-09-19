import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-canvas">
      <AdminSidebar />
      <div className="max-w-[1220px] flex-1">{children}</div>
    </div>
  );
}
