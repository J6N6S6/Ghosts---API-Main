import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { LessonsModule } from '../lessons/lessons.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { MarketplaceController } from './controllers/marketplace.controller';
import { MarketplaceService } from './services/marketplace.service';
import { ListMarketplaceProductsCase } from './useCases/list-marketplace-products/list_marketplace_products.case';
import { GetMarketplaceProductCase } from './useCases/get-marketplace-product/get_marketplace_product.case';

@Module({
  imports: [InfraModule, LessonsModule, TransactionsModule],
  controllers: [MarketplaceController],
  providers: [
    ListMarketplaceProductsCase,
    GetMarketplaceProductCase,
    MarketplaceService,
  ],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
