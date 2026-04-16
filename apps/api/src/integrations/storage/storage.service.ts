import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { SupabaseAdminService } from "../supabase/supabase-admin.service";

@Injectable()
export class StorageService {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseAdminService: SupabaseAdminService
  ) {}

  async uploadBuffer(path: string, buffer: Buffer, contentType: string) {
    const bucketName = this.configService.getOrThrow<string>("SUPABASE_STORAGE_BUCKET_EXCEL_IMPORTS");
    const { error } = await this.supabaseAdminService.client.storage
      .from(bucketName)
      .upload(path, buffer, {
        upsert: true,
        contentType
      });

    if (error) {
      throw new InternalServerErrorException(`Failed to upload file to storage: ${error.message}`);
    }

    return {
      bucketName,
      path
    };
  }

  async downloadBuffer(path: string) {
    const bucketName = this.configService.getOrThrow<string>("SUPABASE_STORAGE_BUCKET_EXCEL_IMPORTS");
    const { data, error } = await this.supabaseAdminService.client.storage.from(bucketName).download(path);

    if (error || !data) {
      throw new InternalServerErrorException(`Failed to download file from storage: ${error?.message ?? "unknown"}`);
    }

    return Buffer.from(await data.arrayBuffer());
  }
}

