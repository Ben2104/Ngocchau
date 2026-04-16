import type { ImportHistoryItem, ImportHistoryStats } from "@gold-shop/types";
import { getInitials } from "@gold-shop/utils";

function buildPerson(id: string, fullName: string) {
  return {
    id,
    fullName,
    initials: getInitials(fullName)
  };
}

export const importHistoryStatsMock: ImportHistoryStats = {
  totalFiles: 1_284,
  successRate: 0.98,
  successDelta: 0.02,
  dataErrors: 12,
  storageBytes: 4.2 * 1024 * 1024 * 1024
};

export const importHistoryItemsMock: ImportHistoryItem[] = [
  {
    id: "history-1",
    fileName: "Bao_cao_ngay_15_10.xlsx",
    uploadedBy: buildPerson("staff-1", "Trần Thị B"),
    processedAt: "2026-04-15T14:20:00.000Z",
    status: "success",
    errorDisplay: "0",
    rowActions: [
      { key: "view", label: "Xem chi tiết" },
      { key: "download", label: "Tải lại" }
    ]
  },
  {
    id: "history-2",
    fileName: "Kiem_kho_vang_SJC_v3.csv",
    uploadedBy: buildPerson("staff-2", "Lê Văn A"),
    processedAt: "2026-04-14T09:15:00.000Z",
    status: "warning",
    errorDisplay: "12",
    rowActions: [
      { key: "view", label: "Xem lỗi" },
      { key: "retry", label: "Thử lại" }
    ]
  },
  {
    id: "history-3",
    fileName: "Danh_muc_san_pham_moi.xlsx",
    uploadedBy: buildPerson("staff-3", "Trần Thị B"),
    processedAt: "2026-04-13T16:45:00.000Z",
    status: "failure",
    errorDisplay: "Toàn bộ",
    rowActions: [
      { key: "view", label: "Xem nguyên nhân" },
      { key: "retry", label: "Nhập lại" }
    ]
  },
  {
    id: "history-4",
    fileName: "Gia_vang_the_gioi_cap_nhat.csv",
    uploadedBy: buildPerson("staff-4", "Lê Văn A"),
    processedAt: "2026-04-13T08:30:00.000Z",
    status: "success",
    errorDisplay: "0",
    rowActions: [
      { key: "view", label: "Xem chi tiết" },
      { key: "download", label: "Tải lại" }
    ]
  },
  {
    id: "history-5",
    fileName: "Ton_kho_vang_chi_nhanh_HCM.xlsx",
    uploadedBy: buildPerson("staff-5", "Nguyễn Mỹ Hạnh"),
    processedAt: "2026-04-12T13:15:00.000Z",
    status: "success",
    errorDisplay: "1",
    rowActions: [
      { key: "view", label: "Xem chi tiết" },
      { key: "download", label: "Tải lại" }
    ]
  },
  {
    id: "history-6",
    fileName: "Bang_gia_nhan_cong_24k.csv",
    uploadedBy: buildPerson("staff-6", "Đỗ Quốc Minh"),
    processedAt: "2026-04-10T18:45:00.000Z",
    status: "warning",
    errorDisplay: "3",
    rowActions: [
      { key: "view", label: "Xem lỗi" },
      { key: "retry", label: "Thử lại" }
    ]
  }
];
