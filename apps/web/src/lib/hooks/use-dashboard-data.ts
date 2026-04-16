"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@gold-shop/constants";
import type { CashOverviewPoint, DashboardSummary, SalesTrendPoint } from "@gold-shop/types";

import { httpClient } from "@/lib/api-client/http-client";

export function useDashboardSummary() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardSummary,
    queryFn: () => httpClient.get<DashboardSummary>("/dashboard/summary")
  });
}

export function useDashboardSalesTrend() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardSalesTrend,
    queryFn: () => httpClient.get<SalesTrendPoint[]>("/dashboard/sales-trend")
  });
}

export function useDashboardCashOverview() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboardCashOverview,
    queryFn: () => httpClient.get<CashOverviewPoint[]>("/dashboard/cash-overview")
  });
}

