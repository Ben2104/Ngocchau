import type { Metadata } from "next";

import { publicEnv } from "@/lib/utils/env";
import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

export const metadata: Metadata = {
  title: `${publicEnv.appName} | Dashboard`,
  description: "Hệ thống quản lý cửa hàng vàng dành cho vận hành nội bộ."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body style={{ fontFamily: '"Be Vietnam Pro", system-ui, sans-serif' }}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
