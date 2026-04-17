import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { APP_ERROR_CODES } from "@gold-shop/constants";
import type { AuditLogRecord, AuthenticatedUser } from "@gold-shop/types";

import { AppSetupException } from "../../common/exceptions/app-setup.exception";
import { isMissingTableError } from "../../common/utils/supabase-error.util";
import { SupabaseAdminService } from "../../integrations/supabase/supabase-admin.service";
import { mapAuditLogRow } from "../mappers/audit-log.mapper";

interface AuditLogInsertInput {
  actor: AuthenticatedUser;
  action: string;
  entityType: string;
  entityId?: string | null;
  moduleName: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditLogRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseAdminService: SupabaseAdminService
  ) {}

  private throwMissingAuditTable(tableName: string, providerCode?: string | null): never {
    throw new AppSetupException(
      "Bảng nhật ký thao tác chưa được khởi tạo trên Supabase project này. Cần tạo bảng public.audit_logs trước khi ghi nhận thao tác nhân viên.",
      APP_ERROR_CODES.auditLogTableMissing,
      {
        tableName,
        providerCode: providerCode ?? null
      }
    );
  }

  async insert(input: AuditLogInsertInput): Promise<AuditLogRecord> {
    const tableName = this.configService.getOrThrow<string>("APP_AUDIT_LOGS_TABLE");
    const { data, error } = await this.supabaseAdminService.client
      .from(tableName)
      .insert({
        actor_user_id: input.actor.supabaseUserId,
        actor_role: input.actor.role,
        action: input.action,
        entity_type: input.entityType,
        entity_id: input.entityId ?? null,
        module_name: input.moduleName,
        metadata: input.metadata ?? {}
      })
      .select("*")
      .single<Record<string, unknown>>();

    if (error || !data) {
      if (isMissingTableError(error)) {
        this.throwMissingAuditTable(tableName, error.code);
      }

      throw new InternalServerErrorException(`Failed to insert audit log: ${error?.message ?? "unknown"}`);
    }

    return mapAuditLogRow(data);
  }

  async findRecent(limit = 50): Promise<AuditLogRecord[]> {
    const tableName = this.configService.getOrThrow<string>("APP_AUDIT_LOGS_TABLE");
    const { data, error } = await this.supabaseAdminService.client
      .from(tableName)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      if (isMissingTableError(error)) {
        this.throwMissingAuditTable(tableName, error.code);
      }

      throw new InternalServerErrorException(`Failed to read audit logs: ${error.message}`);
    }

    const rows = (data ?? []) as Array<Record<string, unknown>>;

    return rows.map(mapAuditLogRow);
  }
}
