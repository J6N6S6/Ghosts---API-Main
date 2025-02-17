import { IsAdmin } from '@/app/auth/decorators/endpoint-admin.decorator';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { AdminProductsControlDTO } from '../useCases/admin-products-control/admin_products_control.dto';
import { UpdateProductPaymentMethodsBody } from '../validators/update_product_payment_methods.body';

@IsAdmin()
@Controller('@admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('list/:product_status')
  @IsAdmin()
  async listAllProducts(
    @Query() queryData: AdminProductsControlDTO,
    @Param('product_status')
    product_status:
      | 'IN_PRODUCTION'
      | 'IN_UPDATE'
      | 'IN_REVIEW'
      | 'ARCHIVED'
      | 'BLOCKED'
      | 'APPROVED'
      | 'REJECTED',
  ) {
    const data = await this.productsService.adminProductsControl({
      ...queryData,
      status: product_status,
    });

    return {
      hasError: false,
      data,
    };
  }

  @Post('update/status/:product_id')
  @IsAdmin()
  async updateProductStatus(
    @Body()
    data: {
      status:
        | 'IN_PRODUCTION'
        | 'IN_UPDATE'
        | 'IN_REVIEW'
        | 'ARCHIVED'
        | 'BLOCKED'
        | 'APPROVED'
        | 'REJECTED';
      status_reason: string;
    },
    @Param('product_id')
    product_id: string,
  ) {
    await this.productsService.adminChangeProductStatus({
      ...data,
      product_id,
    });

    return {
      hasError: false,
      message: 'Status do produto atualizado com sucesso',
    };
  }

  @Put('preferences/payment-methods/:product_id')
  @IsAdmin()
  async updatePaymentMethod(
    @Body()
    data: UpdateProductPaymentMethodsBody,
    @Param('product_id')
    product_id: string,
  ) {
    await this.productsService.adminUpdateProductPaymentMethods({
      product_id,
      payment_methods: data.payment_methods,
    });

    return {
      hasError: false,
      message: 'Métodos de pagamento do produto atualizado com sucesso',
    };
  }
}
