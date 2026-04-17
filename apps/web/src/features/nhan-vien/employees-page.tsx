"use client";

import { APP_ROLES, EMPLOYEE_ASSIGNABLE_ROLES } from "@gold-shop/types";
import { ROLE_LABELS, ROLE_TONES } from "@gold-shop/constants";

import { LoaderCircle, Trash2, UserPlus, UsersRound } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@gold-shop/ui";
import { formatShortDate } from "@gold-shop/utils";

import { EmptyPanel } from "@/components/common/empty-panel";
import { InfoBanner } from "@/components/common/info-banner";
import { PaginationControls } from "@/components/common/pagination-controls";
import { ScreenHeader } from "@/components/common/screen-header";
import { SearchField } from "@/components/common/search-field";
import { StatBlock } from "@/components/common/stat-block";
import { StatusPill } from "@/components/common/status-pill";
import { UserAvatar } from "@/components/common/user-avatar";
import { FormMessage } from "@/components/forms/form-message";
import { useEmployeeDirectory } from "@/lib/hooks/use-employee-directory";

export function EmployeesPage() {
  const {
    currentUser,
    params,
    searchValue,
    items,
    totalItems,
    totalPages,
    feedback,
    permissions,
    isLoading,
    isError,
    errorMessage,
    isCreateFormOpen,
    createForm,
    isCreating,
    deleteCandidateId,
    deletingId,
    updateSearch,
    updateRole,
    updatePage,
    updateCreateField,
    toggleCreateForm,
    submitCreate,
    startDelete,
    cancelDelete,
    confirmDelete,
    canDeleteEmployee
  } = useEmployeeDirectory();

  return (
    <div className="px-4 py-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <ScreenHeader
          breadcrumbs={[{ label: "Dashboard" }, { label: "Nhân viên" }]}
          eyebrow="Employee access"
          title="Quản lý nhân viên"
          description="Chủ cửa hàng chủ động cấp email, mật khẩu và vai trò cho từng nhân viên. Danh sách bên dưới lấy trực tiếp từ tài khoản nội bộ đã lưu trong hệ thống."
          actions={
            permissions.canCreateEmployee ? (
              <Button type="button" onClick={toggleCreateForm} variant={isCreateFormOpen ? "outline" : "default"}>
                <UserPlus className="h-4 w-4" />
                {isCreateFormOpen ? "Ẩn biểu mẫu" : "Thêm nhân viên"}
              </Button>
            ) : (
              <StatusPill label={`Vai trò hiện tại: ${currentUser.roleLabel}`} tone={ROLE_TONES[currentUser.role]} className="h-11 px-4 py-0" />
            )
          }
        />

        {feedback ? (
          <InfoBanner
            tone={feedback.tone === "success" ? "success" : "danger"}
            icon={feedback.tone === "success" ? <UsersRound className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
            title={feedback.tone === "success" ? "Cập nhật thành công" : "Không thể hoàn tất thao tác"}
            description={feedback.message}
          />
        ) : null}

        {isError ? (
          <InfoBanner
            tone="danger"
            icon={<Trash2 className="h-4 w-4" />}
            title="Không thể tải danh sách nhân viên"
            description={errorMessage ?? "API chưa trả được dữ liệu nhân sự."}
          />
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <StatBlock
            label="Tổng số nhân viên"
            value={String(totalItems)}
            helperText="Chỉ hiển thị các tài khoản nội bộ đang hoạt động và có thể đăng nhập."
            tone="accent"
            icon={<UsersRound className="h-5 w-5" />}
          />

          <Card className="bg-[rgba(38,86,173,0.06)]">
            <CardContent className="flex h-full flex-col gap-4 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand-blue)]">Provisioning</p>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-foreground-strong)]">
                Nhân viên chỉ đăng nhập bằng tài khoản do owner cấp
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-[var(--color-foreground-muted)]">
                Hệ thống không có đăng ký công khai hay flow mời tài khoản. Owner tạo trực tiếp email, mật khẩu và vai trò cho từng nhân viên.
              </p>
            </CardContent>
          </Card>
        </div>

        {permissions.canCreateEmployee && isCreateFormOpen ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Tạo tài khoản nhân viên</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={submitCreate}>
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employee-full-name">Họ và tên</Label>
                    <Input
                      id="employee-full-name"
                      value={createForm.fullName}
                      onChange={(event) => updateCreateField("fullName", event.target.value)}
                      placeholder="Ví dụ: Trần Hải Yến"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-email">Email</Label>
                    <Input
                      id="employee-email"
                      type="email"
                      value={createForm.email}
                      onChange={(event) => updateCreateField("email", event.target.value)}
                      placeholder="nhanvien@ngocchau.vn"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-role">Vai trò</Label>
                    <select
                      id="employee-role"
                      value={createForm.role}
                      onChange={(event) => updateCreateField("role", event.target.value)}
                      className="flex h-12 w-full rounded-xl border border-transparent bg-stone-100 px-4 py-3 text-sm text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                    >
                      {EMPLOYEE_ASSIGNABLE_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-password">Mật khẩu</Label>
                    <Input
                      id="employee-password"
                      type="password"
                      value={createForm.password}
                      onChange={(event) => updateCreateField("password", event.target.value)}
                      placeholder="Tối thiểu 8 ký tự"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="employee-confirm-password">Xác nhận mật khẩu</Label>
                    <Input
                      id="employee-confirm-password"
                      type="password"
                      value={createForm.confirmPassword}
                      onChange={(event) => updateCreateField("confirmPassword", event.target.value)}
                      placeholder="Nhập lại mật khẩu đã cấp"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    {isCreating ? "Đang tạo tài khoản" : "Tạo tài khoản"}
                  </Button>
                  <Button type="button" variant="outline" onClick={toggleCreateForm} disabled={isCreating}>
                    Hủy
                  </Button>
                </div>

                <FormMessage>Nhân viên sẽ đăng nhập bằng đúng email và mật khẩu do owner cấp ở đây.</FormMessage>
              </form>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader className="flex flex-col gap-4 border-b border-stone-100 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl">Danh sách nhân viên</CardTitle>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Lọc theo vai trò hoặc tìm nhanh theo tên và email để kiểm tra tài khoản đang hoạt động.
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

            {isLoading ? (
              <EmptyPanel title="Đang tải danh sách nhân viên" description="Hệ thống đang đồng bộ các tài khoản nội bộ từ backend." />
            ) : items.length === 0 ? (
              <EmptyPanel
                title="Chưa có nhân viên phù hợp"
                description="Danh sách hiện chưa có tài khoản nào khớp với bộ lọc đang chọn."
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
                              <p className="text-sm text-[var(--color-foreground-muted)]">{item.profile.email ?? "Chưa có email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <StatusPill label={ROLE_LABELS[item.role]} tone={ROLE_TONES[item.role]} className="px-2.5 py-1" />
                        </td>
                        <td className="px-2 py-4 text-sm text-[var(--color-foreground-muted)]">{formatShortDate(item.joinedAt)}</td>
                        <td className="px-2 py-4">
                          <div className="flex justify-end">
                            {canDeleteEmployee(item) ? (
                              deleteCandidateId === item.id ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={cancelDelete}
                                    disabled={deletingId === item.id}
                                  >
                                    Hủy
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => confirmDelete(item.id)}
                                    disabled={deletingId === item.id}
                                  >
                                    {deletingId === item.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    Xóa
                                  </Button>
                                </div>
                              ) : (
                                <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="Xóa nhân viên" onClick={() => startDelete(item)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )
                            ) : (
                              <span className="text-sm text-[var(--color-foreground-muted)]">Không khả dụng</span>
                            )}
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
      </div>
    </div>
  );
}
