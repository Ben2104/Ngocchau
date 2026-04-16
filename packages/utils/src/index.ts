export function formatCurrencyVND(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function formatShortDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export function formatStorageSize(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const size = value / 1024 ** exponent;
  const maximumFractionDigits = exponent === 0 ? 0 : 1;

  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits }).format(size)} ${units[exponent]}`;
}

export function formatPercent(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "percent",
    maximumFractionDigits
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function compactObject<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== null && item !== "")
  ) as Partial<T>;
}

export function toQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export function safeNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

export function groupByDate<T>(
  items: T[],
  getDate: (item: T) => string,
  reducer: (accumulator: number, item: T) => number
): Record<string, number> {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    const key = new Date(getDate(item)).toISOString().slice(0, 10);
    const currentValue = accumulator[key] ?? 0;
    accumulator[key] = reducer(currentValue, item);
    return accumulator;
  }, {});
}

export function getInitials(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
