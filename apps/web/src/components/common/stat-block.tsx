import type { ReactNode } from "react";

import type { BadgeTone } from "@gold-shop/types";
import { Card, CardContent, cn } from "@gold-shop/ui";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-stone-100 text-stone-700",
  success: "bg-[var(--color-success-bg)] text-[var(--color-success-fg)]",
  warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]",
  danger: "bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]",
  accent: "bg-[rgba(115,92,0,0.12)] text-[var(--color-brand-gold)]",
  info: "bg-[var(--color-info-bg)] text-[var(--color-info-fg)]"
};

interface StatBlockProps {
  label: string;
  value: string;
  helperText: string;
  tone?: BadgeTone;
  changeLabel?: string;
  icon?: ReactNode;
}

export function StatBlock({
  label,
  value,
  helperText,
  tone = "neutral",
  changeLabel,
  icon
}: StatBlockProps) {
  return (
    <Card className="shadow-panel">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--color-foreground-muted)]">{label}</p>
            <p className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-foreground-strong)]">{value}</p>
          </div>

          {changeLabel || icon ? (
            <span
              className={cn(
                "inline-flex min-h-10 min-w-10 items-center justify-center rounded-2xl px-3 text-xs font-bold",
                toneClasses[tone]
              )}
            >
              {icon ?? changeLabel}
            </span>
          ) : null}
        </div>

        <p className="text-sm leading-6 text-[var(--color-foreground-muted)]">{helperText}</p>
      </CardContent>
    </Card>
  );
}
