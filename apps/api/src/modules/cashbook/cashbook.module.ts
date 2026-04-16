import { Module } from "@nestjs/common";

import { CashbookRepository } from "../../database/repositories/cashbook.repository";
import { IntegrationsModule } from "../../integrations/integrations.module";
import { AuditLogsModule } from "../audit-logs/audit-logs.module";
import { CashbookController } from "./cashbook.controller";
import { CashbookService } from "./cashbook.service";

@Module({
  imports: [IntegrationsModule, AuditLogsModule],
  controllers: [CashbookController],
  providers: [CashbookService, CashbookRepository]
})
export class CashbookModule {}

