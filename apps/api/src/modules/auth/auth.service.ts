import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";

import type { AuthenticatedUser } from "@gold-shop/types";

import { UserProfileRepository } from "../../database/repositories/user-profile.repository";
import { SupabaseJwtVerifierService } from "../../integrations/supabase/supabase-jwt-verifier.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtVerifierService: SupabaseJwtVerifierService,
    private readonly userProfileRepository: UserProfileRepository
  ) {}

  async authenticateToken(accessToken: string): Promise<AuthenticatedUser> {
    const payload = await this.jwtVerifierService.verifyAccessToken(accessToken);
    const user = await this.userProfileRepository.findBySupabaseUserId(payload.sub, payload.email ?? "");

    if (!user) {
      throw new UnauthorizedException("No application profile found for this Supabase user");
    }

    if (user.status !== "active") {
      throw new ForbiddenException("This user profile is inactive");
    }

    return user;
  }

  getStatus() {
    return {
      service: "api",
      auth: "ready"
    };
  }
}

