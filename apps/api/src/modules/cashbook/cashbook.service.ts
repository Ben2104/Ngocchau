import { Injectable } from "@nestjs/common";

import { AUDIT_ACTIONS, AUDIT_MODULES } from "@gold-shop/constants";
import type { AuthenticatedUser } from "@gold-shop/types";
import type { CashbookCreateInput } from "@gold-shop/validation";

import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { CashbookRepository } from "../../database/repositories/cashbook.repository";

@Injectable()
export class CashbookService {
  constructor(
    private readonly cashbookRepository: CashbookRepository,
    private readonly auditLogsService: AuditLogsService
  ) {}

  list() {
    return this.cashbookRepository.findRecent();
  }

  async create(input: CashbookCreateInput, actor: AuthenticatedUser) {
    const cashbookEntry = await this.cashbookRepository.create(input, actor);

    await this.auditLogsService.record({
      actor,
      action: AUDIT_ACTIONS.create,
      entityType: "cashbook-entry",
      entityId: cashbookEntry.id,
      moduleName: AUDIT_MODULES.cashbook,
      metadata: {
        entryType: cashbookEntry.entryType,
        amount: cashbookEntry.amount
      }
    });

    return cashbookEntry;
  }
}

