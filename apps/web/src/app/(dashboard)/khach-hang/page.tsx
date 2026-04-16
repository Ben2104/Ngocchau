import { SectionPlaceholder } from "@/components/common/section-placeholder";

export default function KhachHangPage() {
  return (
    <SectionPlaceholder
      title="Khách hàng"
      description="Dự phòng cho lịch sử mua hàng, khách quen và đối soát công nợ nếu cần."
      checklist={[
        "Trang hiện tại giữ chỗ cho hồ sơ khách hàng và lịch sử giao dịch.",
        "Có thể nối với transactions để xem tần suất mua hàng.",
        "Nên giữ business logic phía API khi mở rộng tích điểm hoặc CRM nhẹ."
      ]}
    />
  );
}

