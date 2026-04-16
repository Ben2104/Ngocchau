import { SUPPORTED_IMPORT_FILE_TYPES } from "@gold-shop/constants";
import type {
  ImportPreviewRow,
  ImportScreenState,
  ImportSession,
  ImportSummary,
  ImportValidationIssue
} from "@gold-shop/types";

import { importPreviewRowsMock, importSummaryMock, importValidationIssuesMock } from "@/lib/mocks/import-workspace";

export function mapSessionValidationIssues(session: ImportSession | null): ImportValidationIssue[] {
  if (!session) {
    return [];
  }

  if (!session.validationSummary) {
    return importValidationIssuesMock;
  }

  return session.validationSummary.errors.map((issue, index) => ({
    id: `${session.id}-${issue.row}-${issue.field}-${index}`,
    rowNumber: issue.row,
    field: issue.field,
    message: issue.message,
    severity: "error"
  }));
}

export function getImportPreviewRows(): ImportPreviewRow[] {
  return importPreviewRowsMock;
}

export function mapImportSummary(
  session: ImportSession | null,
  issues: ImportValidationIssue[],
  previewRows = importPreviewRowsMock
): ImportSummary {
  if (!session) {
    return {
      totalRows: 0,
      validRows: 0,
      criticalIssues: 0,
      warningIssues: 0,
      displayedRows: 0,
      totalPreviewRows: 0,
      supportedFileTypes: [...SUPPORTED_IMPORT_FILE_TYPES]
    };
  }

  if (!session.validationSummary) {
    return importSummaryMock;
  }

  const criticalIssues = issues.filter((issue) => issue.severity === "error").length;
  const warningIssues = issues.filter((issue) => issue.severity === "warning").length;

  return {
    totalRows: session.validationSummary.validRowCount + session.validationSummary.invalidRowCount,
    validRows: session.validationSummary.validRowCount,
    criticalIssues,
    warningIssues,
    displayedRows: previewRows.length,
    totalPreviewRows: previewRows.length,
    supportedFileTypes: [...SUPPORTED_IMPORT_FILE_TYPES]
  };
}

export function buildImportScreenState(args: {
  hasFile: boolean;
  session: ImportSession | null;
  isBusy: boolean;
  issues: ImportValidationIssue[];
}): ImportScreenState {
  const { hasFile, session, isBusy, issues } = args;
  const hasCriticalIssues = issues.some((issue) => issue.severity === "error");

  if (isBusy && session?.status === "validated") {
    return {
      actionState: "committing",
      isBusy: true,
      canValidate: false,
      canCommit: false
    };
  }

  if (isBusy && session?.status === "uploaded") {
    return {
      actionState: "validating",
      isBusy: true,
      canValidate: false,
      canCommit: false
    };
  }

  if (isBusy) {
    return {
      actionState: hasFile ? "uploading" : "idle",
      isBusy: true,
      canValidate: false,
      canCommit: false
    };
  }

  if (session?.status === "committed") {
    return {
      actionState: "committed",
      isBusy: false,
      canValidate: false,
      canCommit: false,
      statusMessage: "Đã commit phiên nhập. Chờ backend xử lý insert dữ liệu thật."
    };
  }

  if (session?.status === "validated" && !hasCriticalIssues) {
    return {
      actionState: "validated",
      isBusy: false,
      canValidate: true,
      canCommit: true,
      statusMessage: "Dữ liệu đã vượt qua kiểm tra. Có thể xác nhận nhập dữ liệu."
    };
  }

  if (session?.status === "validated" || session?.status === "validation_failed") {
    return {
      actionState: "blocked",
      isBusy: false,
      canValidate: true,
      canCommit: false,
      statusMessage: "Vui lòng sửa các lỗi nghiêm trọng trước khi tiếp tục nhập dữ liệu."
    };
  }

  if (session?.status === "uploaded") {
    return {
      actionState: "uploaded",
      isBusy: false,
      canValidate: true,
      canCommit: false,
      statusMessage: "Tệp đã tải lên. Chạy bước kiểm tra để xem dữ liệu đầu vào."
    };
  }

  if (hasFile) {
    return {
      actionState: "file_selected",
      isBusy: false,
      canValidate: false,
      canCommit: false,
      statusMessage: "Tệp đã được chọn. Tiếp tục tải lên để bắt đầu phiên nhập."
    };
  }

  return {
    actionState: "idle",
    isBusy: false,
    canValidate: false,
    canCommit: false,
    statusMessage: "Sẵn sàng nhận tệp .xlsx hoặc .csv theo mẫu chuẩn của hệ thống."
  };
}
