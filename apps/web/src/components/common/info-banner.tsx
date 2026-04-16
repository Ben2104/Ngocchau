import type { ReactNode } from "react";

import type { BadgeTone } from "@gold-shop/types";
import { cn } from "@gold-shop/ui";

const bannerClasses: Record<BadgeTone, string> = {
  neutral: "border-stone-200 bg-stone-50 text-stone-700",
  success: "border-[rgba(43,126,100,0.12)] bg-[var(--color-success-bg)] text-[var(--color-success-fg)]",
  warning: "border-[rgba(172,103,0,0.16)] bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]",
  danger: "border-[rgba(189,73,73,0.12)] bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]",
  accent: "border-[rgba(115,92,0,0.12)] bg-[rgba(115,92,0,0.08)] text-[var(--color-brand-gold)]",
  info: "border-[rgba(38,86,173,0.12)] bg-[var(--color-info-bg)] text-[var(--color-info-fg)]"
};

interface InfoBannerProps {
  title: string;
  description: string;
  tone?: BadgeTone;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function InfoBanner({
  title,
  description,
  tone = "neutral",
  icon,
  action,
  className
}: InfoBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[24px] border px-5 py-4 lg:flex-row lg:items-center lg:justify-between",
        bannerClasses[tone],
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon ? <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/70">{icon}</span> : null}
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-1 text-sm leading-6 opacity-90">{description}</p>
        </div>
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
