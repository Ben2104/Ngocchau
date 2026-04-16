export function resolveDateRange(from?: string, to?: string) {
  const resolvedTo = to ? new Date(to) : new Date();
  const resolvedFrom = from ? new Date(from) : new Date(resolvedTo);

  if (!from) {
    resolvedFrom.setDate(resolvedTo.getDate() - 6);
  }

  return {
    from: resolvedFrom.toISOString(),
    to: resolvedTo.toISOString()
  };
}

export function enumerateDates(from: string, to: string): string[] {
  const dates: string[] = [];
  const cursor = new Date(from);
  const end = new Date(to);

  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

