import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { ClientException } from '@/infra/exception/client.exception';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { MarketplaceService } from '../services/marketplace.service';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('products')
  async listProducts(
    @Query()
    data: {
      page: number;
      limit: number;
      category_id: string;
      order_by: 'MOST_RECENT' | 'MOST_SALES' | 'MOST_RATING';
      search: string;
    },
  ) {
    if (!data.page) data.page = 1;
    if (!data.limit) data.limit = 10;

    if (data.limit < 10 || data.limit > 20)
      throw new ClientException('Limit must be between 10 and 20');

    const products = await this.marketplaceService.listProducts(data);

    return {
      hasError: false,
      data: products,
    };
  }

  @Get('products/:product_id')
  async getProduct(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    const product = await this.marketplaceService.getProduct({
      product_id,
      user_id,
    });

    return {
      hasError: false,
      data: product,
    };
  }
}
