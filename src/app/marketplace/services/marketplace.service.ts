import { Injectable } from '@nestjs/common';
import { ListMarketplaceProductsCase } from '../useCases/list-marketplace-products/list_marketplace_products.case';
import { ListMarketplaceProductsDTO } from '../useCases/list-marketplace-products/list_marketplace_products.dto';
import { GetMarketplaceProductCase } from '../useCases/get-marketplace-product/get_marketplace_product.case';
import { GetMarketplaceProductDTO } from '../useCases/get-marketplace-product/get_marketplace_product.dto';

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly listMarketplaceProductsCase: ListMarketplaceProductsCase,
    private readonly getMarketplaceProductCase: GetMarketplaceProductCase,
  ) {}

  async listProducts(data: ListMarketplaceProductsDTO) {
    return this.listMarketplaceProductsCase.execute(data);
  }

  async getProduct(data: GetMarketplaceProductDTO) {
    return this.getMarketplaceProductCase.execute(data);
  }
}
