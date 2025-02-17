import { UserIsProductOwner } from '@/shared/decorators/user-is-product-owner.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsLinkService } from '../services/products_link.service';
import { CreateProductLinkBody } from '../validators/create_product_link.body';
import { UpdateProductLinkBody } from '../validators/update_product_link.body';
import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';

@Controller('products/links')
export class ProductsLinkController {
  constructor(private readonly productsLinkService: ProductsLinkService) {}

  @Post('/:product_id')
  @UserIsProductOwner()
  @HttpCode(201)
  async create(
    @Param('product_id') product_id: string,
    @Body() data: CreateProductLinkBody,
  ) {
    const product = await this.productsLinkService.createProductLink({
      ...data,
      product_id,
    });

    return {
      hasError: false,
      data: product,
    };
  }

  @Get('/:product_id')
  async list(
    @Param('product_id') product_id: string,
    @CurrentUser('user_id') user_id: string,
  ) {
    const products = await this.productsLinkService.listProductLinks({
      product_id,
      user_id,
    });

    return {
      hasError: false,
      data: products,
    };
  }

  @Patch('/:product_id/active/:link_id')
  @UserIsProductOwner()
  async change(@Param('link_id') link_id: string) {
    await this.productsLinkService.changeProductLink(link_id);

    return {
      hasError: false,
      message: 'Link alterado com sucesso',
    };
  }

  @Patch('/:product_id/affiliate/:link_id')
  @UserIsProductOwner()
  async changeAffiliate(@Param('link_id') link_id: string) {
    await this.productsLinkService.changeProductLinkAffiliate(link_id);

    return {
      hasError: false,
      message: 'Link alterado com sucesso',
    };
  }

  @Put('/:product_id/:link_id')
  @UserIsProductOwner()
  async update(
    @Param('link_id') link_id: string,
    @Body() data: UpdateProductLinkBody,
  ) {
    await this.productsLinkService.updateProductLink({
      ...data,
      link_id,
    });

    return {
      hasError: false,
      message: 'Link alterado com sucesso',
    };
  }

  @Delete('/:product_id/:link_id')
  @UserIsProductOwner()
  async delete(@Param('link_id') link_id: string) {
    await this.productsLinkService.deleteProductLink(link_id);

    return {
      hasError: false,
      message: 'Link deletado com sucesso',
    };
  }
}
