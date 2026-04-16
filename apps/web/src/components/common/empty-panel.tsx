import type { ReactNode } from "react";

import { cn } from "@gold-shop/ui";

interface EmptyPanelProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyPanel({ title, description, action, className }: EmptyPanelProps) {
  return (
    <div
      className={cn(
        "flex min-h-44 flex-col items-center justify-center rounded-[28px] border border-dashed border-stone-200 bg-stone-50/80 px-6 py-8 text-center",
        className
      )}
    >
      <div className="max-w-md space-y-3">
        <h3 className="text-lg font-semibold text-[var(--color-foreground-strong)]">{title}</h3>
        <p className="text-sm leading-6 text-[var(--color-foreground-muted)]">{description}</p>
      </div>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
