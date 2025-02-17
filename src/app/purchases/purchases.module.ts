import { InfraModule } from '@/infra/infra.module';
import { Module } from '@nestjs/common';
import { PurchasesControllers } from './controllers/purchases.controller';
import { PurchasesService } from './services/purchases.service';
import { GetLessonsByModuleCase } from './useCases/get-lessons-by-module/get_lessons_by_module.case';
import { GetProductLessonsCase } from './useCases/get-product-lessons/get_product_lessons.case';
import { GetProductPurchasedCase } from './useCases/get-product-purchased/get_product_purchased.case';
import { ListUserPurchasesCase } from './useCases/list-user-purchases/list_user_purchases.case';
import { UserHasProductCase } from './useCases/user-has-product/user_has_product.case';

@Module({
  imports: [InfraModule],
  providers: [
    ListUserPurchasesCase,
    UserHasProductCase,
    GetProductLessonsCase,
    GetProductPurchasedCase,
    GetLessonsByModuleCase,
    PurchasesService,
  ],
  controllers: [PurchasesControllers],
  exports: [PurchasesService],
})
export class PurchasesModule {}
