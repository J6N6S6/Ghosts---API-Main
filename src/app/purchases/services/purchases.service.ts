import { Purchases } from '@/infra/database/entities/purchases.entity';
import { Injectable } from '@nestjs/common';
import { ListUserPurchasesCase } from '../useCases/list-user-purchases/list_user_purchases.case';
import { UserHasProductCase } from '../useCases/user-has-product/user_has_product.case';
import { GetProductLessonsCase } from '../useCases/get-product-lessons/get_product_lessons.case';
import { GetProductLessonsDTO } from '../useCases/get-product-lessons/get_product_lessons.dto';
import { GetProductPurchasedCase } from '../useCases/get-product-purchased/get_product_purchased.case';
import { GetLessonsByModuleCase } from '../useCases/get-lessons-by-module/get_lessons_by_module.case';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly listUserPurchases: ListUserPurchasesCase,
    private readonly userHasProductCase: UserHasProductCase,
    private readonly getProductPurchasedCase: GetProductPurchasedCase,
    private readonly getProductLessonsCase: GetProductLessonsCase,
    private readonly getLessonsByModuleCase: GetLessonsByModuleCase,
  ) {}

  async userHasPurchased(
    user_id: string,
    product_id: string,
  ): Promise<Purchases> {
    return await this.userHasProductCase.execute(user_id, product_id);
  }

  async getUserPurchases(user_id: string): Promise<Purchases[]> {
    return this.listUserPurchases.execute(user_id);
  }

  async getProductLessons(data: GetProductLessonsDTO): Promise<Purchases> {
    return await this.getProductLessonsCase.execute(data);
  }

  async getProductPurchased(data: { user_id: string; product_id: string }) {
    return await this.getProductPurchasedCase.execute(data);
  }

  async getLessonsByModule(data: { module_id: string; user_id: string }) {
    return await this.getLessonsByModuleCase.execute(data);
  }
}
