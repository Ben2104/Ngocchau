import type { EmployeeListItem } from "@gold-shop/types";
import { getInitials } from "@gold-shop/utils";

function buildEmployee(
  id: string,
  fullName: string,
  role: EmployeeListItem["role"],
  joinedAt: string,
  options?: {
    email?: string;
    canEditRole?: boolean;
    subtitle?: string;
  }
): EmployeeListItem {
  return {
    id,
    role,
    joinedAt,
    canEditRole: options?.canEditRole ?? true,
    profile: {
      id,
      fullName,
      initials: getInitials(fullName),
      email: options?.email,
      subtitle: options?.subtitle
    }
  };
}

export const employeeDirectoryMock: EmployeeListItem[] = [
  buildEmployee("employee-1", "Nguyễn Mỹ Hạnh", "owner", "2024-02-10T08:00:00.000Z", {
    email: "owner@ngocchau.vn",
    canEditRole: false,
    subtitle: "Điều hành hệ thống"
  }),
  buildEmployee("employee-2", "Trần Quốc Minh", "manager", "2024-05-12T08:00:00.000Z", {
    email: "manager@ngocchau.vn",
    subtitle: "Quản lý ca sáng"
  }),
  buildEmployee("employee-3", "Lê Thu Trang", "accountant", "2024-06-18T08:00:00.000Z", {
    email: "accounting@ngocchau.vn",
    canEditRole: false,
    subtitle: "Kiểm soát thu chi"
  }),
  buildEmployee("employee-4", "Đỗ Quốc Minh", "staff", "2024-09-01T08:00:00.000Z", {
    email: "staff.minh@ngocchau.vn",
    subtitle: "Quầy giao dịch"
  }),
  buildEmployee("employee-5", "Phạm Hồng Ngọc", "staff", "2024-10-22T08:00:00.000Z", {
    email: "staff.ngoc@ngocchau.vn",
    subtitle: "Hỗ trợ nhập liệu"
  }),
  buildEmployee("employee-6", "Trần Hải Yến", "manager", "2025-01-03T08:00:00.000Z", {
    email: "ops.yen@ngocchau.vn",
    subtitle: "Giám sát quy trình"
  }),
  buildEmployee("employee-7", "Nguyễn Thành Đạt", "staff", "2025-02-14T08:00:00.000Z", {
    email: "staff.dat@ngocchau.vn",
    subtitle: "Kho và hậu cần"
  })
];
