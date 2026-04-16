import { ROLE_TONES } from "@gold-shop/constants";
import type { AppRole, DisplayPerson } from "@gold-shop/types";

import { StatusPill } from "@/components/common/status-pill";
import { UserAvatar } from "@/components/common/user-avatar";
import { SignOutButton } from "@/components/layout/sign-out-button";

interface SidebarProfileCardProps {
  identity: DisplayPerson;
  role: AppRole;
  roleLabel: string;
}

export function SidebarProfileCard({ identity, role, roleLabel }: SidebarProfileCardProps) {
  return (
    <div className="mt-auto border-t border-stone-100 pt-6">
      <div className="rounded-2xl bg-[var(--color-surface-muted)] p-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={identity.fullName}
            initials={identity.initials}
            avatarUrl={identity.avatarUrl}
            className="h-10 w-10 border-2 border-white"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[var(--color-foreground-strong)]">{identity.fullName}</p>
            <p className="truncate text-xs text-[var(--color-foreground-muted)]">{roleLabel}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <StatusPill label={roleLabel} tone={ROLE_TONES[role]} className="px-2.5 py-1 text-[11px]" />
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
