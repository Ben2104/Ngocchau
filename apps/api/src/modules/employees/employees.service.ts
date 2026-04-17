import { Injectable } from "@nestjs/common";

import { AUDIT_ACTIONS, AUDIT_MODULES } from "@gold-shop/constants";
import type {
  AuthenticatedUser,
  EmployeeDeleteResult,
  EmployeeDirectoryResponse,
  EmployeeListItem
} from "@gold-shop/types";
import type { EmployeeCreateInput } from "@gold-shop/validation";

import { AuditLogsService } from "../audit-logs/audit-logs.service";
import { EmployeesRepository } from "../../database/repositories/employees.repository";

@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeesRepository: EmployeesRepository,
    private readonly auditLogsService: AuditLogsService
  ) {}

  async list(): Promise<EmployeeDirectoryResponse> {
    const items = await this.employeesRepository.list();

    return {
      items
    };
  }

  async create(input: EmployeeCreateInput, actor: AuthenticatedUser): Promise<EmployeeListItem> {
    const employee = await this.employeesRepository.create(input);

    await this.auditLogsService.record({
      actor,
      action: AUDIT_ACTIONS.create,
      entityType: "employee",
      entityId: employee.id,
      moduleName: AUDIT_MODULES.employees,
      metadata: {
        createdRole: employee.role,
        email: employee.profile.email ?? null
      }
    });

    return employee;
  }

  async remove(id: string, actor: AuthenticatedUser): Promise<EmployeeDeleteResult> {
    const deleted = await this.employeesRepository.delete(id, actor);

    await this.auditLogsService.record({
      actor,
      action: AUDIT_ACTIONS.delete,
      entityType: "employee",
      entityId: deleted.id,
      moduleName: AUDIT_MODULES.employees
    });

    return deleted;
  }
}
