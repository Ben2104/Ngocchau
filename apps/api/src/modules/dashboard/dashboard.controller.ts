import { Controller, Get, Query } from "@nestjs/common";

import { DashboardRangeQuerySchema, type DashboardRangeQueryInput } from "@gold-shop/validation";

import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { DashboardService } from "./dashboard.service";

@Controller({
  path: "dashboard",
  version: "1"
})
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles("owner", "manager", "accountant")
  @Get("summary")
  getSummary(@Query(new ZodValidationPipe(DashboardRangeQuerySchema)) query: DashboardRangeQueryInput) {
    return this.dashboardService.getSummary(query);
  }

  @Roles("owner", "manager", "accountant")
  @Get("sales-trend")
  getSalesTrend(@Query(new ZodValidationPipe(DashboardRangeQuerySchema)) query: DashboardRangeQueryInput) {
    return this.dashboardService.getSalesTrend(query);
  }

  @Roles("owner", "manager", "accountant")
  @Get("cash-overview")
  getCashOverview(@Query(new ZodValidationPipe(DashboardRangeQuerySchema)) query: DashboardRangeQueryInput) {
    return this.dashboardService.getCashOverview(query);
  }
}
