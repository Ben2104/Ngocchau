export const APP_ROLES = ["owner", "manager", "staff", "accountant"] as const;
export const PRIMARY_ROUTE_KEYS = ["dashboard", "importExcel", "importHistory", "employees", "settings"] as const;
export const NAV_ICON_KEYS = ["dashboard", "upload", "history", "users", "settings"] as const;
export const BADGE_TONES = ["neutral", "success", "warning", "danger", "accent", "info"] as const;
export const DASHBOARD_ACTIVITY_STATUSES = ["success", "warning", "failure"] as const;
export const IMPORT_HISTORY_STATUSES = ["success", "warning", "failure"] as const;
export const VALIDATION_SEVERITIES = ["error", "warning", "info"] as const;
export const IMPORT_ACTION_STATES = [
  "idle",
  "file_selected",
  "uploading",
  "uploaded",
  "validating",
  "validated",
  "blocked",
  "committing",
  "committed"
] as const;
export const SORT_DIRECTIONS = ["asc", "desc"] as const;

export type AppRole = (typeof APP_ROLES)[number];
export type PrimaryRouteKey = (typeof PRIMARY_ROUTE_KEYS)[number];
export type NavIconKey = (typeof NAV_ICON_KEYS)[number];
export type BadgeTone = (typeof BADGE_TONES)[number];
export type DashboardActivityStatus = (typeof DASHBOARD_ACTIVITY_STATUSES)[number];
export type ImportHistoryStatus = (typeof IMPORT_HISTORY_STATUSES)[number];
export type ValidationSeverity = (typeof VALIDATION_SEVERITIES)[number];
export type ImportActionState = (typeof IMPORT_ACTION_STATES)[number];
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export interface ApiResponseMeta {
  requestId: string;
  timestamp: string;
  path?: string;
}

export interface ApiErrorShape {
  code: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiResponseMeta;
  error?: ApiErrorShape;
}

export interface PaginatedMeta extends ApiResponseMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SearchableParams extends PaginationParams {
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export interface NavigationItemConfig {
  key: PrimaryRouteKey;
  href: string;
  label: string;
  icon: NavIconKey;
}

export interface ScreenBreadcrumb {
  label: string;
  href?: string;
}

export interface ScreenAction {
  key: string;
  label: string;
  icon?: string;
  tone?: BadgeTone;
}

export interface DisplayPerson {
  id: string;
  fullName: string;
  initials: string;
  avatarUrl?: string | null;
  email?: string;
  subtitle?: string;
}

export interface AuthenticatedUser {
  id: string;
  supabaseUserId: string;
  email: string;
  fullName?: string | null;
  employeeId?: string | null;
  role: AppRole;
  status: string;
}

export interface DashboardRangeQuery {
  from?: string;
  to?: string;
}

export interface DashboardSummary {
  totalSales: number;
  transactionCount: number;
  averageOrderValue: number;
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
  inventoryItems: number;
  lowStockItems: number;
}

export interface SalesTrendPoint {
  date: string;
  revenue: number;
  transactionCount: number;
}

export interface CashOverviewPoint {
  date: string;
  cashIn: number;
  cashOut: number;
}

export interface DashboardTopStrip {
  dateLabel: string;
  goldPriceLabel: string;
  unreadCount: number;
}

export interface DashboardMetricTile {
  key: string;
  label: string;
  displayValue: string;
  value: number;
  helperText: string;
  highlightTone: BadgeTone;
  changeLabel?: string;
}

export interface DashboardActivityItem {
  id: string;
  actor: DisplayPerson;
  occurredAt: string;
  status: DashboardActivityStatus;
  statusLabel: string;
}

export interface DashboardProductInsight {
  id: string;
  name: string;
  description: string;
  price: number;
  trendLabel: string;
  trendTone: BadgeTone;
  accentTone: "gold" | "blue";
}

export interface SoftDeleteFields {
  deletedAt?: string | null;
  deletedBy?: string | null;
}

export interface TransactionRecord extends SoftDeleteFields {
  id: string;
  customerName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: "cash" | "bank" | "mixed";
  transactionDate: string;
  notes?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface CashbookEntry extends SoftDeleteFields {
  id: string;
  entryType: "in" | "out";
  amount: number;
  entryDate: string;
  reference?: string | null;
  notes?: string | null;
  createdBy?: string | null;
}

export interface InventoryRecord extends SoftDeleteFields {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  reorderLevel: number;
  updatedAt: string;
}

export type ImportSessionStatus =
  | "uploaded"
  | "validated"
  | "validation_failed"
  | "committed";

export interface ExcelImportValidationError {
  row: number;
  field: string;
  message: string;
}

export interface ImportSession {
  id: string;
  fileName: string;
  storagePath: string;
  status: ImportSessionStatus;
  validationSummary?: {
    validRowCount: number;
    invalidRowCount: number;
    errors: ExcelImportValidationError[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ImportValidationIssue {
  id: string;
  rowNumber: number;
  field?: string;
  message: string;
  severity: ValidationSeverity;
}

export interface ImportPreviewRow {
  id: string;
  rowNumber: number;
  productCode: string | null;
  productName: string;
  weightLabel: string | null;
  listedPrice: number | null;
  severity: ValidationSeverity | "default";
}

export interface ImportSummary {
  totalRows: number;
  validRows: number;
  criticalIssues: number;
  warningIssues: number;
  displayedRows: number;
  totalPreviewRows: number;
  supportedFileTypes: string[];
}

export interface ImportScreenState {
  actionState: ImportActionState;
  isBusy: boolean;
  canValidate: boolean;
  canCommit: boolean;
  statusMessage?: string | null;
}

export interface ImportHistoryStats {
  totalFiles: number;
  successRate: number;
  successDelta: number;
  dataErrors: number;
  storageBytes: number;
}

export interface ImportHistoryRowAction {
  key: "view" | "download" | "retry";
  label: string;
}

export interface ImportHistoryItem {
  id: string;
  fileName: string;
  uploadedBy: DisplayPerson;
  processedAt: string;
  status: ImportHistoryStatus;
  errorDisplay: string;
  rowActions: ImportHistoryRowAction[];
}

export interface ImportHistoryQueryParams extends SearchableParams {
  status?: ImportHistoryStatus | "all";
}

export interface AuditLogRecord {
  id: string;
  actorUserId?: string | null;
  actorRole: AppRole;
  action: string;
  entityType: string;
  entityId?: string | null;
  moduleName: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface EmployeeListItem {
  id: string;
  profile: DisplayPerson;
  role: AppRole;
  joinedAt: string;
  canEditRole: boolean;
}

export interface EmployeeListParams extends SearchableParams {
  role?: AppRole | "all";
}

export interface EmployeePermissionSet {
  canCreateEmployee: boolean;
  canEditRoles: boolean;
  canViewSecurityPolicy: boolean;
}

export interface EmployeeSecurityNotice {
  title: string;
  description: string;
  actionLabel: string;
}

export interface EmployeeDirectoryResponse {
  items: EmployeeListItem[];
  note?: string;
}
