import { CurrentUser } from '@/app/auth/decorators/current-user.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { PurchasesService } from '../services/purchases.service';

@Controller('@me/purchases')
export class PurchasesControllers {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get('products')
  async purchases(@CurrentUser('user_id') user_id: string) {
    const products = await this.purchasesService.getUserPurchases(user_id);

    return {
      hasError: false,
      data: products,
    };
  }

  @Get('products/:product_id')
  async getProductPurchased(
    @CurrentUser('user_id') user_id: string,
    @Param('product_id') product_id: string,
  ) {
    const product = await this.purchasesService.getProductPurchased({
      user_id,
      product_id,
    });

    return {
      hasError: false,
      data: product,
    };
  }

  @Get('products/:product_id/lessons')
  async getProductLessons(
    @CurrentUser('user_id') user_id: string,
    @Param('product_id') product_id: string,
  ) {
    const products = await this.purchasesService.getProductLessons({
      user_id,
      product_id,
    });

    return {
      hasError: false,
      data: products,
    };
  }

  @Get('modules/:module_id/lessons')
  async getlessonsByModule(
    @CurrentUser('user_id') user_id: string,
    @Param('module_id') module_id: string,
  ) {
    const lessons = await this.purchasesService.getLessonsByModule({
      user_id,
      module_id,
    });

    return {
      hasError: false,
      data: lessons,
    };
  }

  @Get('packages')
  async packages() {
    return {
      hasError: false,
      data: [],
    };
  }
}
