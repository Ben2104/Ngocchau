import { Controller, Get } from "@nestjs/common";

import { Roles } from "../../common/decorators/roles.decorator";
import { UsersService } from "./users.service";

@Controller({
  path: "users",
  version: "1"
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles("owner", "manager")
  @Get()
  list() {
    return this.usersService.list();
  }
}

