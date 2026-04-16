import { SectionPlaceholder } from "@/components/common/section-placeholder";

export default function SanPhamPage() {
  return (
    <SectionPlaceholder
      title="Sản phẩm"
      description="Danh mục sản phẩm vàng, nữ trang và cấu hình SKU bán hàng."
      checklist={[
        "Giữ trang này như điểm mở rộng cho quản lý catalog.",
        "Inventory và transactions có thể dùng chung thông tin SKU từ đây.",
        "Có thể nối thêm import sản phẩm từ Excel ở giai đoạn sau."
      ]}
    />
  );
}

