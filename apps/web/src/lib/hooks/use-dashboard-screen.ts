"use client";

import { useMemo } from "react";

import { QUERY_KEYS } from "@gold-shop/constants";
import { useQuery } from "@tanstack/react-query";

import { mapDashboardSummaryToMetricTiles, mapSalesTrendToBars } from "@/lib/adapters/dashboard-screen";
import { dashboardActivityMock, dashboardProductInsightsMock, buildDashboardTopStrip } from "@/lib/mocks/dashboard";
import {
  useDashboardCashOverview,
  useDashboardSalesTrend,
  useDashboardSummary
} from "@/lib/hooks/use-dashboard-data";

export function useDashboardScreen() {
  const summaryQuery = useDashboardSummary();
  const salesTrendQuery = useDashboardSalesTrend();
  const cashOverviewQuery = useDashboardCashOverview();

  const activityQuery = useQuery({
    queryKey: QUERY_KEYS.dashboardActivity,
    queryFn: async () => dashboardActivityMock
  });

  const productQuery = useQuery({
    queryKey: QUERY_KEYS.dashboardProducts,
    queryFn: async () => dashboardProductInsightsMock
  });

  const metricTiles = useMemo(
    () => (summaryQuery.data ? mapDashboardSummaryToMetricTiles(summaryQuery.data) : []),
    [summaryQuery.data]
  );

  const chartBars = useMemo(() => mapSalesTrendToBars(salesTrendQuery.data ?? []), [salesTrendQuery.data]);

  return {
    topStrip: buildDashboardTopStrip(),
    metricTiles,
    chartBars,
    activityItems: activityQuery.data ?? [],
    productInsights: productQuery.data ?? [],
    cashOverview: cashOverviewQuery.data ?? [],
    isLoading:
      summaryQuery.isLoading ||
      salesTrendQuery.isLoading ||
      cashOverviewQuery.isLoading ||
      activityQuery.isLoading ||
      productQuery.isLoading,
    hasError:
      summaryQuery.isError || salesTrendQuery.isError || cashOverviewQuery.isError || activityQuery.isError || productQuery.isError
  };
}
