import { SectionPlaceholder } from "@/components/common/section-placeholder";

export function ReportsPage() {
  return (
    <SectionPlaceholder
      title="Báo cáo"
      description="Khu vực tổng hợp doanh thu, thu chi và đối soát để giảm khối lượng Excel thủ công."
      checklist={[
        "Dashboard hiện đã cung cấp summary, sales trend và cash overview.",
        "Module reports trong API sẵn sàng để mở rộng thêm báo cáo ngày, tuần, tháng.",
        "Biểu đồ dùng Recharts để dễ mở rộng cho mobile-friendly dashboard về sau."
      ]}
    />
  );
}

