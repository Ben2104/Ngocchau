import { Module } from "@nestjs/common";

import { ExcelParserService } from "./excel/excel-parser.service";
import { StorageService } from "./storage/storage.service";
import { SupabaseAdminService } from "./supabase/supabase-admin.service";
import { SupabaseJwtVerifierService } from "./supabase/supabase-jwt-verifier.service";

@Module({
  providers: [SupabaseAdminService, SupabaseJwtVerifierService, StorageService, ExcelParserService],
  exports: [SupabaseAdminService, SupabaseJwtVerifierService, StorageService, ExcelParserService]
})
export class IntegrationsModule {}

