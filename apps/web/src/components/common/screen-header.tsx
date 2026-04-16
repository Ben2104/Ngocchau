import type { ReactNode } from "react";

import type { ScreenBreadcrumb } from "@gold-shop/types";
import { cn } from "@gold-shop/ui";

interface ScreenHeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
  breadcrumbs?: ScreenBreadcrumb[];
  actions?: ReactNode;
  className?: string;
}

export function ScreenHeader({
  title,
  description,
  eyebrow,
  breadcrumbs,
  actions,
  className
}: ScreenHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between", className)}>
      <div className="space-y-3">
        {breadcrumbs?.length ? (
          <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-foreground-muted)]">
            {breadcrumbs.map((item, index) => (
              <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
                {index > 0 ? <span aria-hidden>/</span> : null}
                <span>{item.label}</span>
              </span>
            ))}
          </nav>
        ) : null}

        {eyebrow ? (
          <span className="inline-flex rounded-full bg-[rgba(115,92,0,0.08)] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-brand-gold)]">
            {eyebrow}
          </span>
        ) : null}

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--color-foreground-strong)] lg:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--color-foreground-muted)] lg:text-base">{description}</p>
        </div>
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-3 lg:justify-end">{actions}</div> : null}
    </div>
  );
}
