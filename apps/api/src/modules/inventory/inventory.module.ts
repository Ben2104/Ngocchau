import { Module } from "@nestjs/common";

import { InventoryRepository } from "../../database/repositories/inventory.repository";
import { IntegrationsModule } from "../../integrations/integrations.module";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";

@Module({
  imports: [IntegrationsModule],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository]
})
export class InventoryModule {}

