import { cn } from "@gold-shop/ui";

interface UserAvatarProps {
  name: string;
  initials: string;
  avatarUrl?: string | null;
  className?: string;
  textClassName?: string;
}

export function UserAvatar({ name, initials, avatarUrl, className, textClassName }: UserAvatarProps) {
  if (avatarUrl) {
    return (
      <div className={cn("overflow-hidden rounded-full bg-stone-100", className)}>
        <img alt={name} className="h-full w-full object-cover" src={avatarUrl} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-[rgba(115,92,0,0.12)] text-sm font-bold text-[var(--color-brand-gold)]",
        className
      )}
      aria-label={name}
    >
      <span className={cn(textClassName)}>{initials}</span>
    </div>
  );
}
