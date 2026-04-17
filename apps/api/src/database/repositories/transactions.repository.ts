import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { AuthenticatedUser, TransactionRecord } from "@gold-shop/types";
import type { TransactionCreateInput, TransactionUpdateInput } from "@gold-shop/validation";

import { compactObject } from "@gold-shop/utils";

import { SupabaseAdminService } from "../../integrations/supabase/supabase-admin.service";
import { applySoftDeleteFilter } from "../query-builders/soft-delete-query.builder";

function mapTransactionRow(row: Record<string, unknown>): TransactionRecord {
  return {
    id: String(row.id),
    customerName: String(row.customer_name ?? ""),
    productName: String(row.product_name ?? ""),
    quantity: Number(row.quantity ?? 0),
    unitPrice: Number(row.unit_price ?? 0),
    totalAmount: Number(row.total_amount ?? 0),
    paymentMethod: String(row.payment_method ?? "cash") as TransactionRecord["paymentMethod"],
    transactionDate: String(row.transaction_date ?? new Date().toISOString()),
    notes: row.notes ? String(row.notes) : null,
    deletedAt: row.deleted_at ? String(row.deleted_at) : null,
    deletedBy: row.deleted_by ? String(row.deleted_by) : null,
    createdBy: row.created_by ? String(row.created_by) : null,
    updatedBy: row.updated_by ? String(row.updated_by) : null
  };
}

@Injectable()
export class TransactionsRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseAdminService: SupabaseAdminService
  ) {}

  private get tableName() {
    return this.configService.getOrThrow<string>("APP_TRANSACTIONS_TABLE");
  }

  async findRecent(from?: string, to?: string): Promise<TransactionRecord[]> {
    const dateColumn = this.configService.getOrThrow<string>("APP_TRANSACTION_DATE_COLUMN");
    const query = applySoftDeleteFilter(
      this.supabaseAdminService.client
        .from(this.tableName)
        .select("*")
        .order(dateColumn, { ascending: false })
        .limit(50)
    );

    if (from) {
      query.gte(dateColumn, from);
    }

    if (to) {
      query.lte(dateColumn, to);
    }

    const { data, error } = await query;

    if (error) {
      throw new InternalServerErrorException(`Failed to read transactions: ${error.message}`);
    }

    const rows = (data ?? []) as Array<Record<string, unknown>>;

    return rows.map(mapTransactionRow);
  }

  async create(input: TransactionCreateInput, actor: AuthenticatedUser): Promise<TransactionRecord> {
    const { data, error } = await this.supabaseAdminService.client
      .from(this.tableName)
      .insert({
        customer_name: input.customerName,
        product_name: input.productName,
        quantity: input.quantity,
        unit_price: input.unitPrice,
        total_amount: input.totalAmount,
        payment_method: input.paymentMethod,
        transaction_date: input.transactionDate,
        notes: input.notes ?? null,
        created_by: actor.supabaseUserId,
        updated_by: actor.supabaseUserId
      })
      .select("*")
      .single<Record<string, unknown>>();

    if (error || !data) {
      throw new InternalServerErrorException(`Failed to create transaction: ${error?.message ?? "unknown"}`);
    }

    return mapTransactionRow(data);
  }

  async update(id: string, input: TransactionUpdateInput, actor: AuthenticatedUser): Promise<TransactionRecord> {
    const payload = compactObject({
      customer_name: input.customerName,
      product_name: input.productName,
      quantity: input.quantity,
      unit_price: input.unitPrice,
      total_amount: input.totalAmount,
      payment_method: input.paymentMethod,
      transaction_date: input.transactionDate,
      notes: input.notes,
      updated_by: actor.supabaseUserId
    });

    const { data, error } = await this.supabaseAdminService.client
      .from(this.tableName)
      .update(payload)
      .eq("id", id)
      .select("*")
      .single<Record<string, unknown>>();

    if (error || !data) {
      throw new InternalServerErrorException(`Failed to update transaction: ${error?.message ?? "unknown"}`);
    }

    return mapTransactionRow(data);
  }
}
