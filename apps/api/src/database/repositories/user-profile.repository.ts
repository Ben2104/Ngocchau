import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { APP_ROLES, type AppRole, type AuthenticatedUser } from "@gold-shop/types";

import { SupabaseAdminService } from "../../integrations/supabase/supabase-admin.service";

@Injectable()
export class UserProfileRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseAdminService: SupabaseAdminService
  ) {}

  async findBySupabaseUserId(supabaseUserId: string, email: string): Promise<AuthenticatedUser | null> {
    const tableNames = this.configService
      .getOrThrow<string>("APP_PROFILE_TABLES")
      .split(",")
      .map((tableName) => tableName.trim())
      .filter(Boolean);

    const userIdColumn = this.configService.getOrThrow<string>("APP_PROFILE_USER_ID_COLUMN");
    const roleColumn = this.configService.getOrThrow<string>("APP_PROFILE_ROLE_COLUMN");
    const statusColumn = this.configService.getOrThrow<string>("APP_PROFILE_STATUS_COLUMN");
    const employeeIdColumn = this.configService.getOrThrow<string>("APP_PROFILE_EMPLOYEE_ID_COLUMN");
    const fullNameColumn = this.configService.getOrThrow<string>("APP_PROFILE_FULL_NAME_COLUMN");

    for (const tableName of tableNames) {
      const { data, error } = await this.supabaseAdminService.client
        .from(tableName)
        .select(`id, ${userIdColumn}, ${roleColumn}, ${statusColumn}, ${employeeIdColumn}, ${fullNameColumn}`)
        .eq(userIdColumn, supabaseUserId)
        .maybeSingle<Record<string, unknown>>();

      if (error) {
        if (error.code === "42P01") {
          continue;
        }

        throw new InternalServerErrorException(
          `Failed to resolve user profile from table "${tableName}": ${error.message}`
        );
      }

      if (data) {
        const rawRole = String(data[roleColumn] ?? "staff");
        const role = (APP_ROLES.includes(rawRole as AppRole) ? rawRole : "staff") as AppRole;

        return {
          id: String(data.id ?? supabaseUserId),
          supabaseUserId,
          email,
          fullName: data[fullNameColumn] ? String(data[fullNameColumn]) : null,
          employeeId: data[employeeIdColumn] ? String(data[employeeIdColumn]) : null,
          role,
          status: String(data[statusColumn] ?? "active")
        };
      }
    }

    return null;
  }
}

