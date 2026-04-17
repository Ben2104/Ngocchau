import { AlertTriangle, ShieldAlert } from "lucide-react";

import { EmptyPanel } from "@/components/common/empty-panel";
import { InfoBanner } from "@/components/common/info-banner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { ApiResponseError, BackendUnavailableError, serverApiRequest } from "@/lib/api-client/server";
import { buildCurrentUserProfile } from "@/lib/current-user";
import { requireAuthenticatedSession } from "@/lib/guards/require-auth";
import { publicEnv } from "@/lib/utils/env";
import { CurrentUserProvider } from "@/providers/current-user-provider";
import type { AuthenticatedUser } from "@gold-shop/types";

function DashboardBootstrapState({
  tone,
  icon,
  title,
  description,
  panelTitle,
  panelDescription,
  helper
}: {
  tone: "warning" | "danger";
  icon: React.ReactNode;
  title: string;
  description: string;
  panelTitle: string;
  panelDescription: string;
  helper?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--color-surface-base)] px-4 py-6 lg:px-10 lg:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center">
        <div className="w-full space-y-5">
          <InfoBanner tone={tone} icon={icon} title={title} description={description} />
          <EmptyPanel
            title={panelTitle}
            description={panelDescription}
            action={
              <div className="flex flex-col items-center gap-3">
                <SignOutButton />
                {helper ? <div className="text-sm leading-6 text-[var(--color-foreground-muted)]">{helper}</div> : null}
              </div>
            }
          />
        </div>
      </div>
    </main>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuthenticatedSession();
  let user: AuthenticatedUser;

  try {
    user = await serverApiRequest<AuthenticatedUser>("/auth/me", session.access_token);
  } catch (error) {
    if (error instanceof BackendUnavailableError) {
      const isDevelopment = process.env.NODE_ENV === "development";

      return (
        <DashboardBootstrapState
          tone="danger"
          icon={<AlertTriangle className="h-4 w-4" />}
          title="Backend điều hành chưa sẵn sàng"
          description={
            isDevelopment
              ? "Dashboard đang khóa để tránh mở sai quyền khi API nội bộ chưa khởi động."
              : "Dashboard chưa thể lấy hồ sơ phân quyền từ API nội bộ nên tạm thời không mở vào màn hình vận hành."
          }
          panelTitle="Không thể tải hồ sơ quyền truy cập"
          panelDescription="Vai trò và quyền thao tác của tài khoản được xác nhận qua API /auth/me. Khi backend không phản hồi, màn hình sẽ fail-close thay vì dùng dữ liệu phiên cục bộ."
          helper={
            isDevelopment ? (
              <div className="space-y-1 text-center">
                <p>
                  Kiểm tra API tại <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">{publicEnv.apiBaseUrl}</code>
                </p>
                <p>
                  Chạy <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">pnpm dev</code> hoặc{" "}
                  <code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">pnpm dev:api</code>, sau đó tải lại trang.
                </p>
              </div>
            ) : null
          }
        />
      );
    }

    if (error instanceof ApiResponseError && (error.status === 401 || error.status === 403)) {
      const isBlocked = error.status === 403;

      return (
        <DashboardBootstrapState
          tone={isBlocked ? "danger" : "warning"}
          icon={<ShieldAlert className="h-4 w-4" />}
          title={isBlocked ? "Tài khoản đang bị khóa khỏi dashboard" : "Tài khoản chưa sẵn sàng trong hệ thống"}
          description={
            isBlocked
              ? "API nội bộ đã xác thực phiên đăng nhập nhưng từ chối quyền truy cập dashboard của tài khoản này."
              : "Phiên Supabase còn hiệu lực, nhưng API nội bộ chưa tìm thấy hồ sơ quyền truy cập hợp lệ cho tài khoản này."
          }
          panelTitle={isBlocked ? "Cần kiểm tra lại trạng thái nhân sự" : "Cần cấu hình hồ sơ nội bộ"}
          panelDescription={
            isBlocked
              ? "Tài khoản có thể đang bị khóa hoặc chưa được kích hoạt. Chủ tiệm cần kiểm tra lại trạng thái nhân sự trước khi cho đăng nhập."
              : "Tài khoản này chưa có hồ sơ nhân sự nội bộ hoặc chưa được đồng bộ xong. Chủ tiệm cần tạo hoặc hoàn tất cấu hình nhân viên trước khi dùng dashboard."
          }
        />
      );
    }

    if (error instanceof ApiResponseError && error.status >= 500) {
      return (
        <DashboardBootstrapState
          tone="danger"
          icon={<AlertTriangle className="h-4 w-4" />}
          title="Dịch vụ phân quyền đang gặp lỗi"
          description="API nội bộ đang phản hồi lỗi máy chủ nên dashboard tạm thời không mở vào vùng vận hành."
          panelTitle="Không thể xác minh quyền truy cập"
          panelDescription="Vai trò và quyền thao tác chỉ được lấy từ backend. Khi API trả lỗi 5xx, màn hình sẽ khóa để tránh hiển thị sai quyền hoặc dữ liệu không đầy đủ."
        />
      );
    }

    throw error;
  }

  const currentUser = buildCurrentUserProfile(user);

  return (
    <CurrentUserProvider value={currentUser}>
      <DashboardShell currentUser={currentUser}>{children}</DashboardShell>
    </CurrentUserProvider>
  );
}
