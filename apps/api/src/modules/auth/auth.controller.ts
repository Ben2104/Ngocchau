import { Controller, Get } from "@nestjs/common";

import type { AuthenticatedUser } from "@gold-shop/types";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { AuthService } from "./auth.service";

@Controller({
  path: "auth",
  version: "1"
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get("status")
  getStatus() {
    return this.authService.getStatus();
  }

  @Get("me")
  getCurrentUser(@CurrentUser() currentUser: AuthenticatedUser | undefined) {
    return currentUser;
  }
}

