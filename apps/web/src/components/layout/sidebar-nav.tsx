"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DASHBOARD_NAV_ITEMS } from "@gold-shop/constants";
import { cn } from "@gold-shop/ui";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {DASHBOARD_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-stone-900 text-stone-50"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

