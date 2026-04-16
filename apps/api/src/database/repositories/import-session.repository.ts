import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { ExcelImportRowInput } from "@gold-shop/validation";
import type { ExcelImportValidationError, ImportSession, ImportSessionStatus } from "@gold-shop/types";

import { SupabaseAdminService } from "../../integrations/supabase/supabase-admin.service";

interface ImportSessionRow extends Record<string, unknown> {
  id: string;
  file_name: string;
  storage_path: string;
  status: ImportSessionStatus;
  validation_summary: {
    validRowCount: number;
    invalidRowCount: number;
    errors: ExcelImportValidationError[];
  } | null;
  normalized_rows: ExcelImportRowInput[] | null;
  created_at: string;
  updated_at: string;
}

function mapImportSessionRow(row: ImportSessionRow): ImportSession {
  return {
    id: row.id,
    fileName: row.file_name,
    storagePath: row.storage_path,
    status: row.status,
    validationSummary: row.validation_summary ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

@Injectable()
export class ImportSessionRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseAdminService: SupabaseAdminService
  ) {}

  private get tableName() {
    return this.configService.getOrThrow<string>("APP_IMPORT_SESSIONS_TABLE");
  }

  async create(fileName: string, storagePath: string, uploadedBy: string): Promise<ImportSession> {
    const { data, error } = await this.supabaseAdminService.client
      .from(this.tableName)
      .insert({
        file_name: fileName,
        storage_path: storagePath,
        status: "uploaded",
        uploaded_by: uploadedBy
      })
      .select("*")
      .single<ImportSessionRow>();

    if (error || !data) {
      throw new InternalServerErrorException(`Failed to create import session: ${error?.message ?? "unknown"}`);
    }

    return mapImportSessionRow(data);
  }

  async findRowById(id: string): Promise<ImportSessionRow> {
    const { data, error } = await this.supabaseAdminService.client
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single<ImportSessionRow>();

    if (error || !data) {
      throw new NotFoundException(`Import session "${id}" was not found`);
    }

    return data;
  }

  async updateValidation(
    id: string,
    status: Extract<ImportSessionStatus, "validated" | "validation_failed">,
    summary: ImportSession["validationSummary"],
    normalizedRows: ExcelImportRowInput[]
  ): Promise<ImportSession> {
    const { data, error } = await this.supabaseAdminService.client
      .from(this.tableName)
      .update({
        status,
        validation_summary: summary,
        normalized_rows: normalizedRows,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select("*")
      .single<ImportSessionRow>();

    if (error || !data) {
      throw new InternalServerErrorException(`Failed to update import session: ${error?.message ?? "unknown"}`);
    }

    return mapImportSessionRow(data);
  }

  async markCommitted(id: string): Promise<ImportSession> {
    const { data, error } = await this.supabaseAdminService.client
      .from(this.tableName)
      .update({
        status: "committed",
        committed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select("*")
      .single<ImportSessionRow>();

    if (error || !data) {
      throw new InternalServerErrorException(`Failed to commit import session: ${error?.message ?? "unknown"}`);
    }

    return mapImportSessionRow(data);
  }
}

