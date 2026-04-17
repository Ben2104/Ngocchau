import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { CashOverviewPoint, DashboardSummary, SalesTrendPoint } from "@gold-shop/types";
import { safeNumber } from "@gold-shop/utils";

import { SupabaseAdminService } from "../../integrations/supabase/supabase-admin.service";
import { enumerateDates } from "../../common/utils/date-range.util";
import { applySoftDeleteFilter } from "../query-builders/soft-delete-query.builder";

interface DateRangeInput {
  from: string;
  to: string;
}

type SupabaseQueryError = {
  code?: string;
  message?: string;
} | null;

type DashboardRow = Record<string, unknown>;

function isMissingTableError(error: SupabaseQueryError) {
  return error?.code === "42P01" || error?.code === "PGRST205";
}

@Injectable()
export class DashboardRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseAdminService: SupabaseAdminService
  ) {}

  private get allowDevelopmentFallback() {
    return this.configService.getOrThrow<string>("NODE_ENV") === "development";
  }

  // Local dev can start against an empty hosted Supabase project before schema import is ready.
  private resolveRowsOrThrow(data: unknown[] | null, error: SupabaseQueryError, message: string): DashboardRow[] {
    if (error) {
      if (this.allowDevelopmentFallback && isMissingTableError(error)) {
        return [];
      }

      throw new InternalServerErrorException(`${message}: ${error.message}`);
    }

    return (data ?? []) as DashboardRow[];
  }

  async getSummary(range: DateRangeInput): Promise<DashboardSummary> {
    const transactions = await this.fetchTransactions(range);
    const cashbookEntries = await this.fetchCashbookEntries(range);
    const products = await this.fetchProducts();

    const totalSales = transactions.reduce(
      (accumulator, transaction) =>
        accumulator + safeNumber(transaction[this.configService.getOrThrow<string>("APP_TRANSACTION_AMOUNT_COLUMN")]),
      0
    );

    const cashIn = cashbookEntries.reduce((accumulator, entry) => {
      const typeValue = String(entry[this.configService.getOrThrow<string>("APP_CASHBOOK_TYPE_COLUMN")] ?? "");
      return ["in", "income", "thu"].includes(typeValue.toLowerCase())
        ? accumulator + safeNumber(entry[this.configService.getOrThrow<string>("APP_CASHBOOK_AMOUNT_COLUMN")])
        : accumulator;
    }, 0);

    const cashOut = cashbookEntries.reduce((accumulator, entry) => {
      const typeValue = String(entry[this.configService.getOrThrow<string>("APP_CASHBOOK_TYPE_COLUMN")] ?? "");
      return ["out", "expense", "chi"].includes(typeValue.toLowerCase())
        ? accumulator + safeNumber(entry[this.configService.getOrThrow<string>("APP_CASHBOOK_AMOUNT_COLUMN")])
        : accumulator;
    }, 0);

    const stockColumn = this.configService.getOrThrow<string>("APP_PRODUCTS_STOCK_COLUMN");
    const reorderLevelColumn = this.configService.getOrThrow<string>("APP_PRODUCTS_REORDER_LEVEL_COLUMN");
    const lowStockItems = products.filter(
      (product) => safeNumber(product[stockColumn]) <= safeNumber(product[reorderLevelColumn])
    ).length;

    return {
      totalSales,
      transactionCount: transactions.length,
      averageOrderValue: transactions.length > 0 ? totalSales / transactions.length : 0,
      cashIn,
      cashOut,
      netCashFlow: cashIn - cashOut,
      inventoryItems: products.length,
      lowStockItems
    };
  }

  async getSalesTrend(range: DateRangeInput): Promise<SalesTrendPoint[]> {
    const transactions = await this.fetchTransactions(range);
    const dateColumn = this.configService.getOrThrow<string>("APP_TRANSACTION_DATE_COLUMN");
    const amountColumn = this.configService.getOrThrow<string>("APP_TRANSACTION_AMOUNT_COLUMN");
    const baseMap = enumerateDates(range.from, range.to).reduce<Record<string, SalesTrendPoint>>((accumulator, date) => {
      accumulator[date] = {
        date,
        revenue: 0,
        transactionCount: 0
      };

      return accumulator;
    }, {});

    transactions.forEach((transaction) => {
      const date = String(transaction[dateColumn]).slice(0, 10);
      const currentValue = baseMap[date];
      if (!currentValue) {
        return;
      }

      currentValue.revenue += safeNumber(transaction[amountColumn]);
      currentValue.transactionCount += 1;
    });

    return Object.values(baseMap);
  }

  async getCashOverview(range: DateRangeInput): Promise<CashOverviewPoint[]> {
    const cashbookEntries = await this.fetchCashbookEntries(range);
    const dateColumn = this.configService.getOrThrow<string>("APP_CASHBOOK_DATE_COLUMN");
    const amountColumn = this.configService.getOrThrow<string>("APP_CASHBOOK_AMOUNT_COLUMN");
    const typeColumn = this.configService.getOrThrow<string>("APP_CASHBOOK_TYPE_COLUMN");
    const baseMap = enumerateDates(range.from, range.to).reduce<Record<string, CashOverviewPoint>>(
      (accumulator, date) => {
        accumulator[date] = {
          date,
          cashIn: 0,
          cashOut: 0
        };

        return accumulator;
      },
      {}
    );

    cashbookEntries.forEach((entry) => {
      const date = String(entry[dateColumn]).slice(0, 10);
      const currentValue = baseMap[date];
      if (!currentValue) {
        return;
      }

      const typeValue = String(entry[typeColumn] ?? "").toLowerCase();
      if (["in", "income", "thu"].includes(typeValue)) {
        currentValue.cashIn += safeNumber(entry[amountColumn]);
      } else {
        currentValue.cashOut += safeNumber(entry[amountColumn]);
      }
    });

    return Object.values(baseMap);
  }

  private async fetchTransactions(range: DateRangeInput): Promise<DashboardRow[]> {
    const tableName = this.configService.getOrThrow<string>("APP_TRANSACTIONS_TABLE");
    const dateColumn = this.configService.getOrThrow<string>("APP_TRANSACTION_DATE_COLUMN");

    const { data, error } = await applySoftDeleteFilter(
      this.supabaseAdminService.client
        .from(tableName)
        .select("*")
        .gte(dateColumn, range.from)
        .lte(dateColumn, range.to)
    );

    return this.resolveRowsOrThrow(data, error, "Failed to load dashboard transactions");
  }

  private async fetchCashbookEntries(range: DateRangeInput): Promise<DashboardRow[]> {
    const tableName = this.configService.getOrThrow<string>("APP_CASHBOOK_TABLE");
    const dateColumn = this.configService.getOrThrow<string>("APP_CASHBOOK_DATE_COLUMN");

    const { data, error } = await applySoftDeleteFilter(
      this.supabaseAdminService.client
        .from(tableName)
        .select("*")
        .gte(dateColumn, range.from)
        .lte(dateColumn, range.to)
    );

    return this.resolveRowsOrThrow(data, error, "Failed to load dashboard cashbook entries");
  }

  private async fetchProducts(): Promise<DashboardRow[]> {
    const tableName = this.configService.getOrThrow<string>("APP_PRODUCTS_TABLE");
    const { data, error } = await this.supabaseAdminService.client.from(tableName).select("*");

    return this.resolveRowsOrThrow(data, error, "Failed to load dashboard products");
  }
}
