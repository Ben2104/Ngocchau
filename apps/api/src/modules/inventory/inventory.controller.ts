import { Controller, Get } from "@nestjs/common";

import { Roles } from "../../common/decorators/roles.decorator";
import { InventoryService } from "./inventory.service";

@Controller({
  path: "inventory",
  version: "1"
})
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Roles("manager", "staff", "accountant")
  @Get()
  getInventory() {
    return this.inventoryService.list();
  }
}

