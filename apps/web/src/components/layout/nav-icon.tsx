import {
  Gem,
  History,
  LayoutGrid,
  Settings,
  Upload,
  Users
} from "lucide-react";

import type { NavIconKey } from "@gold-shop/types";

interface NavIconProps {
  icon: NavIconKey;
  className?: string;
}

const ICON_MAP = {
  dashboard: LayoutGrid,
  upload: Upload,
  history: History,
  users: Users,
  settings: Settings
} satisfies Record<NavIconKey, typeof LayoutGrid>;

export function NavIcon({ icon, className }: NavIconProps) {
  const Icon = ICON_MAP[icon];

  return <Icon className={className} strokeWidth={2.1} />;
}

export function BrandMark({ className }: { className?: string }) {
  return <Gem className={className} strokeWidth={2} />;
}
