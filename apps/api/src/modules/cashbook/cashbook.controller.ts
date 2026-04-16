import { Body, Controller, Get, Post } from "@nestjs/common";

import { CashbookCreateSchema, type CashbookCreateInput } from "@gold-shop/validation";
import type { AuthenticatedUser } from "@gold-shop/types";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { CashbookService } from "./cashbook.service";

@Controller({
  path: "cashbook",
  version: "1"
})
export class CashbookController {
  constructor(private readonly cashbookService: CashbookService) {}

  @Roles("manager", "accountant")
  @Get()
  getRecent() {
    return this.cashbookService.list();
  }

  @Roles("manager", "accountant")
  @Post()
  create(
    @Body(new ZodValidationPipe(CashbookCreateSchema)) body: CashbookCreateInput,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.cashbookService.create(body, currentUser);
  }
}
