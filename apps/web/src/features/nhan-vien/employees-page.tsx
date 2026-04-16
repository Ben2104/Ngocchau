import { SectionPlaceholder } from "@/components/common/section-placeholder";

export function EmployeesPage() {
  return (
    <SectionPlaceholder
      title="Nhân viên"
      description="Quản lý trạng thái tài khoản, vai trò và liên kết nhân viên với Supabase Auth."
      checklist={[
        "Backend đã có module `employees` và `users` để mở rộng hồ sơ nhân sự.",
        "Role guard trên API được xây dựng theo các vai trò owner, manager, staff, accountant.",
        "Trang này là điểm nối tiếp cho phân quyền thao tác theo nhân sự."
      ]}
    />
  );
}

