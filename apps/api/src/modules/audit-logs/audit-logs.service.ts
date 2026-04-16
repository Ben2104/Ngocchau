import { Injectable } from "@nestjs/common";

import type { AuthenticatedUser } from "@gold-shop/types";

import { AuditLogRepository } from "../../database/repositories/audit-log.repository";

interface RecordAuditLogInput {
  actor: AuthenticatedUser;
  action: string;
  entityType: string;
  entityId?: string | null;
  moduleName: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditLogsService {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  record(input: RecordAuditLogInput) {
    return this.auditLogRepository.insert(input);
  }

  listRecent(limit = 50) {
    return this.auditLogRepository.findRecent(limit);
  }
}

