import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { InventoryRecord } from "@gold-shop/types";

import { SupabaseAdminService } from "../../integrations/supabase/supabase-admin.service";
import { applySoftDeleteFilter } from "../query-builders/soft-delete-query.builder";

function mapInventoryRow(row: Record<string, unknown>): InventoryRecord {
  return {
    id: String(row.id),
    productCode: String(row.product_code ?? ""),
    productName: String(row.product_name ?? ""),
    quantity: Number(row.quantity ?? 0),
    reorderLevel: Number(row.reorder_level ?? 0),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    deletedAt: row.deleted_at ? String(row.deleted_at) : null,
    deletedBy: row.deleted_by ? String(row.deleted_by) : null
  };
}

@Injectable()
export class InventoryRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseAdminService: SupabaseAdminService
  ) {}

  private get tableName() {
    return this.configService.getOrThrow<string>("APP_INVENTORY_TABLE");
  }

  async findAll(): Promise<InventoryRecord[]> {
    const { data, error } = await applySoftDeleteFilter(
      this.supabaseAdminService.client.from(this.tableName).select("*").order("updated_at", { ascending: false })
    );

    if (error) {
      throw new InternalServerErrorException(`Failed to read inventory rows: ${error.message}`);
    }

    return (data ?? []).map((row) => mapInventoryRow(row as Record<string, unknown>));
  }
}

