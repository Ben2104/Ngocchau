import { Controller, Get } from "@nestjs/common";

import { Roles } from "../../common/decorators/roles.decorator";
import { ProductsService } from "./products.service";

@Controller({
  path: "products",
  version: "1"
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles("owner", "manager")
  @Get()
  list() {
    return this.productsService.list();
  }
}

