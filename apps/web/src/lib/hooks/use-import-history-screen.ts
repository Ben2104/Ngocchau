"use client";

import { useDeferredValue, useState } from "react";

import { IMPORT_HISTORY_PAGE_SIZE, QUERY_KEYS } from "@gold-shop/constants";
import type { ImportHistoryQueryParams, ImportHistoryStatus } from "@gold-shop/types";
import { useQuery } from "@tanstack/react-query";

import { getImportHistory } from "@/lib/services/import-history-service";

const defaultQueryParams: ImportHistoryQueryParams = {
  page: 1,
  pageSize: IMPORT_HISTORY_PAGE_SIZE,
  search: "",
  sortBy: "processedAt",
  sortDirection: "desc",
  status: "all"
};

export function useImportHistoryScreen() {
  const [params, setParams] = useState<ImportHistoryQueryParams>(defaultQueryParams);
  const deferredSearch = useDeferredValue(params.search ?? "");
  const queryParams = {
    ...params,
    search: deferredSearch
  };

  const historyQuery = useQuery({
    queryKey: [...QUERY_KEYS.importHistory, queryParams],
    queryFn: () => getImportHistory(queryParams)
  });

  function updateSearch(search: string) {
    setParams((current) => ({
      ...current,
      search,
      page: 1
    }));
  }

  function updateStatus(status: ImportHistoryStatus | "all") {
    setParams((current) => ({
      ...current,
      status,
      page: 1
    }));
  }

  function updatePage(page: number) {
    setParams((current) => ({
      ...current,
      page
    }));
  }

  return {
    params,
    searchValue: params.search ?? "",
    items: historyQuery.data?.items ?? [],
    stats: historyQuery.data?.stats,
    totalItems: historyQuery.data?.totalItems ?? 0,
    totalPages: historyQuery.data?.totalPages ?? 1,
    usesMockData: historyQuery.data?.usesMockData ?? true,
    isLoading: historyQuery.isLoading,
    isError: historyQuery.isError,
    updateSearch,
    updateStatus,
    updatePage
  };
}
