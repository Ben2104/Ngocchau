"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

import { Bell, Clock3, Gem, Sparkles } from "lucide-react";

import type { DashboardActivityStatus } from "@gold-shop/types";
import { Button, Card, CardContent, CardHeader, CardTitle, buttonVariants, cn } from "@gold-shop/ui";
import { formatCurrencyVND, formatDateTime, formatShortDate } from "@gold-shop/utils";

import { EmptyPanel } from "@/components/common/empty-panel";
import { InfoBanner } from "@/components/common/info-banner";
import { ScreenHeader } from "@/components/common/screen-header";
import { SearchField } from "@/components/common/search-field";
import { StatBlock } from "@/components/common/stat-block";
import { StatusPill } from "@/components/common/status-pill";
import { UserAvatar } from "@/components/common/user-avatar";
import { useDashboardScreen } from "@/lib/hooks/use-dashboard-screen";

const dashboardCopy = {
  title: "Tổng quan vận hành hôm nay",
  description:
    "Theo dõi doanh thu, dòng tiền và tình trạng dữ liệu trên cùng một bề mặt điều hành để phản ứng nhanh hơn trong ngày.",
  mockAdapterTitle: "Nguồn dữ liệu đang tách rõ theo từng lớp",
  mockAdapterDescription:
    "KPI và biểu đồ lấy từ API thật. Hoạt động gần đây và sản phẩm nổi bật đang đi qua mock adapter để backend có thể nối vào sau mà không sửa lại UI.",
  errorTitle: "Không thể tải đủ dữ liệu dashboard",
  errorDescription:
    "Kiểm tra lại kết nối API hoặc phiên đăng nhập. Shell và mapper vẫn giữ nguyên để không làm vỡ các khối giao diện."
} as const;

const activityToneMap: Record<DashboardActivityStatus, "success" | "warning" | "danger"> = {
  success: "success",
  warning: "warning",
  failure: "danger"
};

export function DashboardOverview() {
  const [productSearch, setProductSearch] = useState("");
  const deferredProductSearch = useDeferredValue(productSearch);
  const { topStrip, metricTiles, chartBars, activityItems, productInsights, cashOverview, isLoading, hasError } =
    useDashboardScreen();
  const showMetricSkeletons = isLoading && metricTiles.length === 0;

  const filteredProductInsights = productInsights.filter((item) => {
    const searchTerm = deferredProductSearch.trim().toLowerCase();

    if (!searchTerm) {
      return true;
    }

    return item.name.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm);
  });

  return (
    <div className="px-4 py-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <ScreenHeader
          breadcrumbs={[{ label: "Dashboard" }, { label: "Tổng quan" }]}
          eyebrow="Phòng điều hành"
          title={dashboardCopy.title}
          description={dashboardCopy.description}
          actions={
            <>
              <StatusPill label={topStrip.goldPriceLabel} tone="accent" className="h-11 px-4 py-0" />
              <div className="inline-flex h-11 items-center rounded-2xl border border-stone-200 bg-white px-4 text-sm font-medium text-[var(--color-foreground-muted)]">
                {topStrip.dateLabel}
              </div>
              <div className="inline-flex h-11 items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 text-sm font-medium text-[var(--color-foreground-strong)]">
                <Bell className="h-4 w-4 text-[var(--color-brand-gold)]" />
                <span>{topStrip.unreadCount} thông báo mới</span>
              </div>
            </>
          }
        />

        <InfoBanner
          tone={hasError ? "danger" : "info"}
          icon={hasError ? <Bell className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          title={hasError ? dashboardCopy.errorTitle : dashboardCopy.mockAdapterTitle}
          description={hasError ? dashboardCopy.errorDescription : dashboardCopy.mockAdapterDescription}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {showMetricSkeletons
            ? Array.from({ length: 4 }, (_, index) => (
                <Card key={`dashboard-skeleton-${index}`} className="animate-pulse">
                  <CardContent className="space-y-4 p-5">
                    <div className="h-4 w-28 rounded-full bg-stone-100" />
                    <div className="h-10 w-36 rounded-full bg-stone-100" />
                    <div className="h-4 w-full rounded-full bg-stone-100" />
                  </CardContent>
                </Card>
              ))
            : metricTiles.map((tile) => (
              <StatBlock
                key={tile.key}
                label={tile.label}
                value={tile.displayValue}
                helperText={tile.helperText}
                tone={tile.highlightTone}
                changeLabel={tile.changeLabel}
              />
            ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-col gap-4 border-b border-stone-100 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl">Biểu đồ doanh thu</CardTitle>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  Mỗi cột đại diện cho doanh thu theo ngày trong 7 ngày gần nhất.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" className="rounded-full px-4">
                  Tuần này
                </Button>
                <Button type="button" variant="ghost" size="sm" className="rounded-full px-4">
                  Tháng này
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_180px]">
                <div className="flex h-[300px] items-end gap-4 rounded-[28px] bg-[var(--color-surface-muted)] px-4 pb-5 pt-8">
                  {chartBars.map((bar) => (
                    <div key={bar.id} className="flex flex-1 flex-col items-center gap-3">
                      <div className="flex h-[220px] w-full items-end justify-center rounded-[24px] bg-white px-2 pb-2 pt-6">
                        <div
                          className="w-full max-w-[56px] rounded-[18px] bg-[linear-gradient(180deg,#d4af37_0%,#735c00_100%)] shadow-brand"
                          style={{ height: `${Math.min(bar.value, bar.peak)}px` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[var(--color-foreground-muted)]">{bar.label}</span>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[24px] bg-[var(--color-brand-blue)] p-5 text-white shadow-panel">
                    <p className="text-sm font-medium text-white/80">Nhịp giao dịch</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{metricTiles[1]?.displayValue ?? "--"}</p>
                    <p className="mt-2 text-sm text-white/80">{metricTiles[1]?.helperText ?? "Đang đồng bộ dữ liệu"}</p>
                  </div>
                  <div className="rounded-[24px] bg-[var(--color-surface-muted)] p-5">
                    <p className="text-sm font-medium text-[var(--color-foreground-muted)]">Dữ liệu gần nhất</p>
                    <div className="mt-3 space-y-3">
                      {cashOverview.slice(-3).map((item) => (
                        <div key={item.date} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                          <p className="text-sm font-semibold text-[var(--color-foreground-strong)]">
                            {formatShortDate(item.date)}
                          </p>
                          <p className="mt-1 text-xs text-[var(--color-foreground-muted)]">
                            Thu {formatCurrencyVND(item.cashIn)} / Chi {formatCurrencyVND(item.cashOut)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="text-xl">Hoạt động gần đây</CardTitle>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Luồng này đang dùng mock repository để giữ nguyên data contract khi backend audit feed sẵn sàng.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              {activityItems.length === 0 ? (
                <EmptyPanel
                  title="Chưa có hoạt động để hiển thị"
                  description="Khi audit feed có endpoint riêng, danh sách này sẽ nhận dữ liệu trực tiếp từ service layer."
                />
              ) : (
                <div className="space-y-4">
                  {activityItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 rounded-[24px] bg-[var(--color-surface-muted)] p-4">
                      <UserAvatar
                        name={item.actor.fullName}
                        initials={item.actor.initials}
                        avatarUrl={item.actor.avatarUrl}
                        className="h-11 w-11"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-[var(--color-foreground-strong)]">{item.actor.fullName}</p>
                          <StatusPill label={item.statusLabel} tone={activityToneMap[item.status]} className="px-2.5 py-1" />
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[var(--color-foreground-muted)]">
                          Phiên thao tác được ghi nhận lúc {formatDateTime(item.occurredAt)}.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Card>
            <CardHeader className="flex flex-col gap-4 border-b border-stone-100 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl">Sản phẩm nổi bật</CardTitle>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  Khối này đang dùng mock adapter nhưng nhận dữ liệu qua contract rõ ràng để nối API sản phẩm sau này.
                </p>
              </div>
              <SearchField
                value={productSearch}
                onChange={setProductSearch}
                placeholder="Tìm sản phẩm, nhóm hàng..."
                className="w-full sm:max-w-[260px]"
              />
            </CardHeader>
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              {filteredProductInsights.length === 0 ? (
                <EmptyPanel
                  className="md:col-span-2"
                  title="Không có sản phẩm phù hợp"
                  description="Thử thay đổi từ khóa tìm kiếm hoặc kết nối endpoint phân tích sản phẩm để mở rộng dữ liệu."
                />
              ) : (
                filteredProductInsights.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-[28px] border p-5 shadow-sm",
                      item.accentTone === "gold"
                        ? "border-[rgba(212,175,55,0.24)] bg-[rgba(212,175,55,0.09)]"
                        : "border-[rgba(38,86,173,0.14)] bg-[rgba(38,86,173,0.07)]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-[var(--color-foreground-strong)]">{item.name}</p>
                        <p className="text-sm text-[var(--color-foreground-muted)]">{item.description}</p>
                      </div>
                      <StatusPill label={item.trendLabel} tone={item.trendTone} className="px-2.5 py-1" />
                    </div>
                    <div className="mt-8 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm text-[var(--color-foreground-muted)]">Giá tham chiếu</p>
                        <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-foreground-strong)]">
                          {formatCurrencyVND(item.price)}
                        </p>
                      </div>
                      <Gem className="h-8 w-8 text-[var(--color-brand-gold)]" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="text-xl">Dòng tiền gần đây</CardTitle>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Lấy trực tiếp từ API `cash-overview` và map sang presentation model cho thẻ điều hành.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {cashOverview.length === 0 ? (
                <EmptyPanel
                  title="Chưa có dữ liệu thu chi"
                  description="Khi API dashboard trả dữ liệu, bảng tóm tắt dòng tiền sẽ hiển thị theo ngày."
                />
              ) : (
                cashOverview.slice(-5).reverse().map((item) => (
                  <div key={item.date} className="rounded-[24px] bg-[var(--color-surface-muted)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--color-foreground-strong)]">{formatShortDate(item.date)}</p>
                        <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">Cập nhật trong ngày</p>
                      </div>
                      <Clock3 className="h-4 w-4 text-[var(--color-brand-blue)]" />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-foreground-muted)]">Thu</p>
                        <p className="mt-2 text-base font-semibold text-[var(--color-foreground-strong)]">
                          {formatCurrencyVND(item.cashIn)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-foreground-muted)]">Chi</p>
                        <p className="mt-2 text-base font-semibold text-[var(--color-foreground-strong)]">
                          {formatCurrencyVND(item.cashOut)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Link
        href="/import-excel"
        className={cn(
          buttonVariants({ size: "lg" }),
          "fixed bottom-6 right-6 z-10 h-16 rounded-full px-6 shadow-fab lg:bottom-10 lg:right-10"
        )}
      >
        Nhập dữ liệu mới
      </Link>
    </div>
  );
}
