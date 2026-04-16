import type { User } from "@supabase/supabase-js";

import { ROLE_LABELS, ROLE_PERMISSION_MAP } from "@gold-shop/constants";
import type { AppRole, DisplayPerson } from "@gold-shop/types";
import { getInitials } from "@gold-shop/utils";

function isAppRole(value: unknown): value is AppRole {
  return value === "owner" || value === "manager" || value === "staff" || value === "accountant";
}

function normalizeRole(user: User): AppRole {
  const metadataRole = user.app_metadata?.role ?? user.user_metadata?.role;

  return isAppRole(metadataRole) ? metadataRole : "owner";
}

function resolveDisplayName(user: User): string {
  const metadataName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.user_metadata?.display_name ??
    user.email?.split("@")[0];

  return typeof metadataName === "string" && metadataName.trim() !== "" ? metadataName : "Người dùng nội bộ";
}

export interface CurrentUserProfile {
  identity: DisplayPerson;
  role: AppRole;
  roleLabel: string;
  permissions: typeof ROLE_PERMISSION_MAP.owner;
}

export function buildCurrentUserProfile(user: User): CurrentUserProfile {
  const role = normalizeRole(user);
  const fullName = resolveDisplayName(user);

  return {
    identity: {
      id: user.id,
      fullName,
      initials: getInitials(fullName),
      avatarUrl: typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : null,
      email: user.email,
      subtitle: ROLE_LABELS[role]
    },
    role,
    roleLabel: ROLE_LABELS[role],
    permissions: ROLE_PERMISSION_MAP[role]
  };
}
