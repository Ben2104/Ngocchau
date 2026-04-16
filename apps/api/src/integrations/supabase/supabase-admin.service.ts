import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "../../../../../supabase/types/database.types";

@Injectable()
export class SupabaseAdminService {
  private readonly clientInstance: SupabaseClient<Database>;

  constructor(private readonly configService: ConfigService) {
    this.clientInstance = createClient<Database>(
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
}

