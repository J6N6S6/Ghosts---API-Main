import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { ClientException } from '@/infra/exception/client.exception';
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductsAffiliatesService } from '../services/products_affiliates.service';

@Controller('products')
export class ProductsAffiliatesController {
  constructor(
    private readonly productsAffiliatesService: ProductsAffiliatesService,
  ) {}

  @Get('affiliates/list')
  async listAffiliations(
    @CurrentUser('user_id') user_id: string,
    @Query('products') products: string[],
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status: 'active' | 'pending' | 'rejected',
  ) {
    if (limit && (limit < 10 || limit > 100))
      throw new ClientException('Limit must be between 10 and 100');

    const affiliates = await this.productsAffiliatesService.listAffiliations({
      user_id,
      products: products || [],
      page: page || 1,
      limit: limit || 10,
      status,
    });

    return {
      hasError: false,
      data: affiliates,
    };
  }

  @Post(':product_id/affiliates/request')
  async requestAffiliation(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    await this.productsAffiliatesService.requestAffiliation({
      user_id,
      product_id,
    });

    return {
      hasError: false,
      message: 'Solicitação de afiliação enviada',
    };
  }

  @Post(':product_id/affiliates/:affiliation_id/actions/:action')
  async affiliationActionControl(
    @Param('product_id') product_id: string,
    @Param('affiliation_id') affiliation_id: string,
    @Param('action')
    action: 'accept' | 'reject' | 'block' | 'unblock' | 'block-and-reject',
    @CurrentUser('user_id') user_id: string,
  ) {
    await this.productsAffiliatesService.affiliationActionControl({
      user_id,
      product_id,
      affiliation_id,
      action,
    });

    return {
      hasError: false,
      message: 'Ação realizada com sucesso',
    };
  }
}
