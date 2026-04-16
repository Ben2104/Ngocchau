import type { PropsWithChildren } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { AppHeader } from "@/components/layout/app-header";

interface DashboardShellProps extends PropsWithChildren {
  userEmail?: string;
}

export function DashboardShell({ children, userEmail }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-grid-pattern">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-3xl border border-stone-200 bg-white/90 p-4 shadow-panel">
          <div className="mb-6 rounded-2xl bg-stone-950 px-4 py-5 text-stone-50">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Ngọc Châu</p>
            <h1 className="mt-2 text-lg font-semibold">Gold Shop System</h1>
            <p className="mt-1 text-sm text-stone-300">Quản trị bán hàng và vận hành hằng ngày.</p>
          </div>
          <SidebarNav />
        </aside>
        <main className="space-y-6">
          <AppHeader email={userEmail} />
          {children}
        </main>
      </div>
    </div>
  );
}

