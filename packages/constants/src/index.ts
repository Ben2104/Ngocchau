import type {
  AppRole,
  BadgeTone,
  EmployeePermissionSet,
  ImportHistoryStatus,
  NavigationItemConfig,
  PrimaryRouteKey,
  ValidationSeverity
} from "@gold-shop/types";

export const API_PREFIX = "/api/v1";
export const DEFAULT_PAGE_SIZE = 20;
export const EXCEL_IMPORT_BUCKET = "excel-imports";
export const IMPORT_HISTORY_PAGE_SIZE = 4;
export const EMPLOYEE_DIRECTORY_PAGE_SIZE = 5;
export const SUPPORTED_IMPORT_FILE_TYPES = [".xlsx", ".csv"] as const;

export const ROLE_LABELS: Record<AppRole, string> = {
  owner: "Chủ cửa hàng",
  manager: "Quản lý",
  staff: "Nhân viên",
  accountant: "Kế toán"
};

export const ROLE_TONES: Record<AppRole, BadgeTone> = {
  owner: "warning",
  manager: "accent",
  staff: "neutral",
  accountant: "info"
};

export const ROLE_PERMISSION_MAP: Record<AppRole, EmployeePermissionSet> = {
  owner: {
    canCreateEmployee: true,
    canEditRoles: true,
    canViewSecurityPolicy: true
  },
  manager: {
    canCreateEmployee: true,
    canEditRoles: false,
    canViewSecurityPolicy: true
  },
  accountant: {
    canCreateEmployee: false,
    canEditRoles: false,
    canViewSecurityPolicy: false
  },
  staff: {
    canCreateEmployee: false,
    canEditRoles: false,
    canViewSecurityPolicy: false
  }
};

export const PRIMARY_NAV_ITEMS: readonly NavigationItemConfig[] = [
  { key: "dashboard", href: "/dashboard", label: "Tổng quan", icon: "dashboard" },
  { key: "importExcel", href: "/import-excel", label: "Nhập dữ liệu", icon: "upload" },
  { key: "importHistory", href: "/lich-su", label: "Lịch sử", icon: "history" },
  { key: "employees", href: "/nhan-vien", label: "Nhân viên", icon: "users" },
  { key: "settings", href: "/cai-dat", label: "Cài đặt", icon: "settings" }
] as const;

export const DASHBOARD_NAV_ITEMS = PRIMARY_NAV_ITEMS;

export const PRIMARY_ROUTE_META: Record<
  PrimaryRouteKey,
  {
    title: string;
    description: string;
  }
> = {
  dashboard: {
    title: "Tổng quan hôm nay",
    description: "Dữ liệu thời gian thực cho vận hành, giao dịch và mặt hàng trọng điểm."
  },
  importExcel: {
    title: "Nhập dữ liệu Excel",
    description: "Tải file, kiểm tra dữ liệu và chuẩn bị commit theo flow nhiều bước."
  },
  importHistory: {
    title: "Lịch sử nhập file",
    description: "Tra cứu file đã xử lý, thống kê lỗi và theo dõi trạng thái nhập liệu."
  },
  employees: {
    title: "Quản lý nhân viên",
    description: "Quản lý quyền truy cập và đội ngũ vận hành tiệm vàng."
  },
  settings: {
    title: "Cài đặt",
    description: "Khu vực cấu hình hệ thống và tích hợp vận hành."
  }
};

export const IMPORT_HISTORY_STATUS_META: Record<
  ImportHistoryStatus,
  {
    label: string;
    tone: BadgeTone;
  }
> = {
  success: { label: "Thành công", tone: "success" },
  warning: { label: "Có lỗi", tone: "warning" },
  failure: { label: "Thất bại", tone: "danger" }
};

export const VALIDATION_SEVERITY_META: Record<
  ValidationSeverity,
  {
    label: string;
    tone: BadgeTone;
  }
> = {
  error: { label: "Lỗi nghiêm trọng", tone: "danger" },
  warning: { label: "Cảnh báo", tone: "warning" },
  info: { label: "Thông tin", tone: "info" }
};

export const QUERY_KEYS = {
  authMe: ["auth", "me"],
  dashboardSummary: ["dashboard", "summary"],
  dashboardSalesTrend: ["dashboard", "sales-trend"],
  dashboardCashOverview: ["dashboard", "cash-overview"],
  dashboardActivity: ["dashboard", "activity"],
  dashboardProducts: ["dashboard", "products"],
  transactions: ["transactions"],
  cashbook: ["cashbook"],
  inventory: ["inventory"],
  auditLogs: ["audit-logs"],
  importSessions: ["import-sessions"],
  importPreview: ["import", "preview"],
  importHistory: ["import", "history"],
  employees: ["employees"]
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
