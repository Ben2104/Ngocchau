import type { AppRole } from "@gold-shop/types";

export const API_PREFIX = "/api/v1";
export const DEFAULT_PAGE_SIZE = 20;
export const EXCEL_IMPORT_BUCKET = "excel-imports";

export const ROLE_LABELS: Record<AppRole, string> = {
  owner: "Chủ cửa hàng",
  manager: "Quản lý",
  staff: "Nhân viên",
  accountant: "Kế toán"
};

export const DASHBOARD_NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan" },
  { href: "/giao-dich", label: "Giao dịch" },
  { href: "/thu-chi", label: "Thu chi" },
  { href: "/ton-kho", label: "Tồn kho" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/khach-hang", label: "Khách hàng" },
  { href: "/nhan-vien", label: "Nhân viên" },
  { href: "/bao-cao", label: "Báo cáo" },
  { href: "/import-excel", label: "Import Excel" },
  { href: "/cai-dat", label: "Cài đặt" }
] as const;

export const QUERY_KEYS = {
  authMe: ["auth", "me"],
  dashboardSummary: ["dashboard", "summary"],
  dashboardSalesTrend: ["dashboard", "sales-trend"],
  dashboardCashOverview: ["dashboard", "cash-overview"],
  transactions: ["transactions"],
  cashbook: ["cashbook"],
  inventory: ["inventory"],
  auditLogs: ["audit-logs"],
  importSessions: ["import-sessions"]
} as const;

export const AUDIT_MODULES = {
  auth: "auth",
  dashboard: "dashboard",
  transactions: "transactions",
  cashbook: "cashbook",
  inventory: "inventory",
  excelImport: "excel-import",
  auditLogs: "audit-logs"
} as const;

export const AUDIT_ACTIONS = {
  create: "create",
  update: "update",
  delete: "delete",
  login: "login",
  validate: "validate",
  commit: "commit",
  upload: "upload",
  read: "read"
} as const;

