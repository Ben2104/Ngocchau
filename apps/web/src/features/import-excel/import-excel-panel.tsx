"use client";

import { Bell, FileSpreadsheet, ShieldAlert, UploadCloud } from "lucide-react";

import { SUPPORTED_IMPORT_FILE_TYPES, VALIDATION_SEVERITY_META } from "@gold-shop/constants";
import { Button, Card, CardContent, CardHeader, CardTitle, cn } from "@gold-shop/ui";
import { formatCurrencyVND, formatDateTime, formatStorageSize } from "@gold-shop/utils";

import { EmptyPanel } from "@/components/common/empty-panel";
import { InfoBanner } from "@/components/common/info-banner";
import { ScreenHeader } from "@/components/common/screen-header";
import { StatusPill } from "@/components/common/status-pill";
import { UserAvatar } from "@/components/common/user-avatar";
import { useImportWorkspace } from "@/lib/hooks/use-import-workspace";
import { useCurrentUser } from "@/providers/current-user-provider";

const importCopy = {
  title: "Nhập dữ liệu Excel",
  description:
    "Tải file, chạy validate và khóa bước commit trong cùng một flow để sau này có thể thay mock adapter bằng normalized rows từ backend.",
  previewNoteTitle: "Preview đang đi qua adapter tạm thời",
  previewNoteDescription:
    "Bảng xem trước và danh sách lỗi đang dùng mock repository có typed contract. Khi backend trả preview rows thật, chỉ cần thay service layer.",
  errorTitle: "Phiên import đang có lỗi cần xử lý",
  successTitle: "Luồng import đã sẵn sàng để nối backend thật"
} as const;

const previewToneMap = {
  default: "neutral",
  error: VALIDATION_SEVERITY_META.error.tone,
  warning: VALIDATION_SEVERITY_META.warning.tone,
  info: VALIDATION_SEVERITY_META.info.tone
} as const;

const commitActionLabels = {
  idle: "Chọn tệp để bắt đầu",
  file_selected: "Tải tệp lên",
  uploading: "Đang tải lên...",
  uploaded: "Chờ kiểm tra dữ liệu",
  validating: "Đang kiểm tra...",
  validated: "Xác nhận nhập dữ liệu",
  blocked: "Chưa thể xác nhận",
  committing: "Đang xác nhận...",
  committed: "Đã xác nhận"
} as const;

export function ImportExcelPanel() {
  const currentUser = useCurrentUser();
  const {
    selectedFile,
    session,
    previewRows,
    issues,
    summary,
    screenState,
    isDragActive,
    errorMessage,
    serverMessage,
    setIsDragActive,
    onFileChange,
    handleDrop,
    handleUpload,
    handleValidate,
    handleCommit,
    dismissError,
    resetWorkspace
  } = useImportWorkspace();

  const issueTone = errorMessage ? "danger" : "info";

  return (
    <div className="px-4 py-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6 pb-32">
        <ScreenHeader
          breadcrumbs={[{ label: "Dashboard" }, { label: "Nhập dữ liệu" }]}
          eyebrow="Excel import"
          title={importCopy.title}
          description={importCopy.description}
          actions={
            <>
              <div className="hidden items-center gap-3 rounded-[24px] border border-stone-200 bg-white px-4 py-3 md:flex">
                <Bell className="h-4 w-4 text-[var(--color-brand-gold)]" />
                <span className="text-sm font-medium text-[var(--color-foreground-muted)]">Theo dõi phiên nhập liệu mới</span>
              </div>
              <div className="flex items-center gap-3 rounded-[24px] border border-stone-200 bg-white px-4 py-3">
                <UserAvatar
                  name={currentUser.identity.fullName}
                  initials={currentUser.identity.initials}
                  avatarUrl={currentUser.identity.avatarUrl}
                  className="h-10 w-10"
                />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--color-foreground-strong)]">{currentUser.identity.fullName}</p>
                  <p className="text-xs text-[var(--color-foreground-muted)]">{currentUser.roleLabel}</p>
                </div>
              </div>
            </>
          }
        />

        {errorMessage || serverMessage ? (
          <InfoBanner
            tone={issueTone}
            icon={errorMessage ? <ShieldAlert className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
            title={errorMessage ? importCopy.errorTitle : importCopy.successTitle}
            description={errorMessage ?? serverMessage ?? ""}
            action={
              errorMessage ? (
                <Button type="button" variant="ghost" size="sm" onClick={dismissError}>
                  Ẩn cảnh báo
                </Button>
              ) : null
            }
          />
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <Card>
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="text-xl">Tải tệp nguồn</CardTitle>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Chỉ dựng UI shell và trạng thái thao tác. Dữ liệu preview vẫn đi qua typed adapter thay vì nằm thẳng trong component.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <label
                className={cn(
                  "flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-[32px] border-2 border-dashed px-6 py-8 text-center transition-colors",
                  isDragActive
                    ? "border-[var(--color-brand-gold)] bg-[rgba(212,175,55,0.08)]"
                    : "border-stone-200 bg-[var(--color-surface-muted)] hover:border-[var(--color-brand-gold)] hover:bg-[rgba(212,175,55,0.04)]"
                )}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDragActive(false);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  handleDrop(event.dataTransfer.files);
                }}
              >
                <input
                  type="file"
                  accept={SUPPORTED_IMPORT_FILE_TYPES.join(",")}
                  className="sr-only"
                  onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
                />
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-white text-[var(--color-brand-gold)] shadow-panel">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-foreground-strong)]">
                  Kéo thả hoặc chọn file để upload
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-foreground-muted)]">
                  Hệ thống hiện chấp nhận {SUPPORTED_IMPORT_FILE_TYPES.join(", ")}. Tệp sẽ được tải lên storage trước khi validate.
                </p>
                {selectedFile ? (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <StatusPill label={selectedFile.name} tone="accent" className="max-w-full px-4 py-2 text-xs" />
                    <StatusPill
                      label={formatStorageSize(selectedFile.size)}
                      tone="info"
                      className="max-w-full px-4 py-2 text-xs"
                    />
                  </div>
                ) : null}
              </label>

              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={handleUpload} disabled={!selectedFile || screenState.isBusy}>
                  Tải tệp lên
                </Button>
                <Button type="button" variant="outline" onClick={handleValidate} disabled={!screenState.canValidate || screenState.isBusy}>
                  Kiểm tra dữ liệu
                </Button>
                <Button type="button" variant="ghost" onClick={resetWorkspace} disabled={!selectedFile && !session}>
                  Hủy phiên nhập
                </Button>
              </div>

              {session ? (
                <div className="grid gap-4 rounded-[28px] bg-[var(--color-surface-muted)] p-5 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-foreground-muted)]">Mã phiên</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-foreground-strong)]">{session.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-foreground-muted)]">Trạng thái</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-foreground-strong)]">{session.status}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-foreground-muted)]">Cập nhật</p>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-foreground-strong)]">{formatDateTime(session.updatedAt)}</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-stone-100">
              <CardTitle className="text-xl">Tóm tắt dữ liệu</CardTitle>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Mọi số liệu ở đây đi qua `ImportSummary` và `ImportValidationIssue`.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="grid gap-3">
                <div className="rounded-[24px] bg-[var(--color-surface-muted)] p-4">
                  <p className="text-sm text-[var(--color-foreground-muted)]">Tổng số dòng</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--color-foreground-strong)]">
                    {summary.totalRows}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[24px] bg-[var(--color-success-bg)] p-4">
                    <p className="text-sm text-[var(--color-success-fg)]">Hợp lệ</p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--color-success-fg)]">{summary.validRows}</p>
                  </div>
                  <div className="rounded-[24px] bg-[var(--color-danger-bg)] p-4">
                    <p className="text-sm text-[var(--color-danger-fg)]">Lỗi nghiêm trọng</p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--color-danger-fg)]">{summary.criticalIssues}</p>
                  </div>
                </div>
                <div className="rounded-[24px] bg-white p-4 shadow-sm">
                  <p className="text-sm text-[var(--color-foreground-muted)]">Cảnh báo</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--color-foreground-strong)]">{summary.warningIssues}</p>
                </div>
              </div>

              <InfoBanner
                tone="info"
                icon={<FileSpreadsheet className="h-4 w-4" />}
                title={importCopy.previewNoteTitle}
                description={importCopy.previewNoteDescription}
                className="rounded-[28px]"
              />

              <div className="space-y-3">
                <p className="text-sm font-semibold text-[var(--color-foreground-strong)]">Các dòng cần chú ý</p>
                {issues.length === 0 ? (
                  <EmptyPanel
                    className="min-h-[180px]"
                    title="Chưa có lỗi để hiển thị"
                    description="Sau khi validate, danh sách cảnh báo sẽ hiển thị theo đúng contract để backend có thể trả dữ liệu thật."
                  />
                ) : (
                  issues.map((issue) => (
                    <div key={issue.id} className="rounded-[24px] bg-[var(--color-surface-muted)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-[var(--color-foreground-strong)]">Dòng {issue.rowNumber}</p>
                        <StatusPill
                          label={VALIDATION_SEVERITY_META[issue.severity].label}
                          tone={VALIDATION_SEVERITY_META[issue.severity].tone}
                          className="px-2.5 py-1"
                        />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-foreground-muted)]">
                        {issue.field ? `${issue.field}: ` : ""}
                        {issue.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="border-b border-stone-100">
            <CardTitle className="text-xl">Xem trước dữ liệu</CardTitle>
            <p className="text-sm text-[var(--color-foreground-muted)]">
              Preview table nhận data qua adapter riêng để sau này thay bằng normalized rows mà không chạm tới component table.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {previewRows.length === 0 ? (
              <EmptyPanel
                className="m-6"
                title="Chưa có dữ liệu preview"
                description="Chọn file và bắt đầu phiên import để xem các dòng dữ liệu mẫu, trạng thái validate và giá niêm yết."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 text-left text-sm text-[var(--color-foreground-muted)]">
                      <th className="px-6 py-4 font-semibold">Dòng</th>
                      <th className="px-6 py-4 font-semibold">Mã SP</th>
                      <th className="px-6 py-4 font-semibold">Tên sản phẩm</th>
                      <th className="px-6 py-4 font-semibold">Khối lượng</th>
                      <th className="px-6 py-4 font-semibold">Giá niêm yết</th>
                      <th className="px-6 py-4 font-semibold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row) => (
                      <tr key={row.id} className="border-b border-stone-100 last:border-b-0">
                        <td className="px-6 py-4 text-sm font-semibold text-[var(--color-foreground-strong)]">{row.rowNumber}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-foreground-muted)]">{row.productCode ?? "Chưa có"}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-foreground-strong)]">{row.productName}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-foreground-muted)]">{row.weightLabel ?? "Chưa xác định"}</td>
                        <td className="px-6 py-4 text-sm text-[var(--color-foreground-strong)]">
                          {row.listedPrice ? formatCurrencyVND(row.listedPrice) : "Chưa có"}
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill
                            label={row.severity === "default" ? "Ổn định" : VALIDATION_SEVERITY_META[row.severity].label}
                            tone={previewToneMap[row.severity]}
                            className="px-2.5 py-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-stone-200 bg-white/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--color-foreground-strong)]">
              {screenState.statusMessage ?? "Sẵn sàng nhận dữ liệu đầu vào."}
            </p>
            <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">
              Commit chỉ được mở khi không còn lỗi nghiêm trọng và phiên import đã hoàn thành bước validate.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={resetWorkspace} disabled={!selectedFile && !session}>
              Hủy
            </Button>
            <Button type="button" onClick={handleCommit} disabled={!screenState.canCommit || screenState.isBusy}>
              {commitActionLabels[screenState.actionState]}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
