import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
  list() {
    return {
      items: [],
      note: "Starter module for application user management."
    };
  }
}

