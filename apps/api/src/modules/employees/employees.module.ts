import { Module } from "@nestjs/common";

import { EmployeesRepository } from "../../database/repositories/employees.repository";
import { IntegrationsModule } from "../../integrations/integrations.module";
import { AuditLogsModule } from "../audit-logs/audit-logs.module";
import { EmployeesController } from "./employees.controller";
import { EmployeesService } from "./employees.service";

@Module({
  imports: [IntegrationsModule, AuditLogsModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository]
})
export class EmployeesModule {}
