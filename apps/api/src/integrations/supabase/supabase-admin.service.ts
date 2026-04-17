import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "@supabase/supabase-js";

type SupabaseAdminClient = ReturnType<typeof createClient>;
type SupabaseAdminApi = {
  createUser: (...args: unknown[]) => Promise<{
    data: {
      user?: {
        id?: string | null;
      } | null;
    };
    error: {
      message: string;
    } | null;
  }>;
  deleteUser: (...args: unknown[]) => Promise<{
    error: {
      message: string;
    } | null;
  }>;
  getUserById: (...args: unknown[]) => Promise<{
    data: {
      user?: {
        id: string;
        email?: string | null;
        app_metadata?: Record<string, unknown>;
        user_metadata?: Record<string, unknown>;
      } | null;
    };
    error: {
      message: string;
    } | null;
  }>;
};

@Injectable()
export class SupabaseAdminService {
  private readonly clientInstance: SupabaseAdminClient;

  constructor(private readonly configService: ConfigService) {
    this.clientInstance = createClient(
      this.configService.getOrThrow<string>("SUPABASE_URL"),
      this.configService.getOrThrow<string>("SUPABASE_SERVICE_ROLE_KEY"),
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );
  }

  get client() {
    return this.clientInstance;
  }

  get authAdmin(): SupabaseAdminApi {
    return (this.clientInstance.auth as { admin: SupabaseAdminApi }).admin;
  }
}
