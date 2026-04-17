import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { EmployeeCreateSchema, type EmployeeCreateInput } from "@gold-shop/validation";
import type { AuthenticatedUser } from "@gold-shop/types";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
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

  @Roles("owner")
  @Post()
  create(
    @Body(new ZodValidationPipe(EmployeeCreateSchema)) body: EmployeeCreateInput,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.employeesService.create(body, currentUser);
  }

  @Roles("owner")
  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser() currentUser: AuthenticatedUser) {
    return this.employeesService.remove(id, currentUser);
  }
}
