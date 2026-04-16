import { Badge } from "@gold-shop/ui";

import { SignOutButton } from "@/components/layout/sign-out-button";

interface AppHeaderProps {
  email?: string;
}

export function AppHeader({ email }: AppHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white/90 px-6 py-5 shadow-panel lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <Badge className="w-fit border-amber-200 bg-amber-50 text-amber-900">Vận hành cửa hàng vàng</Badge>
        <div>
          <h2 className="text-xl font-semibold text-stone-950">Bảng điều hành nội bộ</h2>
          <p className="text-sm text-stone-600">
            Đơn giản hóa giao dịch, thu chi, tồn kho và báo cáo hằng ngày.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600 sm:block">
          {email ?? "Đang đồng bộ phiên đăng nhập"}
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}

