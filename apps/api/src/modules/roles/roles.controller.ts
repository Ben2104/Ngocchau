import { Controller, Get } from "@nestjs/common";

import { Roles } from "../../common/decorators/roles.decorator";
import { RolesService } from "./roles.service";

@Controller({
  path: "roles",
  version: "1"
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Roles("owner")
  @Get()
  list() {
    return this.rolesService.list();
  }
}

