"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PRIMARY_NAV_ITEMS } from "@gold-shop/constants";
import { cn } from "@gold-shop/ui";

import { NavIcon } from "@/components/layout/nav-icon";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {PRIMARY_NAV_ITEMS.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200",
              isActive
                ? "bg-brand-gradient text-white shadow-brand"
                : "text-slate-600 hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-foreground-strong)]"
            )}
          >
            <NavIcon icon={item.icon} className="h-[18px] w-[18px] shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
