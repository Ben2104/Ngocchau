import type { ImportPreviewRow, ImportSummary, ImportValidationIssue } from "@gold-shop/types";

export const importPreviewRowsMock: ImportPreviewRow[] = [
  {
    id: "preview-11",
    rowNumber: 11,
    productCode: "SP-99911",
    productName: "Dây chuyền vàng 18K",
    weightLabel: "5.25g",
    listedPrice: 12_450_000,
    severity: "default"
  },
  {
    id: "preview-12",
    rowNumber: 12,
    productCode: null,
    productName: "Nhẫn vàng 24K",
    weightLabel: "3.75g",
    listedPrice: 23_100_000,
    severity: "error"
  },
  {
    id: "preview-13",
    rowNumber: 13,
    productCode: "SP-99913",
    productName: "Lắc tay cẩm thạch",
    weightLabel: "7.50g",
    listedPrice: 15_800_000,
    severity: "default"
  },
  {
    id: "preview-18",
    rowNumber: 18,
    productCode: "SP-99918",
    productName: "Hoa tai đá quý",
    weightLabel: null,
    listedPrice: 8_200_000,
    severity: "warning"
  }
];

export const importValidationIssuesMock: ImportValidationIssue[] = [
  {
    id: "issue-12-product-code",
    rowNumber: 12,
    field: "productCode",
    message: "Thiếu mã sản phẩm",
    severity: "error"
  },
  {
    id: "issue-18-weight",
    rowNumber: 18,
    field: "weight",
    message: "Trọng lượng không hợp lệ",
    severity: "warning"
  }
];

export const importSummaryMock: ImportSummary = {
  totalRows: 50,
  validRows: 47,
  criticalIssues: 3,
  warningIssues: 1,
  displayedRows: 20,
  totalPreviewRows: 50,
  supportedFileTypes: [".xlsx", ".csv"]
};
