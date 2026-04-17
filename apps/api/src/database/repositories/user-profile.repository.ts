import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { APP_ROLES, type AppRole, type AuthenticatedUser } from "@gold-shop/types";

import { SupabaseAdminService } from "../../integrations/supabase/supabase-admin.service";

type SupabaseQueryError = {
  code?: string;
  message?: string;
} | null;

type SupabaseAuthUser = {
  id: string;
  email?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
};

function normalizeRole(value: unknown): AppRole {
  return APP_ROLES.includes(value as AppRole) ? (value as AppRole) : "staff";
}

function resolveDevelopmentRole(value: unknown): AppRole {
  return APP_ROLES.includes(value as AppRole) ? (value as AppRole) : "owner";
}

function resolveFullName(data: { email?: string | null; user_metadata?: Record<string, unknown> }) {
  const metadataName =
    data.user_metadata?.full_name ??
    data.user_metadata?.name ??
    data.user_metadata?.display_name ??
    data.email?.split("@")[0];

  return typeof metadataName === "string" && metadataName.trim() !== "" ? metadataName.trim() : "Người dùng nội bộ";
}

function isMissingTableError(error: SupabaseQueryError) {
  return error?.code === "42P01" || error?.code === "PGRST205";
}

@Injectable()
export class UserProfileRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseAdminService: SupabaseAdminService
  ) {}

  private get isDevelopment() {
    return this.configService.getOrThrow<string>("NODE_ENV") === "development";
  }

  private get profileTableNames() {
    return this.configService
      .getOrThrow<string>("APP_PROFILE_TABLES")
      .split(",")
      .map((tableName) => tableName.trim())
      .filter(Boolean);
  }

  private mapProfileRow(data: Record<string, unknown>, supabaseUserId: string, email: string): AuthenticatedUser {
    const employeeIdColumn = this.configService.getOrThrow<string>("APP_PROFILE_EMPLOYEE_ID_COLUMN");
    const fullNameColumn = this.configService.getOrThrow<string>("APP_PROFILE_FULL_NAME_COLUMN");
    const roleColumn = this.configService.getOrThrow<string>("APP_PROFILE_ROLE_COLUMN");
    const statusColumn = this.configService.getOrThrow<string>("APP_PROFILE_STATUS_COLUMN");

    return {
      id: String(data.id ?? supabaseUserId),
      supabaseUserId,
      email,
      fullName: data[fullNameColumn] ? String(data[fullNameColumn]) : null,
      employeeId: data[employeeIdColumn] ? String(data[employeeIdColumn]) : null,
      role: normalizeRole(data[roleColumn]),
      status: String(data[statusColumn] ?? "active")
    };
  }

  async findBySupabaseUserId(supabaseUserId: string, email: string): Promise<AuthenticatedUser | null> {
    const userIdColumn = this.configService.getOrThrow<string>("APP_PROFILE_USER_ID_COLUMN");
    const roleColumn = this.configService.getOrThrow<string>("APP_PROFILE_ROLE_COLUMN");
    const statusColumn = this.configService.getOrThrow<string>("APP_PROFILE_STATUS_COLUMN");
    const employeeIdColumn = this.configService.getOrThrow<string>("APP_PROFILE_EMPLOYEE_ID_COLUMN");
    const fullNameColumn = this.configService.getOrThrow<string>("APP_PROFILE_FULL_NAME_COLUMN");

    for (const tableName of this.profileTableNames) {
      const { data, error } = await this.supabaseAdminService.client
        .from(tableName)
        .select(`id, ${userIdColumn}, ${roleColumn}, ${statusColumn}, ${employeeIdColumn}, ${fullNameColumn}`)
        .eq(userIdColumn, supabaseUserId)
        .maybeSingle<Record<string, unknown>>();

      if (error) {
        if (isMissingTableError(error)) {
          continue;
        }

        throw new InternalServerErrorException(
          `Failed to resolve user profile from table "${tableName}": ${error.message}`
        );
      }

      if (data) {
        return this.mapProfileRow(data, supabaseUserId, email);
      }
    }

    return null;
  }

  private async loadAuthUser(supabaseUserId: string): Promise<SupabaseAuthUser | null> {
    const { data: authUserData, error: authUserError } = await this.supabaseAdminService.authAdmin.getUserById(
      supabaseUserId
    );

    if (authUserError) {
      throw new InternalServerErrorException(`Failed to load Supabase user for bootstrap: ${authUserError.message}`);
    }

    return authUserData.user ?? null;
  }

  private buildDevelopmentProfile(authUser: SupabaseAuthUser): AuthenticatedUser | null {
    if (!this.isDevelopment || !authUser.email) {
      return null;
    }

    const metadataRole = authUser.app_metadata?.role ?? authUser.user_metadata?.role;
    const email = authUser.email.trim().toLowerCase();

    return {
      id: authUser.id,
      supabaseUserId: authUser.id,
      email,
      fullName: resolveFullName(authUser),
      employeeId: authUser.id,
      role: resolveDevelopmentRole(metadataRole),
      status: "active"
    };
  }

  async bootstrapOwnerProfile(supabaseUserId: string): Promise<AuthenticatedUser | null> {
    const tableName = this.profileTableNames[0] ?? "users";

    const { count, error: countError } = await this.supabaseAdminService.client
      .from(tableName)
      .select("id", { count: "exact", head: true });

    if (countError) {
      if (this.isDevelopment && isMissingTableError(countError)) {
        const authUser = await this.loadAuthUser(supabaseUserId);
        return authUser ? this.buildDevelopmentProfile(authUser) : null;
      }

      throw new InternalServerErrorException(
        `Failed to verify application profiles in table "${tableName}": ${countError.message}`
      );
    }

    if ((count ?? 0) > 0) {
      return null;
    }

    const authUser = await this.loadAuthUser(supabaseUserId);

    if (!authUser?.email) {
      return null;
    }

    const metadataRole = authUser.app_metadata?.role ?? authUser.user_metadata?.role;

    if (metadataRole && metadataRole !== "owner") {
      return null;
    }

    const { data, error } = await this.supabaseAdminService.client
      .from(tableName)
      .insert({
        user_id: authUser.id,
        employee_id: authUser.id,
        full_name: resolveFullName(authUser),
        email: authUser.email.toLowerCase(),
        role: "owner",
        status: "active"
      })
      .select("*")
      .single<Record<string, unknown>>();

    if (error || !data) {
      if (error?.code === "23505") {
        return this.findBySupabaseUserId(authUser.id, authUser.email.toLowerCase());
      }

      if (this.isDevelopment && isMissingTableError(error)) {
        return this.buildDevelopmentProfile(authUser);
      }

      throw new InternalServerErrorException(`Failed to bootstrap owner profile: ${error?.message ?? "unknown"}`);
    }

    return this.mapProfileRow(data, authUser.id, authUser.email.toLowerCase());
  }
}
