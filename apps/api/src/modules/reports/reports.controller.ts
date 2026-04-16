import { Controller, Get } from "@nestjs/common";

import { Roles } from "../../common/decorators/roles.decorator";
import { ReportsService } from "./reports.service";

@Controller({
  path: "reports",
  version: "1"
})
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Roles("owner", "accountant")
  @Get("overview")
  getOverview() {
    return this.reportsService.getOverview();
  }
}

