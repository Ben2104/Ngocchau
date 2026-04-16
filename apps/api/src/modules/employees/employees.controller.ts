import { Controller, Get } from "@nestjs/common";

import { Roles } from "../../common/decorators/roles.decorator";
import { EmployeesService } from "./employees.service";

@Controller({
  path: "employees",
  version: "1"
})
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles("owner", "manager")
  @Get()
  list() {
    return this.employeesService.list();
  }
}

