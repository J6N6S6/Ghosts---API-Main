import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';

@Controller('@me/products')
export class UserProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async listAllProducts(@CurrentUser('user_id') user_id: string) {
    const products = await this.productsService.listUserProducts(user_id);
    return {
      hasError: false,
      data: products,
    };
  }

  @Get(':product_id')
  async getProduct(
    @CurrentUser('user_id') user_id: string,
    product_id: string,
  ) {
    const product = await this.productsService.getUserProduct({
      user_id,
      product_id,
    });

    return {
      hasError: false,
      data: product,
    };
  }

  @Get(':product_id/students')
  async getMyStudents(
    @CurrentUser('user_id') user_id: string,
    @Param('product_id') product_id: string,
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 20) limit = 20;

    const product = await this.productsService.listProductStudents({
      user_id,
      product_id,
      search,
      page,
      limit,
    });

    return {
      hasError: false,
      data: product,
    };
  }
}
