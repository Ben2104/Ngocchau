export const APP_ROLES = ["owner", "manager", "staff", "accountant"] as const;

export type AppRole = (typeof APP_ROLES)[number];

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

