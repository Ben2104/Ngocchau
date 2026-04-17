import { Controller, Get } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";

import type { AuthenticatedUser } from "@gold-shop/types";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import {
  ApiErrorDto,
  ApiMetaDto,
  AuthenticatedUserDto,
  AuthStatusDto,
  buildErrorEnvelopeSchema,
  buildSuccessEnvelopeSchema
} from "../../common/swagger/auth-employees.docs";
import { AuthService } from "./auth.service";

@ApiTags("Auth")
@ApiExtraModels(ApiMetaDto, ApiErrorDto, AuthStatusDto, AuthenticatedUserDto)
@Controller({
  path: "auth",
  version: "1"
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get("status")
  @ApiOperation({ summary: "Kiểm tra trạng thái dịch vụ auth nội bộ" })
  @ApiOkResponse({ schema: buildSuccessEnvelopeSchema(AuthStatusDto) })
  getStatus() {
    return this.authService.getStatus();
  }

  @Get("me")
  @ApiBearerAuth("supabase-bearer")
  @ApiOperation({ summary: "Lấy hồ sơ nội bộ của người dùng hiện tại" })
  @ApiOkResponse({ schema: buildSuccessEnvelopeSchema(AuthenticatedUserDto) })
  @ApiUnauthorizedResponse({
    schema: buildErrorEnvelopeSchema("No application profile found for this Supabase user", "UNAUTHORIZED")
  })
  @ApiServiceUnavailableResponse({
    schema: buildErrorEnvelopeSchema(
      "Bảng hồ sơ nhân viên chưa được khởi tạo trên Supabase project này.",
      "EMPLOYEE_PROFILE_TABLE_MISSING"
    )
  })
  getCurrentUser(@CurrentUser() currentUser: AuthenticatedUser | undefined) {
    return currentUser;
  }
}
