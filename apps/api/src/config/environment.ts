import { z } from "zod";

export const environmentSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_NAME: z.string().default("Gold Shop System API"),
  APP_TIMEZONE: z.string().default("Asia/Ho_Chi_Minh"),
  APP_ALLOWED_ORIGINS: z.string().default("http://localhost:3000"),

  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_ISSUER: z.string().url(),
  SUPABASE_JWT_AUDIENCE: z.string().default("authenticated"),
  SUPABASE_JWKS_URL: z.string().url(),
  SUPABASE_STORAGE_BUCKET_EXCEL_IMPORTS: z.string().default("excel-imports"),

  APP_PROFILE_TABLES: z.string().default("users"),
  APP_PROFILE_USER_ID_COLUMN: z.string().default("user_id"),
  APP_PROFILE_ROLE_COLUMN: z.string().default("role"),
  APP_PROFILE_STATUS_COLUMN: z.string().default("status"),
  APP_PROFILE_EMPLOYEE_ID_COLUMN: z.string().default("employee_id"),
  APP_PROFILE_FULL_NAME_COLUMN: z.string().default("full_name"),

  APP_AUDIT_LOGS_TABLE: z.string().default("audit_logs"),
  APP_IMPORT_SESSIONS_TABLE: z.string().default("import_sessions"),

  APP_TRANSACTIONS_TABLE: z.string().default("transactions"),
  APP_TRANSACTION_DATE_COLUMN: z.string().default("transaction_date"),
  APP_TRANSACTION_AMOUNT_COLUMN: z.string().default("total_amount"),
  APP_TRANSACTION_STATUS_COLUMN: z.string().default("status"),

  APP_CASHBOOK_TABLE: z.string().default("cashbook_entries"),
  APP_CASHBOOK_DATE_COLUMN: z.string().default("entry_date"),
  APP_CASHBOOK_AMOUNT_COLUMN: z.string().default("amount"),
  APP_CASHBOOK_TYPE_COLUMN: z.string().default("entry_type"),

  APP_PRODUCTS_TABLE: z.string().default("products"),
  APP_PRODUCTS_STOCK_COLUMN: z.string().default("current_stock"),
  APP_PRODUCTS_REORDER_LEVEL_COLUMN: z.string().default("reorder_level"),

  APP_INVENTORY_TABLE: z.string().default("inventory"),
  APP_INVENTORY_QUANTITY_COLUMN: z.string().default("quantity")
});

export type EnvironmentVariables = z.infer<typeof environmentSchema>;

export function validateEnvironment(config: Record<string, unknown>) {
  return environmentSchema.parse(config);
}
