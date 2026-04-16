import { Module } from "@nestjs/common";

import { TransactionsRepository } from "../../database/repositories/transactions.repository";
import { IntegrationsModule } from "../../integrations/integrations.module";
import { AuditLogsModule } from "../audit-logs/audit-logs.module";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";

@Module({
  imports: [IntegrationsModule, AuditLogsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository]
})
export class TransactionsModule {}

