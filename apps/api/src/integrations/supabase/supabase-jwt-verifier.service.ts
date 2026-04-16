import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createRemoteJWKSet, jwtVerify } from "jose";

interface SupabaseJwtPayload {
  sub: string;
  email?: string;
  role?: string;
}

@Injectable()
export class SupabaseJwtVerifierService {
  private readonly jwks = createRemoteJWKSet(new URL(this.configService.getOrThrow<string>("SUPABASE_JWKS_URL")));

  constructor(private readonly configService: ConfigService) {}

  async verifyAccessToken(token: string): Promise<SupabaseJwtPayload> {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: this.configService.getOrThrow<string>("SUPABASE_JWT_ISSUER"),
        audience: this.configService.getOrThrow<string>("SUPABASE_JWT_AUDIENCE")
      });

      if (!payload.sub) {
        throw new UnauthorizedException("Invalid token subject");
      }

      return payload as SupabaseJwtPayload;
    } catch {
      throw new UnauthorizedException("Invalid or expired Supabase access token");
    }
  }
}

