import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

import {
  ExcelImportCommitSchema,
  ExcelImportValidateSchema,
  type ExcelImportCommitInput,
  type ExcelImportValidateInput
} from "@gold-shop/validation";
import type { AuthenticatedUser } from "@gold-shop/types";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { ExcelImportService } from "./excel-import.service";

@Controller({
  path: "excel-import",
  version: "1"
})
export class ExcelImportController {
  constructor(private readonly excelImportService: ExcelImportService) {}

  @Roles("owner", "manager", "accountant")
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024
      }
    })
  )
  upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    if (!file) {
      throw new BadRequestException("No Excel file uploaded");
    }

    return this.excelImportService.upload(file, currentUser);
  }

  @Roles("owner", "manager", "accountant")
  @Post("validate")
  validate(
    @Body(new ZodValidationPipe(ExcelImportValidateSchema)) body: ExcelImportValidateInput,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.excelImportService.validate(body.sessionId, currentUser);
  }

  @Roles("owner", "manager", "accountant")
  @Post("commit")
  commit(
    @Body(new ZodValidationPipe(ExcelImportCommitSchema)) body: ExcelImportCommitInput,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.excelImportService.commit(body.sessionId, currentUser);
  }
}
