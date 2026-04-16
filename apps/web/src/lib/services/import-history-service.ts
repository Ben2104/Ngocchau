import { IMPORT_HISTORY_PAGE_SIZE } from "@gold-shop/constants";
import type { ImportHistoryItem, ImportHistoryQueryParams, ImportHistoryStats } from "@gold-shop/types";

import { importHistoryItemsMock, importHistoryStatsMock } from "@/lib/mocks/import-history";

export interface ImportHistoryQueryResult {
  items: ImportHistoryItem[];
  stats: ImportHistoryStats;
  totalItems: number;
  totalPages: number;
  usesMockData: boolean;
}

function sortHistoryItems(items: ImportHistoryItem[], params: ImportHistoryQueryParams) {
  const direction = params.sortDirection === "asc" ? 1 : -1;
  const sortBy = params.sortBy ?? "processedAt";

  return [...items].sort((left, right) => {
    if (sortBy === "fileName") {
      return left.fileName.localeCompare(right.fileName, "vi") * direction;
    }

    return (new Date(left.processedAt).getTime() - new Date(right.processedAt).getTime()) * direction;
  });
}

export async function getImportHistory(params: ImportHistoryQueryParams): Promise<ImportHistoryQueryResult> {
  const searchTerm = params.search?.trim().toLowerCase() ?? "";
  const filteredItems = importHistoryItemsMock.filter((item) => {
    const matchesStatus = !params.status || params.status === "all" ? true : item.status === params.status;
    const matchesSearch =
      searchTerm === "" ||
      item.fileName.toLowerCase().includes(searchTerm) ||
      item.uploadedBy.fullName.toLowerCase().includes(searchTerm);

    return matchesStatus && matchesSearch;
  });

  const sortedItems = sortHistoryItems(filteredItems, params);
  const pageSize = params.pageSize || IMPORT_HISTORY_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const currentPage = Math.min(params.page || 1, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const items = sortedItems.slice(startIndex, startIndex + pageSize);

  return {
    items,
    stats: importHistoryStatsMock,
    totalItems: sortedItems.length,
    totalPages,
    usesMockData: true
  };
}
