import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { AuditLogRecord, AuthenticatedUser } from "@gold-shop/types";

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
      throw new InternalServerErrorException(`Failed to read audit logs: ${error.message}`);
    }

    return (data ?? []).map((row) => mapAuditLogRow(row as Record<string, unknown>));
  }
}

