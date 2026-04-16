"use client";

import { Search } from "lucide-react";

import { Input, cn } from "@gold-shop/ui";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export function SearchField({ value, onChange, placeholder, className }: SearchFieldProps) {
  return (
    <label className={cn("relative block w-full", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl border-transparent bg-[var(--color-surface-muted)] pl-12 pr-4 text-sm shadow-none"
      />
    </label>
  );
}
