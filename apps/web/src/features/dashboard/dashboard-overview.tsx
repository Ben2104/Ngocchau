"use client";

import { AlertTriangle, BarChart3, Coins, PackageSearch } from "lucide-react";

import { Card, CardContent } from "@gold-shop/ui";
import { formatCurrencyVND } from "@gold-shop/utils";

import { PageHeader } from "@/components/common/page-header";
import { MetricCard } from "@/components/common/metric-card";
import { CashOverviewChart } from "@/components/charts/cash-overview-chart";
import { SalesTrendChart } from "@/components/charts/sales-trend-chart";
import {
  useDashboardCashOverview,
  useDashboardSalesTrend,
  useDashboardSummary
} from "@/lib/hooks/use-dashboard-data";

export function DashboardOverview() {
  const summaryQuery = useDashboardSummary();
  const salesTrendQuery = useDashboardSalesTrend();
  const cashOverviewQuery = useDashboardCashOverview();

  const summary = summaryQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Owner dashboard"
        title="Tổng quan vận hành"
        description="Theo dõi doanh thu, thu chi và cảnh báo tồn kho từ một màn hình thống nhất."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Doanh thu"
          value={summary ? formatCurrencyVND(summary.totalSales) : "Đang tải..."}
          hint="Tổng bán hàng trong kỳ"
          direction="up"
        />
        <MetricCard
          title="Số giao dịch"
          value={summary ? String(summary.transactionCount) : "Đang tải..."}
          hint="Nhịp giao dịch hiện tại"
        />
        <MetricCard
          title="Dòng tiền ròng"
          value={summary ? formatCurrencyVND(summary.netCashFlow) : "Đang tải..."}
          hint="Thu trừ chi trong kỳ"
          direction={summary && summary.netCashFlow < 0 ? "down" : "up"}
        />
        <MetricCard
          title="Hàng sắp thiếu"
          value={summary ? String(summary.lowStockItems) : "Đang tải..."}
          hint="Sản phẩm dưới ngưỡng cảnh báo"
          direction={summary && summary.lowStockItems > 0 ? "down" : "neutral"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <SalesTrendChart data={salesTrendQuery.data ?? []} />
        <Card>
          <CardContent className="grid gap-4 p-6">
            <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <Coins className="h-5 w-5 text-amber-700" />
              <div>
                <p className="text-sm font-medium text-stone-900">Thu trong ngày</p>
                <p className="text-sm text-stone-600">
                  {summary ? formatCurrencyVND(summary.cashIn) : "Đang tổng hợp"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <BarChart3 className="h-5 w-5 text-stone-700" />
              <div>
                <p className="text-sm font-medium text-stone-900">Giá trị đơn trung bình</p>
                <p className="text-sm text-stone-600">
                  {summary ? formatCurrencyVND(summary.averageOrderValue) : "Đang tổng hợp"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <PackageSearch className="h-5 w-5 text-stone-700" />
              <div>
                <p className="text-sm font-medium text-stone-900">Tổng SKU đang quản lý</p>
                <p className="text-sm text-stone-600">
                  {summary ? String(summary.inventoryItems) : "Đang tổng hợp"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-stone-900">Ngưỡng cảnh báo tồn kho</p>
                <p className="text-sm text-stone-600">
                  {summary ? `${summary.lowStockItems} mặt hàng cần kiểm tra` : "Đang tổng hợp"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CashOverviewChart data={cashOverviewQuery.data ?? []} />
    </div>
  );
}

