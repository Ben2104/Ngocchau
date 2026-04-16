import { Controller, Get, Query } from "@nestjs/common";

import { Roles } from "../../common/decorators/roles.decorator";
import { AuditLogsService } from "./audit-logs.service";

@Controller({
  path: "audit-logs",
  version: "1"
})
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Roles("owner", "manager", "accountant")
  @Get()
  getRecent(@Query("limit") limit?: string) {
    return this.auditLogsService.listRecent(limit ? Number(limit) : 50);
  }
}

