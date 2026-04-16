import type { PropsWithChildren } from "react";

import { SidebarProfileCard } from "@/components/layout/sidebar-profile-card";
import { BrandMark } from "@/components/layout/nav-icon";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import type { CurrentUserProfile } from "@/lib/current-user";

interface DashboardShellProps extends PropsWithChildren {
  currentUser: CurrentUserProfile;
}

export function DashboardShell({ children, currentUser }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-surface-base)]">
      <div className="mx-auto min-h-screen max-w-[1600px] lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
        <aside className="bg-shell border-b border-[var(--color-border-soft)] px-4 py-6 lg:border-b-0 lg:border-r lg:px-4 lg:py-8">
          <div className="flex h-full flex-col">
            <div className="mb-6 flex items-center gap-3 rounded-2xl px-4 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-brand">
                <BrandMark className="h-[18px] w-[18px]" />
              </div>
              <div>
                <p className="text-lg font-black text-[var(--color-brand-gold)]">Tiệm Vàng</p>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-foreground-muted)]">
                  Phòng điều hành
                </p>
              </div>
            </div>

            <div className="overflow-x-auto pb-2 lg:overflow-visible lg:pb-0">
              <SidebarNav />
            </div>

            <SidebarProfileCard
              identity={currentUser.identity}
              role={currentUser.role}
              roleLabel={currentUser.roleLabel}
            />
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
