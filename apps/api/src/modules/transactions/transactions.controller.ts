import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";

import {
  DashboardRangeQuerySchema,
  TransactionCreateSchema,
  TransactionUpdateSchema,
  type DashboardRangeQueryInput,
  type TransactionCreateInput,
  type TransactionUpdateInput
} from "@gold-shop/validation";
import type { AuthenticatedUser } from "@gold-shop/types";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { TransactionsService } from "./transactions.service";

const TransactionPatchSchema = TransactionUpdateSchema.omit({ id: true });

@Controller({
  path: "transactions",
  version: "1"
})
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Roles("manager", "staff", "accountant")
  @Get()
  getRecent(@Query(new ZodValidationPipe(DashboardRangeQuerySchema)) query: DashboardRangeQueryInput) {
    return this.transactionsService.list(query);
  }

  @Roles("manager", "staff")
  @Post()
  create(
    @Body(new ZodValidationPipe(TransactionCreateSchema)) body: TransactionCreateInput,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.transactionsService.create(body, currentUser);
  }

  @Roles("manager", "staff")
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(TransactionPatchSchema)) body: Omit<TransactionUpdateInput, "id">,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.transactionsService.update(id, { ...body, id }, currentUser);
  }
}
