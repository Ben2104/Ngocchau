import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { AuthenticatedUser, CashbookEntry } from "@gold-shop/types";
import type { CashbookCreateInput } from "@gold-shop/validation";

import { SupabaseAdminService } from "../../integrations/supabase/supabase-admin.service";
import { applySoftDeleteFilter } from "../query-builders/soft-delete-query.builder";

function mapCashbookRow(row: Record<string, unknown>): CashbookEntry {
  return {
    id: String(row.id),
    entryType: String(row.entry_type ?? "in") as CashbookEntry["entryType"],
    amount: Number(row.amount ?? 0),
    entryDate: String(row.entry_date ?? new Date().toISOString()),
    reference: row.reference ? String(row.reference) : null,
    notes: row.notes ? String(row.notes) : null,
    createdBy: row.created_by ? String(row.created_by) : null,
    deletedAt: row.deleted_at ? String(row.deleted_at) : null,
    deletedBy: row.deleted_by ? String(row.deleted_by) : null
  };
}

@Injectable()
export class CashbookRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseAdminService: SupabaseAdminService
  ) {}

  private get tableName() {
    return this.configService.getOrThrow<string>("APP_CASHBOOK_TABLE");
  }

  async findRecent(): Promise<CashbookEntry[]> {
    const dateColumn = this.configService.getOrThrow<string>("APP_CASHBOOK_DATE_COLUMN");
    const { data, error } = await applySoftDeleteFilter(
      this.supabaseAdminService.client.from(this.tableName).select("*").order(dateColumn, { ascending: false }).limit(50)
    );

    if (error) {
      throw new InternalServerErrorException(`Failed to read cashbook entries: ${error.message}`);
    }

    const rows = (data ?? []) as Array<Record<string, unknown>>;

    return rows.map(mapCashbookRow);
  }

  async create(input: CashbookCreateInput, actor: AuthenticatedUser): Promise<CashbookEntry> {
    const { data, error } = await this.supabaseAdminService.client
      .from(this.tableName)
      .insert({
        entry_type: input.entryType,
        amount: input.amount,
        entry_date: input.entryDate,
        reference: input.reference ?? null,
        notes: input.notes ?? null,
        created_by: actor.supabaseUserId
      })
      .select("*")
      .single<Record<string, unknown>>();

    if (error || !data) {
      throw new InternalServerErrorException(`Failed to create cashbook entry: ${error?.message ?? "unknown"}`);
    }

    return mapCashbookRow(data);
  }
}
