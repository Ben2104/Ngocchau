import { SectionPlaceholder } from "@/components/common/section-placeholder";

export default function CaiDatPage() {
  return (
    <SectionPlaceholder
      title="Cài đặt"
      description="Khu vực dành cho owner cấu hình vai trò, tham số kinh doanh và tích hợp."
      checklist={[
        "Audit logs và role guard đã có nền để mở rộng settings an toàn.",
        "Nên gom cấu hình hệ thống vào API thay vì xử lý logic tại web.",
        "Khu vực này phù hợp để thêm bảng ánh xạ schema Supabase khi cần."
      ]}
    />
  );
}
