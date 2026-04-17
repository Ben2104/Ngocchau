import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { APP_ERROR_CODES } from "@gold-shop/constants";
import {
  APP_ROLES,
  type AppRole,
  type AuthenticatedUser,
  type EmployeeDeleteResult,
  type EmployeeListItem
} from "@gold-shop/types";
import type { EmployeeCreateInput } from "@gold-shop/validation";
import { getInitials } from "@gold-shop/utils";

import { AppSetupException } from "../../common/exceptions/app-setup.exception";
import { isMissingTableError, type SupabaseQueryError } from "../../common/utils/supabase-error.util";
import { SupabaseAdminService } from "../../integrations/supabase/supabase-admin.service";

function normalizeRole(value: unknown): AppRole {
  const fallbackRole = "staff";

  return APP_ROLES.includes(value as AppRole) ? (value as AppRole) : fallbackRole;
}

function mapEmployeeRow(row: Record<string, unknown>): EmployeeListItem {
  const fullName = String(row.full_name ?? "Nhân viên");
  const role = normalizeRole(row.role);

  return {
    id: String(row.id),
    profile: {
      id: row.user_id ? String(row.user_id) : String(row.id),
      fullName,
      initials: getInitials(fullName),
      avatarUrl: null,
      email: row.email ? String(row.email) : undefined
    },
    role,
    joinedAt: String(row.joined_at ?? row.created_at ?? new Date().toISOString())
  };
}

interface EmployeeRow {
  id: string;
  user_id: string;
  role: AppRole;
  full_name: string;
  email: string;
}

@Injectable()
export class EmployeesRepository {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseAdminService: SupabaseAdminService
  ) {}

  private get tableName() {
    return this.configService.getOrThrow<string>("APP_PROFILE_TABLES").split(",")[0]?.trim() || "users";
  }

  private throwMissingProfileTable(error: SupabaseQueryError): never {
    throw new AppSetupException(
      "Bảng hồ sơ nhân viên chưa được khởi tạo trên Supabase project này. Cần tạo bảng public.users trước khi quản lý nhân viên.",
      APP_ERROR_CODES.employeeProfileTableMissing,
      {
        tableName: this.tableName,
        providerCode: error?.code ?? null
      }
    );
  }

  async list(): Promise<EmployeeListItem[]> {
    const { data, error } = await this.supabaseAdminService.client
      .from(this.tableName)
      .select("*")
      .eq("status", "active")
      .order("joined_at", { ascending: false });

    if (error) {
      if (isMissingTableError(error)) {
        this.throwMissingProfileTable(error);
      }

      throw new InternalServerErrorException(`Failed to read employees: ${error.message}`);
    }

    const rows = (data ?? []) as Array<Record<string, unknown>>;

    return rows.map(mapEmployeeRow);
  }

  async create(input: EmployeeCreateInput): Promise<EmployeeListItem> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const fullName = input.fullName.trim();

    const { data: authData, error: authError } = await this.supabaseAdminService.authAdmin.createUser({
      email: normalizedEmail,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName
      },
      app_metadata: {
        role: input.role
      }
    });

    if (authError) {
      if (authError.message.toLowerCase().includes("already")) {
        throw new ConflictException("Email này đã tồn tại");
      }

      throw new BadRequestException(`Không thể tạo tài khoản đăng nhập: ${authError.message}`);
    }

    const authUserId = authData.user?.id;

    if (!authUserId) {
      throw new InternalServerErrorException("Supabase did not return a user id for the new employee");
    }

    const { data, error } = await this.supabaseAdminService.client
      .from(this.tableName)
      .insert({
        user_id: authUserId,
        employee_id: authUserId,
        full_name: fullName,
        email: normalizedEmail,
        role: input.role,
        status: "active"
      })
      .select("*")
      .single<Record<string, unknown>>();

    if (error || !data) {
      const rollback = await this.supabaseAdminService.authAdmin.deleteUser(authUserId);

      if (rollback.error) {
        throw new InternalServerErrorException(
          `Failed to create employee profile (${error?.message ?? "unknown"}) and rollback auth user (${rollback.error.message})`
        );
      }

      if (isMissingTableError(error)) {
        this.throwMissingProfileTable(error);
      }

      if (error?.message.toLowerCase().includes("duplicate") || error?.code === "23505") {
        throw new ConflictException("Email này đã tồn tại trong hồ sơ nhân viên");
      }

      throw new InternalServerErrorException(`Failed to create employee profile: ${error?.message ?? "unknown"}`);
    }

    return mapEmployeeRow(data);
  }

  async delete(id: string, actor: AuthenticatedUser): Promise<EmployeeDeleteResult> {
    const { data, error } = await this.supabaseAdminService.client
      .from(this.tableName)
      .select("id, user_id, role, full_name, email")
      .eq("id", id)
      .maybeSingle<EmployeeRow>();

    if (error) {
      if (isMissingTableError(error)) {
        this.throwMissingProfileTable(error);
      }

      throw new InternalServerErrorException(`Failed to load employee profile: ${error.message}`);
    }

    if (!data) {
      throw new NotFoundException("Không tìm thấy nhân viên cần xóa");
    }

    if (data.role === "owner") {
      throw new BadRequestException("Không thể xóa tài khoản chủ cửa hàng");
    }

    if (data.user_id === actor.supabaseUserId) {
      throw new BadRequestException("Không thể tự xóa chính tài khoản hiện tại");
    }

    const { error: deleteAuthError } = await this.supabaseAdminService.authAdmin.deleteUser(data.user_id);

    if (deleteAuthError) {
      throw new InternalServerErrorException(`Failed to delete employee auth user: ${deleteAuthError.message}`);
    }

    const { data: deletedProfile, error: deleteProfileError } = await this.supabaseAdminService.client
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .select("id")
      .single<{ id: string }>();

    if (deleteProfileError || !deletedProfile) {
      if (isMissingTableError(deleteProfileError)) {
        this.throwMissingProfileTable(deleteProfileError);
      }

      throw new InternalServerErrorException(
        `Failed to delete employee profile: ${deleteProfileError?.message ?? "unknown"}`
      );
    }

    return {
      id: deletedProfile.id
    };
  }
}
