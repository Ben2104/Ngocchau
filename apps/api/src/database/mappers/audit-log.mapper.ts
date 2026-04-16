import type { AuditLogRecord, AppRole } from "@gold-shop/types";

export function mapAuditLogRow(row: Record<string, unknown>): AuditLogRecord {
  return {
    id: String(row.id),
    actorUserId: row.actor_user_id ? String(row.actor_user_id) : null,
    actorRole: String(row.actor_role) as AppRole,
    action: String(row.action),
    entityType: String(row.entity_type),
    entityId: row.entity_id ? String(row.entity_id) : null,
    moduleName: String(row.module_name),
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    createdAt: String(row.created_at)
  };
}

