import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { ProductsLinkController } from './controllers/products_link.controller';
import { ProductsLinkService } from './services/products_link.service';
import { ChangeProductLinkCase } from './useCases/change-product-link/change_product_link.case';
import { CreateProductLinkCase } from './useCases/create-product-link/create_product_link.case';
import { ListProductLinksCase } from './useCases/list-product-links/list_product_links.case';
import { DeleteProductLinkCase } from './useCases/delete-product-link/delete_product_link.case';
import { UpdateProductLinkCase } from './useCases/update-product-link/update_product_link.case';
import { ChangeProductLinkAffiliateCase } from './useCases/change-product-link-affiliate/change_product_link.case';

@Module({
  imports: [InfraModule],
  controllers: [ProductsLinkController],
  providers: [
    CreateProductLinkCase,
    ListProductLinksCase,
    ChangeProductLinkCase,
    DeleteProductLinkCase,
    UpdateProductLinkCase,
    ChangeProductLinkAffiliateCase,
    ProductsLinkService,
  ],
  exports: [ProductsLinkService],
})
export class ProductsLinkModule {}
