import type { BadgeTone } from "@gold-shop/types";

import { cn } from "@gold-shop/ui";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-stone-100 text-slate-600",
  success: "bg-[var(--color-success-bg)] text-[var(--color-success-fg)]",
  warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]",
  danger: "bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]",
  accent: "bg-[rgba(115,92,0,0.12)] text-[var(--color-brand-gold)]",
  info: "bg-[var(--color-info-bg)] text-[var(--color-info-fg)]"
};

interface StatusPillProps {
  label: string;
  tone?: BadgeTone;
  showDot?: boolean;
  className?: string;
}

export function StatusPill({ label, tone = "neutral", showDot = true, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-normal",
        toneClasses[tone],
        className
      )}
    >
      {showDot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden /> : null}
      <span>{label}</span>
    </span>
  );
}
