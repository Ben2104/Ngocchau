import { Module } from "@nestjs/common";

import { UserProfileRepository } from "../../database/repositories/user-profile.repository";
import { IntegrationsModule } from "../../integrations/integrations.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  imports: [IntegrationsModule],
  controllers: [AuthController],
  providers: [AuthService, UserProfileRepository],
  exports: [AuthService]
})
export class AuthModule {}

