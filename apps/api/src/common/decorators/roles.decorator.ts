import { SetMetadata } from "@nestjs/common";

import type { AppRole } from "@gold-shop/types";

import { ROLES_KEY } from "../constants/auth.constants";

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);

