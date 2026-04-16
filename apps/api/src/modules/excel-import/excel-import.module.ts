import { Module } from "@nestjs/common";

import { ImportSessionRepository } from "../../database/repositories/import-session.repository";
import { IntegrationsModule } from "../../integrations/integrations.module";
import { AuditLogsModule } from "../audit-logs/audit-logs.module";
import { ExcelImportController } from "./excel-import.controller";
import { ExcelImportService } from "./excel-import.service";

@Module({
  imports: [IntegrationsModule, AuditLogsModule],
  controllers: [ExcelImportController],
  providers: [ExcelImportService, ImportSessionRepository]
})
export class ExcelImportModule {}

