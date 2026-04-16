export function applySoftDeleteFilter<TQuery extends { is: (column: string, value: null) => TQuery }>(
  query: TQuery,
  deletedAtColumn = "deleted_at"
) {
  return query.is(deletedAtColumn, null);
}

