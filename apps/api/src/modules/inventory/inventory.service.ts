import { Injectable } from "@nestjs/common";

import { InventoryRepository } from "../../database/repositories/inventory.repository";

@Injectable()
export class InventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  list() {
    return this.inventoryRepository.findAll();
  }
}

