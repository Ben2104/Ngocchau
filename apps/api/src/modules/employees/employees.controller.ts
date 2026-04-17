import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

import { EmployeeCreateSchema, type EmployeeCreateInput } from "@gold-shop/validation";
import type { AuthenticatedUser } from "@gold-shop/types";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import {
  ApiErrorDto,
  ApiMetaDto,
  buildErrorEnvelopeSchema,
  buildSuccessEnvelopeSchema,
  EmployeeCreateRequestDto,
  EmployeeDeleteResultDto,
  EmployeeDirectoryDto,
  EmployeeListItemDto,
  EmployeeProfileDto
} from "../../common/swagger/auth-employees.docs";
import { EmployeesService } from "./employees.service";

@ApiTags("Employees")
@ApiExtraModels(
  ApiMetaDto,
  ApiErrorDto,
  EmployeeCreateRequestDto,
  EmployeeProfileDto,
  EmployeeListItemDto,
  EmployeeDirectoryDto,
  EmployeeDeleteResultDto
)
@ApiBearerAuth("supabase-bearer")
@Controller({
  path: "employees",
  version: "1"
})
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles("owner", "manager")
  @Get()
  @ApiOperation({ summary: "Lấy danh sách nhân viên nội bộ đang hoạt động" })
  @ApiOkResponse({ schema: buildSuccessEnvelopeSchema(EmployeeDirectoryDto) })
  @ApiUnauthorizedResponse({
    schema: buildErrorEnvelopeSchema("Không thể truy cập danh sách nhân viên", "UNAUTHORIZED")
  })
  @ApiServiceUnavailableResponse({
    schema: buildErrorEnvelopeSchema(
      "Bảng hồ sơ nhân viên chưa được khởi tạo trên Supabase project này. Cần tạo bảng public.users trước khi quản lý nhân viên.",
      "EMPLOYEE_PROFILE_TABLE_MISSING"
    )
  })
  list() {
    return this.employeesService.list();
  }

  @Roles("owner")
  @Post()
  @ApiOperation({ summary: "Tạo tài khoản nhân viên mới" })
  @ApiBody({ type: EmployeeCreateRequestDto })
  @ApiCreatedResponse({ schema: buildSuccessEnvelopeSchema(EmployeeListItemDto) })
  @ApiUnauthorizedResponse({
    schema: buildErrorEnvelopeSchema("Không thể tạo tài khoản nhân viên", "UNAUTHORIZED")
  })
  @ApiServiceUnavailableResponse({
    schema: buildErrorEnvelopeSchema(
      "Bảng hồ sơ nhân viên chưa được khởi tạo trên Supabase project này. Cần tạo bảng public.users trước khi quản lý nhân viên.",
      "EMPLOYEE_PROFILE_TABLE_MISSING"
    )
  })
  create(
    @Body(new ZodValidationPipe(EmployeeCreateSchema)) body: EmployeeCreateInput,
    @CurrentUser() currentUser: AuthenticatedUser
  ) {
    return this.employeesService.create(body, currentUser);
  }

  @Roles("owner")
  @Delete(":id")
  @ApiOperation({ summary: "Xóa tài khoản nhân viên" })
  @ApiParam({ name: "id", description: "Mã hồ sơ nhân viên trong bảng public.users" })
  @ApiOkResponse({ schema: buildSuccessEnvelopeSchema(EmployeeDeleteResultDto) })
  @ApiUnauthorizedResponse({
    schema: buildErrorEnvelopeSchema("Không thể xóa tài khoản nhân viên", "UNAUTHORIZED")
  })
  @ApiServiceUnavailableResponse({
    schema: buildErrorEnvelopeSchema(
      "Bảng hồ sơ nhân viên chưa được khởi tạo trên Supabase project này. Cần tạo bảng public.users trước khi quản lý nhân viên.",
      "EMPLOYEE_PROFILE_TABLE_MISSING"
    )
  })
  remove(@Param("id") id: string, @CurrentUser() currentUser: AuthenticatedUser) {
    return this.employeesService.remove(id, currentUser);
  }
}
