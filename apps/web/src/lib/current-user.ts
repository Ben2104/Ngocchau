import { ROLE_LABELS, ROLE_PERMISSION_MAP } from "@gold-shop/constants";
import type { AuthenticatedUser, DisplayPerson } from "@gold-shop/types";
import { getInitials } from "@gold-shop/utils";

export interface CurrentUserProfile {
  identity: DisplayPerson;
  role: AuthenticatedUser["role"];
  roleLabel: string;
  permissions: (typeof ROLE_PERMISSION_MAP)[AuthenticatedUser["role"]];
}

export function buildCurrentUserProfile(user: AuthenticatedUser): CurrentUserProfile {
  const fullName = user.fullName?.trim() || user.email.split("@")[0] || "Người dùng nội bộ";

  return {
    identity: {
      id: user.id,
      fullName,
      initials: getInitials(fullName),
      avatarUrl: null,
      email: user.email,
      subtitle: ROLE_LABELS[user.role]
    },
    role: user.role,
    roleLabel: ROLE_LABELS[user.role],
    permissions: ROLE_PERMISSION_MAP[user.role]
  };
}
