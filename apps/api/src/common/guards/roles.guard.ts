import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import type { AppRole } from "@gold-shop/types";

import type { RequestWithContext } from "../dto/request-context.type";
import { ROLES_KEY } from "../constants/auth.constants";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AppRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithContext>();
    const currentUser = request.user;

    if (!currentUser) {
      throw new UnauthorizedException("Request does not contain an authenticated user");
    }

    if (currentUser.role === "owner") {
      return true;
    }

    if (!requiredRoles.includes(currentUser.role)) {
      throw new ForbiddenException("You do not have permission to access this resource");
    }

    return true;
  }
}

