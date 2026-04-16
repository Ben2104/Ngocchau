import { SectionPlaceholder } from "@/components/common/section-placeholder";

export function CashbookPage() {
  return (
    <SectionPlaceholder
      title="Sổ thu chi"
      description="Theo dõi các khoản thu và chi vận hành để đối soát cuối ngày."
      checklist={[
        "Route thu chi đã được bảo vệ bằng phiên đăng nhập.",
        "API module cashbook đã có điểm bắt đầu cho tạo bút toán và đọc danh sách.",
        "Vai trò kế toán có thể mở rộng thêm luồng đối soát và xuất báo cáo."
      ]}
    />
  );
}

