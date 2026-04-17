import { z } from "zod";

import { APP_ROLES, EMPLOYEE_ASSIGNABLE_ROLES } from "@gold-shop/types";

const isoDate = z.string().datetime().or(z.string().date());

export const LoginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự")
});

export const DashboardRangeQuerySchema = z.object({
  from: isoDate.optional(),
  to: isoDate.optional()
});

export const TransactionCreateSchema = z.object({
  customerName: z.string().min(1, "Tên khách hàng là bắt buộc"),
  productName: z.string().min(1, "Sản phẩm là bắt buộc"),
  quantity: z.coerce.number().positive("Số lượng phải lớn hơn 0"),
  unitPrice: z.coerce.number().nonnegative("Đơn giá không được âm"),
  totalAmount: z.coerce.number().nonnegative("Thành tiền không được âm"),
  paymentMethod: z.enum(["cash", "bank", "mixed"]),
  transactionDate: isoDate,
  notes: z.string().max(500).optional()
});

export const TransactionUpdateSchema = TransactionCreateSchema.partial().extend({
  id: z.string().uuid("Mã giao dịch không hợp lệ")
});

export const CashbookCreateSchema = z.object({
  entryType: z.enum(["in", "out"]),
  amount: z.coerce.number().positive("Số tiền phải lớn hơn 0"),
  entryDate: isoDate,
  reference: z.string().max(100).optional(),
  notes: z.string().max(500).optional()
});

export const InventoryAdjustmentSchema = z.object({
  productCode: z.string().min(1, "Mã sản phẩm là bắt buộc"),
  productName: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  quantity: z.coerce.number(),
  reorderLevel: z.coerce.number().nonnegative()
});

export const ExcelImportRowSchema = z.object({
  productCode: z.string().min(1),
  productName: z.string().min(1),
  category: z.string().optional().default("gold"),
  quantity: z.coerce.number(),
  unitPrice: z.coerce.number().nonnegative(),
  transactionDate: isoDate,
  notes: z.string().optional()
});

export const ExcelImportValidateSchema = z.object({
  sessionId: z.string().uuid("Session import không hợp lệ")
});

export const ExcelImportCommitSchema = z.object({
  sessionId: z.string().uuid("Session import không hợp lệ"),
  commitAsRole: z.enum(APP_ROLES).optional()
});

export const RoleAssignmentSchema = z.object({
  role: z.enum(APP_ROLES)
});

export const EmployeeCreateSchema = z.object({
  fullName: z.string().min(1, "Họ và tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  role: z.enum(EMPLOYEE_ASSIGNABLE_ROLES)
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type DashboardRangeQueryInput = z.infer<typeof DashboardRangeQuerySchema>;
export type TransactionCreateInput = z.infer<typeof TransactionCreateSchema>;
export type TransactionUpdateInput = z.infer<typeof TransactionUpdateSchema>;
export type CashbookCreateInput = z.infer<typeof CashbookCreateSchema>;
export type InventoryAdjustmentInput = z.infer<typeof InventoryAdjustmentSchema>;
export type ExcelImportRowInput = z.infer<typeof ExcelImportRowSchema>;
export type ExcelImportValidateInput = z.infer<typeof ExcelImportValidateSchema>;
export type ExcelImportCommitInput = z.infer<typeof ExcelImportCommitSchema>;
export type EmployeeCreateInput = z.infer<typeof EmployeeCreateSchema>;
