import { Module } from "@nestjs/common";

import { DashboardRepository } from "../../database/repositories/dashboard.repository";
import { IntegrationsModule } from "../../integrations/integrations.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  imports: [IntegrationsModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository]
})
export class DashboardModule {}

