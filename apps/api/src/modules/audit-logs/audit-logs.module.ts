import { Module } from "@nestjs/common";

import { AuditLogRepository } from "../../database/repositories/audit-log.repository";
import { IntegrationsModule } from "../../integrations/integrations.module";
import { AuditLogsController } from "./audit-logs.controller";
import { AuditLogsService } from "./audit-logs.service";

@Module({
  imports: [IntegrationsModule],
  controllers: [AuditLogsController],
  providers: [AuditLogsService, AuditLogRepository],
  exports: [AuditLogsService]
})
export class AuditLogsModule {}

