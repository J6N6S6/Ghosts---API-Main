import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { ProductsLinkModule } from '../products_link/products_link.module';
import { ProductsController } from './controllers/products.controller';
import { UserProductsController } from './controllers/user_products.controller';
import { ProductsService } from './services/products.service';
import { AddProductOrderbumpCase } from './useCases/add-product-orderbump/add_product_orderbump.case';
import { CreateProductCase } from './useCases/create-product/create_product.case';
import { FindProductByIdCase } from './useCases/find-product-by-id/find_product_by_id.case';
import { FindProductByShortIdCase } from './useCases/find-product-by-short-id/find_product_by_short_id.case';
import { GetGeneralSettingsCase } from './useCases/get-general-settings/get_general_settings.case';
import { GetProductCheckoutCase } from './useCases/get-product-checkout/get_product_checkout.case';
import { GetUserProductCase } from './useCases/get-user-product/get_user_product.case';
import { ListProductOrderbumpsCase } from './useCases/list-product-orderbumps/list_product_orderbumps.case';
import { ListUserProductsCase } from './useCases/list-user-products/list_user_products.case';
import { RemoveProductOrderbumpCase } from './useCases/remove-product-orderbump/remove_product_orderbump.case';
import { UpdateGeneralSettingsCase } from './useCases/update-general-settings/update_general_settings.case';
import { UpdateProductBannerCase } from './useCases/update-product-banner/update_product_banner.case';
import { UpdateProductCheckoutCase } from './useCases/update-product-checkout/update_product_checkout.case';
import { UpdateProductImageCase } from './useCases/update-product-image/update_product_image.case';
import { UpdateProductOrderbumpCase } from './useCases/update-product-orderbump/update_product_orderbump.case';
import { UpdateProductCase } from './useCases/update-product/update_product.case';
import { VerifyTotalCommissionCase } from './useCases/verify-total-commission/verify_total_commission.case';
import { ListProductStudentsCase } from './useCases/list-product-students/list_product_students.case';
import { ArchiveProductCase } from './useCases/archive-product/archive-product.case';
import { AdminProductsController } from './controllers/admin_products.controller';
import { AdminProductsControlCase } from './useCases/admin-products-control/admin_products_control.case';
import { AdminChangeProductStatusCase } from './useCases/admin-change-product-status/admin_change_product_status.case';
import { SendProductToRevisionCase } from './useCases/send-product-to-revision/send-product-to-revision';
import { AdminUpdateProductPaymentMethodsCase } from './useCases/admin-update-product-payment-methods/admin_update_product_payment_methods.case';

@Module({
  imports: [InfraModule, ProductsLinkModule],
  controllers: [
    ProductsController,
    UserProductsController,
    AdminProductsController,
  ],
  providers: [
    CreateProductCase,
    ListUserProductsCase,
    FindProductByIdCase,
    UpdateProductCase,
    UpdateProductImageCase,
    ProductsService,
    GetProductCheckoutCase,
    UpdateProductCheckoutCase,
    UpdateProductBannerCase,
    AddProductOrderbumpCase,
    RemoveProductOrderbumpCase,
    UpdateProductOrderbumpCase,
    FindProductByShortIdCase,
    UpdateGeneralSettingsCase,
    ListProductOrderbumpsCase,
    GetGeneralSettingsCase,
    VerifyTotalCommissionCase,
    GetUserProductCase,
    ListProductStudentsCase,
    ArchiveProductCase,
    AdminProductsControlCase,
    AdminChangeProductStatusCase,
    SendProductToRevisionCase,
    AdminUpdateProductPaymentMethodsCase,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
