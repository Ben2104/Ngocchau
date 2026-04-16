"use client";

import Link from "next/link";

import { DatabaseBackup, FileClock, Upload } from "lucide-react";

import { IMPORT_HISTORY_STATUS_META } from "@gold-shop/constants";
import type { ImportHistoryStatus } from "@gold-shop/types";
import { Button, Card, CardContent, CardHeader, CardTitle, buttonVariants, cn } from "@gold-shop/ui";
import { formatCompactNumber, formatDateTime, formatPercent, formatStorageSize } from "@gold-shop/utils";

import { EmptyPanel } from "@/components/common/empty-panel";
import { InfoBanner } from "@/components/common/info-banner";
import { PaginationControls } from "@/components/common/pagination-controls";
import { ScreenHeader } from "@/components/common/screen-header";
import { SearchField } from "@/components/common/search-field";
import { StatBlock } from "@/components/common/stat-block";
import { StatusPill } from "@/components/common/status-pill";
import { UserAvatar } from "@/components/common/user-avatar";
import { useImportHistoryScreen } from "@/lib/hooks/use-import-history-screen";

const statusFilters: Array<ImportHistoryStatus | "all"> = ["all", "success", "warning", "failure"];

const filterLabels: Record<ImportHistoryStatus | "all", string> = {
  all: "Tất cả",
  success: "Thành công",
  warning: "Có lỗi",
  failure: "Thất bại"
};

export function ImportHistoryPage() {
  const { params, searchValue, items, stats, totalItems, totalPages, usesMockData, isLoading, isError, updateSearch, updateStatus, updatePage } =
    useImportHistoryScreen();

  return (
    <div className="px-4 py-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <ScreenHeader
          breadcrumbs={[{ label: "Dashboard" }, { label: "Lịch sử nhập file" }]}
          eyebrow="Import history"
          title="Lịch sử nhập file"
          description="Tra cứu các file đã xử lý, tình trạng lỗi và metadata phiên import bằng query params rõ ràng để backend có thể thay thế ngay."
          actions={
            <Link href="/import-excel" className={buttonVariants({ size: "default" })}>
              Nhập file mới
            </Link>
          }
        />

        <InfoBanner
          tone={isError ? "danger" : usesMockData ? "info" : "success"}
          icon={isError ? <FileClock className="h-4 w-4" /> : <DatabaseBackup className="h-4 w-4" />}
          title={isError ? "Không thể tải danh sách phiên nhập" : "History table đã đi qua service layer riêng"}
          description={
            isError
              ? "Hiện tại màn hình không tải được dữ liệu lịch sử. Khi API có sẵn, service này sẽ dùng chung contract với mock repository."
              : usesMockData
                ? "Màn hình đang dùng mock repository có phân trang, search và status filter đầy đủ để chờ endpoint thật."
                : "Dữ liệu đang được cung cấp trực tiếp từ backend."
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatBlock
            label="Tổng số file đã nhập"
            value={stats ? formatCompactNumber(stats.totalFiles) : "--"}
            helperText="Số lượng phiên import đã được ghi nhận."
            tone="accent"
          />
          <StatBlock
            label="Tỷ lệ thành công"
            value={stats ? formatPercent(stats.successRate, 0) : "--"}
            helperText={`Biến động ${stats ? formatPercent(stats.successDelta, 0) : "--"} so với chu kỳ trước.`}
            tone="success"
          />
          <StatBlock
            label="Lỗi dữ liệu"
            value={stats ? String(stats.dataErrors) : "--"}
            helperText="Số lỗi đang cần xử lý lại trên các file gần đây."
            tone="danger"
          />
          <StatBlock
            label="Dung lượng lưu trữ"
            value={stats ? formatStorageSize(stats.storageBytes) : "--"}
            helperText="Tổng dung lượng các file import đã được lưu trên storage."
            tone="info"
          />
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 border-b border-stone-100 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl">Danh sách file đã xử lý</CardTitle>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Tìm kiếm theo tên file hoặc người tải lên. Bộ lọc trạng thái đang map từ enum thay vì rải logic trong bảng.
              </p>
            </div>
            <SearchField
              value={searchValue}
              onChange={updateSearch}
              placeholder="Tìm theo tên file, người tải lên..."
              className="w-full lg:max-w-[320px]"
            />
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={params.status === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateStatus(status)}
                  className="rounded-full px-4"
                >
                  {filterLabels[status]}
                </Button>
              ))}
            </div>

            {items.length === 0 && !isLoading ? (
              <EmptyPanel
                title="Không có file phù hợp"
                description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm. Query params của màn hình đã sẵn để backend nhận trực tiếp."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 text-left text-sm text-[var(--color-foreground-muted)]">
                      <th className="px-2 py-4 font-semibold">Tên file</th>
                      <th className="px-2 py-4 font-semibold">Người tải lên</th>
                      <th className="px-2 py-4 font-semibold">Thời gian xử lý</th>
                      <th className="px-2 py-4 font-semibold">Trạng thái</th>
                      <th className="px-2 py-4 font-semibold">Lỗi</th>
                      <th className="px-2 py-4 font-semibold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-stone-100 last:border-b-0">
                        <td className="px-2 py-4">
                          <div className="min-w-[240px]">
                            <p className="font-semibold text-[var(--color-foreground-strong)]">{item.fileName}</p>
                            <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">ID phiên: {item.id}</p>
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <div className="flex min-w-[220px] items-center gap-3">
                            <UserAvatar
                              name={item.uploadedBy.fullName}
                              initials={item.uploadedBy.initials}
                              avatarUrl={item.uploadedBy.avatarUrl}
                              className="h-10 w-10"
                            />
                            <div>
                              <p className="font-semibold text-[var(--color-foreground-strong)]">{item.uploadedBy.fullName}</p>
                              <p className="text-sm text-[var(--color-foreground-muted)]">{item.uploadedBy.subtitle ?? "Nhân sự vận hành"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4 text-sm text-[var(--color-foreground-muted)]">{formatDateTime(item.processedAt)}</td>
                        <td className="px-2 py-4">
                          <StatusPill
                            label={IMPORT_HISTORY_STATUS_META[item.status].label}
                            tone={IMPORT_HISTORY_STATUS_META[item.status].tone}
                            className="px-2.5 py-1"
                          />
                        </td>
                        <td className="px-2 py-4 text-sm font-semibold text-[var(--color-foreground-strong)]">{item.errorDisplay}</td>
                        <td className="px-2 py-4">
                          <div className="flex justify-end gap-2">
                            {item.rowActions.map((action) => (
                              <Button key={action.key} type="button" variant="ghost" size="sm" className="rounded-full px-3">
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-col gap-4 border-t border-stone-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Hiển thị {items.length} / {totalItems} phiên nhập liệu.
              </p>
              <PaginationControls page={params.page} totalPages={totalPages} onPageChange={updatePage} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-[rgba(212,175,55,0.08)]">
            <CardContent className="flex h-full flex-col gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white text-[var(--color-brand-gold)] shadow-panel">
                <Upload className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[var(--color-foreground-strong)]">Chuẩn hóa file trước khi nhập</h3>
                <p className="text-sm leading-6 text-[var(--color-foreground-muted)]">
                  Flow import mới đã tách rõ upload, validate và commit. Dùng cùng route để kiểm tra lại cấu trúc file trước khi tiếp tục.
                </p>
              </div>
              <Link
                href="/import-excel"
                className={cn(buttonVariants({ variant: "outline" }), "w-fit rounded-full border-transparent bg-white")}
              >
                Mở màn hình nhập dữ liệu
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-[rgba(38,86,173,0.06)]">
            <CardContent className="flex h-full flex-col gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white text-[var(--color-brand-blue)] shadow-panel">
                <DatabaseBackup className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-[var(--color-foreground-strong)]">Sẵn sàng nối backend audit</h3>
                <p className="text-sm leading-6 text-[var(--color-foreground-muted)]">
                  Bảng lịch sử hiện đã có query params, service layer và pagination abstraction. Khi API thật sẵn sàng chỉ cần thay implementation trong repository.
                </p>
              </div>
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ variant: "outline" }), "w-fit rounded-full border-transparent bg-white")}
              >
                Quay lại tổng quan
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
