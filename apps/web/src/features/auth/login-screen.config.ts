export const loginScreenCopy = {
  badgeLabel: "Ngọc Châu Internal",
  heroTitle: "Giảm thao tác thủ công để đội ngũ tập trung vào vận hành và chất lượng dữ liệu mỗi ngày.",
  heroDescription:
    "Màn hình đăng nhập chỉ là entry point. Toàn bộ shell phía sau đã được tách thành route config, permission map và data adapters để nối backend an toàn hơn.",
  heroHighlights: [
    {
      title: "Dashboard tập trung",
      description: "Theo dõi doanh thu, dòng tiền và trạng thái nhập liệu trong cùng một shell."
    },
    {
      title: "Luồng import nhiều bước",
      description: "Upload, validate và commit được tách rõ để backend có thể gắn logic thật sau này."
    },
    {
      title: "Nhân sự và phân quyền",
      description: "Role guard đang đi qua enum và permission map thay vì hard-code trong view."
    }
  ],
  form: {
    title: "Đăng nhập nội bộ",
    description: "Dùng tài khoản Supabase Auth để truy cập phòng điều hành của tiệm vàng.",
    emailLabel: "Email",
    emailPlaceholder: "owner@ngocchau.vn",
    passwordLabel: "Mật khẩu",
    passwordPlaceholder: "••••••••",
    submitLabel: "Vào hệ thống",
    pendingLabel: "Đang đăng nhập...",
    forgotPasswordLabel: "Quên mật khẩu?",
    helperLabel: "Chỉ dành cho tài khoản nội bộ đã được cấp quyền."
  }
} as const;

export type LoginFormCopy = (typeof loginScreenCopy)["form"];
