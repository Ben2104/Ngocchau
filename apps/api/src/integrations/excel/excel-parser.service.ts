import { BadRequestException, Injectable } from "@nestjs/common";
import ExcelJS from "exceljs";

import type { ExcelImportRowInput } from "@gold-shop/validation";
import { ExcelImportRowSchema } from "@gold-shop/validation";
import type { ExcelImportValidationError } from "@gold-shop/types";

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function mapHeaderToField(header: string): keyof ExcelImportRowInput | null {
  const map: Record<string, keyof ExcelImportRowInput> = {
    product_code: "productCode",
    productcode: "productCode",
    product_name: "productName",
    productname: "productName",
    category: "category",
    quantity: "quantity",
    unit_price: "unitPrice",
    unitprice: "unitPrice",
    transaction_date: "transactionDate",
    transactiondate: "transactionDate",
    notes: "notes"
  };

  return map[header] ?? null;
}

@Injectable()
export class ExcelParserService {
  async parse(buffer: Buffer): Promise<{
    rows: ExcelImportRowInput[];
    errors: ExcelImportValidationError[];
  }> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new BadRequestException("Excel file does not contain any worksheet");
    }

    const headerRow = worksheet.getRow(1);
    const headers = headerRow.values
      .slice(1)
      .map((value) => mapHeaderToField(normalizeHeader(value)))
      .filter((value): value is keyof ExcelImportRowInput => Boolean(value));

    if (!headers.includes("productCode") || !headers.includes("productName") || !headers.includes("quantity")) {
      throw new BadRequestException(
        "Excel header must include at least product_code, product_name, quantity, unit_price, and transaction_date"
      );
    }

    const rows: ExcelImportRowInput[] = [];
    const errors: ExcelImportValidationError[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        return;
      }

      const payload = headers.reduce<Record<string, unknown>>((accumulator, header, index) => {
        accumulator[header] = row.getCell(index + 1).value;
        return accumulator;
      }, {});

      const parsed = ExcelImportRowSchema.safeParse(payload);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          errors.push({
            row: rowNumber,
            field: issue.path.join("."),
            message: issue.message
          });
        });
        return;
      }

      rows.push(parsed.data);
    });

    return {
      rows,
      errors
    };
  }
}

