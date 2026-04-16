import { Injectable } from "@nestjs/common";

import { APP_ROLES } from "@gold-shop/types";

@Injectable()
export class RolesService {
  list() {
    return APP_ROLES;
  }
}

