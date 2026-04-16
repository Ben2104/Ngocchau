import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductsService {
  list() {
    return {
      items: [],
      note: "Starter module for product catalog and SKU settings."
    };
  }
}

