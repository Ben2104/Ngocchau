"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button, cn } from "@gold-shop/ui";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function buildPages(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, page, page + 1, totalPages]);

  if (page > 1) {
    pages.add(page - 1);
  }

  const sorted = Array.from(pages).filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];

  sorted.forEach((value, index) => {
    const previous = sorted[index - 1];

    if (previous && value - previous > 1) {
      result.push("ellipsis");
    }

    result.push(value);
  });

  return result;
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  className
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="h-10 w-10 rounded-xl border-stone-200 bg-white"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {buildPages(page, totalPages).map((item, index) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-slate-400">
            ...
          </span>
        ) : (
          <Button
            key={item}
            type="button"
            variant={item === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(item)}
            className={cn(
              "h-10 w-10 rounded-xl",
              item === page ? "shadow-brand" : "border-stone-200 bg-white text-slate-600"
            )}
          >
            {item}
          </Button>
        )
      )}

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="h-10 w-10 rounded-xl border-stone-200 bg-white"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
