import { Injectable } from "@nestjs/common";

import { AUDIT_ACTIONS, AUDIT_MODULES } from "@gold-shop/constants";
import type { AuthenticatedUser } from "@gold-shop/types";
import type { DashboardRangeQueryInput, TransactionCreateInput, TransactionUpdateInput } from "@gold-shop/validation";

import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { TransactionsRepository } from "../../database/repositories/transactions.repository";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly auditLogsService: AuditLogsService
  ) {}

  list(query: DashboardRangeQueryInput) {
    return this.transactionsRepository.findRecent(query.from, query.to);
  }

  async create(input: TransactionCreateInput, actor: AuthenticatedUser) {
    const transaction = await this.transactionsRepository.create(input, actor);

    await this.auditLogsService.record({
      actor,
      action: AUDIT_ACTIONS.create,
      entityType: "transaction",
      entityId: transaction.id,
      moduleName: AUDIT_MODULES.transactions,
      metadata: {
        totalAmount: transaction.totalAmount,
        paymentMethod: transaction.paymentMethod
      }
    });

    return transaction;
  }

  async update(id: string, input: TransactionUpdateInput, actor: AuthenticatedUser) {
    const transaction = await this.transactionsRepository.update(id, input, actor);

    await this.auditLogsService.record({
      actor,
      action: AUDIT_ACTIONS.update,
      entityType: "transaction",
      entityId: transaction.id,
      moduleName: AUDIT_MODULES.transactions,
      metadata: {
        updatedFields: Object.keys(input)
      }
    });

    return transaction;
  }
}

