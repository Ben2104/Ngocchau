"use client";

import { APP_ROLES } from "@gold-shop/types";
import { ROLE_LABELS, ROLE_TONES } from "@gold-shop/constants";

import { KeyRound, PencilLine, ShieldCheck, UserPlus, UsersRound } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@gold-shop/ui";
import { formatShortDate } from "@gold-shop/utils";

import { EmptyPanel } from "@/components/common/empty-panel";
import { InfoBanner } from "@/components/common/info-banner";
import { PaginationControls } from "@/components/common/pagination-controls";
import { ScreenHeader } from "@/components/common/screen-header";
import { SearchField } from "@/components/common/search-field";
import { StatBlock } from "@/components/common/stat-block";
import { StatusPill } from "@/components/common/status-pill";
import { UserAvatar } from "@/components/common/user-avatar";
import { useEmployeeDirectory } from "@/lib/hooks/use-employee-directory";

export function EmployeesPage() {
  const {
    currentUser,
    params,
    searchValue,
    items,
    totalItems,
    totalPages,
    note,
    usesMockData,
    permissions,
    securityNotice,
    isLoading,
    isError,
    updateSearch,
    updateRole,
    updatePage
  } = useEmployeeDirectory();

  return (
    <div className="px-4 py-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <ScreenHeader
          breadcrumbs={[{ label: "Dashboard" }, { label: "Nhân viên" }]}
          eyebrow="Employee access"
          title="Quản lý nhân viên"
          description="Danh sách nhân sự được dựng theo typed contract và permission map tập trung để sau này nối API thật hoặc policy engine mà không viết lại UI."
          actions={
            permissions.canCreateEmployee ? (
              <Button type="button">
                <UserPlus className="h-4 w-4" />
                Thêm nhân viên
              </Button>
            ) : (
              <StatusPill label={`Vai trò hiện tại: ${currentUser.roleLabel}`} tone={ROLE_TONES[currentUser.role]} className="h-11 px-4 py-0" />
            )
          }
        />

        <InfoBanner
          tone={isError ? "danger" : usesMockData ? "info" : "success"}
          icon={isError ? <ShieldCheck className="h-4 w-4" /> : <UsersRound className="h-4 w-4" />}
          title={isError ? "Không thể tải directory từ API" : "Directory đã sẵn cho backend integration"}
          description={
            isError
              ? "Màn hình đang fallback về mock repository để không làm đứt luồng UI. Khi endpoint nhân viên ổn định, chỉ cần thay service layer."
              : note ??
                "Role badge, search, filter và pagination đều đã đi qua typed abstraction để tránh hard-code logic trong component."
          }
        />

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <StatBlock
            label="Tổng số nhân viên"
            value={String(totalItems)}
            helperText="Số lượng tài khoản đang có trong directory hiện tại."
            tone="accent"
            icon={<UsersRound className="h-5 w-5" />}
          />

          <Card className="bg-[rgba(38,86,173,0.06)]">
            <CardContent className="flex h-full flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-blue)]">Security notice</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-foreground-strong)]">
                  {securityNotice.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-foreground-muted)]">{securityNotice.description}</p>
              </div>

              {permissions.canViewSecurityPolicy ? (
                <Button type="button" variant="outline" className="shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                  {securityNotice.actionLabel}
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 border-b border-stone-100 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl">Danh sách nhân viên</CardTitle>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Search và role filter đang chạy qua params object thống nhất. Row action được guard bằng permission map thay vì hard-code theo màn hình.
              </p>
            </div>
            <SearchField
              value={searchValue}
              onChange={updateSearch}
              placeholder="Tìm theo tên, email hoặc vai trò..."
              className="w-full lg:max-w-[320px]"
            />
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={params.role === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => updateRole("all")}
                className="rounded-full px-4"
              >
                Tất cả
              </Button>
              {APP_ROLES.map((role) => (
                <Button
                  key={role}
                  type="button"
                  variant={params.role === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateRole(role)}
                  className="rounded-full px-4"
                >
                  {ROLE_LABELS[role]}
                </Button>
              ))}
            </div>

            {items.length === 0 && !isLoading ? (
              <EmptyPanel
                title="Chưa có nhân viên phù hợp"
                description="Thử đổi bộ lọc hoặc đồng bộ dữ liệu nhân sự từ backend để cập nhật directory."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-stone-100 text-left text-sm text-[var(--color-foreground-muted)]">
                      <th className="px-2 py-4 font-semibold">Nhân viên</th>
                      <th className="px-2 py-4 font-semibold">Vai trò</th>
                      <th className="px-2 py-4 font-semibold">Ngày tham gia</th>
                      <th className="px-2 py-4 font-semibold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-stone-100 last:border-b-0">
                        <td className="px-2 py-4">
                          <div className="flex min-w-[280px] items-center gap-3">
                            <UserAvatar
                              name={item.profile.fullName}
                              initials={item.profile.initials}
                              avatarUrl={item.profile.avatarUrl}
                              className="h-11 w-11"
                            />
                            <div>
                              <p className="font-semibold text-[var(--color-foreground-strong)]">{item.profile.fullName}</p>
                              <p className="text-sm text-[var(--color-foreground-muted)]">{item.profile.email ?? item.profile.subtitle ?? "Chưa đồng bộ email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <StatusPill label={ROLE_LABELS[item.role]} tone={ROLE_TONES[item.role]} className="px-2.5 py-1" />
                        </td>
                        <td className="px-2 py-4 text-sm text-[var(--color-foreground-muted)]">{formatShortDate(item.joinedAt)}</td>
                        <td className="px-2 py-4">
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="Xem quyền truy cập">
                              <KeyRound className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                              aria-label="Sửa vai trò"
                              disabled={!item.canEditRole}
                            >
                              <PencilLine className="h-4 w-4" />
                            </Button>
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
                Hiển thị {items.length} / {totalItems} nhân sự.
              </p>
              <PaginationControls page={params.page} totalPages={totalPages} onPageChange={updatePage} />
            </div>
          </CardContent>
        </Card>

        <InfoBanner
          tone="warning"
          icon={<ShieldCheck className="h-4 w-4" />}
          title="Role editing chưa gọi business flow thật"
          description="Nút `Sửa vai trò` hiện chỉ là UI shell có permission guard. Khi product chốt flow cập nhật role, chỉ cần nối handler vào service layer."
        />
      </div>
    </div>
  );
}
