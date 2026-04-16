import type { DashboardMetricTile, DashboardSummary, SalesTrendPoint } from "@gold-shop/types";
import { formatCompactNumber, formatCurrencyVND } from "@gold-shop/utils";

export function mapDashboardSummaryToMetricTiles(summary: DashboardSummary): DashboardMetricTile[] {
  return [
    {
      key: "total-sales",
      label: "Doanh thu hôm nay",
      displayValue: formatCurrencyVND(summary.totalSales),
      value: summary.totalSales,
      helperText: "+12.5% so với hôm qua",
      highlightTone: "warning",
      changeLabel: "+12.5%"
    },
    {
      key: "transactions",
      label: "Số giao dịch",
      displayValue: formatCompactNumber(summary.transactionCount),
      value: summary.transactionCount,
      helperText: "Giao dịch đã hoàn tất",
      highlightTone: "info"
    },
    {
      key: "inventory",
      label: "Tồn kho",
      displayValue: formatCompactNumber(summary.inventoryItems),
      value: summary.inventoryItems,
      helperText: "Tổng sản phẩm đang quản lý",
      highlightTone: "warning"
    },
    {
      key: "errors",
      label: "Số lỗi nhập liệu",
      displayValue: String(summary.lowStockItems),
      value: summary.lowStockItems,
      helperText: "Cần kiểm tra ngay",
      highlightTone: summary.lowStockItems > 0 ? "danger" : "success"
    }
  ];
}

export interface DashboardChartBar {
  id: string;
  label: string;
  value: number;
  peak: number;
}

export function mapSalesTrendToBars(points: SalesTrendPoint[]): DashboardChartBar[] {
  const fallback = [
    { id: "t2", label: "T2", value: 70, peak: 130 },
    { id: "t3", label: "T3", value: 96, peak: 180 },
    { id: "t4", label: "T4", value: 92, peak: 176 },
    { id: "t5", label: "T5", value: 101, peak: 184 },
    { id: "t6", label: "T6", value: 97, peak: 180 },
    { id: "t7", label: "T7", value: 103, peak: 186 },
    { id: "cn", label: "CN", value: 96, peak: 180 }
  ];

  if (points.length === 0) {
    return fallback;
  }

  const peak = Math.max(...points.map((point) => point.revenue), 1);

  return points.slice(-7).map((point) => {
    const date = new Date(point.date);
    const weekday = new Intl.DateTimeFormat("vi-VN", { weekday: "short" }).format(date).replace(".", "");

    return {
      id: point.date,
      label: weekday.toUpperCase(),
      value: Math.max(36, Math.round((point.revenue / peak) * 132)),
      peak: 184
    };
  });
}
