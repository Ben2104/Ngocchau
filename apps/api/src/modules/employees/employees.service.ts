import { Injectable } from "@nestjs/common";

@Injectable()
export class EmployeesService {
  list() {
    return {
      items: [],
      note: "Starter module for employee roster, status, and role assignment."
    };
  }
}

