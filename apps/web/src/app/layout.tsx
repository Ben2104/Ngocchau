import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import { publicEnv } from "@/lib/utils/env";
import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam"
});

export const metadata: Metadata = {
  title: `${publicEnv.appName} | Dashboard`,
  description: "Hệ thống quản lý cửa hàng vàng dành cho vận hành nội bộ."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className={beVietnamPro.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
