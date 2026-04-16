import { SectionPlaceholder } from "@/components/common/section-placeholder";

export function InventoryPage() {
  return (
    <SectionPlaceholder
      title="Tồn kho"
      description="Giám sát số lượng vàng, sản phẩm và các mã hàng đang sắp chạm ngưỡng thiếu."
      checklist={[
        "Dashboard đã tiêu thụ dữ liệu low stock từ API inventory/dashboard.",
        "Route tồn kho được chuẩn bị để gắn bảng SKU và lịch sử điều chỉnh.",
        "Mẫu soft delete ở backend giúp ẩn dữ liệu ngừng kinh doanh nhưng vẫn giữ lịch sử."
      ]}
    />
  );
}

