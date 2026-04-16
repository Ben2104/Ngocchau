import { SectionPlaceholder } from "@/components/common/section-placeholder";

export function TransactionsPage() {
  return (
    <SectionPlaceholder
      title="Quản lý giao dịch"
      description="Nơi nhân viên nhập giao dịch bán vàng, chỉnh sửa hóa đơn và theo dõi trạng thái xử lý."
      checklist={[
        "Form tạo giao dịch đã có contract và validation dùng chung với API.",
        "Backend route `/transactions` sẵn sàng cho create, update và danh sách gần đây.",
        "Audit log nền tảng đã sẵn để lưu thao tác tạo và chỉnh sửa."
      ]}
    />
  );
}

