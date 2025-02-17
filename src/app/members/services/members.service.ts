import { Injectable } from '@nestjs/common';
import { GetLessonCase } from '../useCases/get-lesson/get_lesson.case';
import { GetLessonDTO } from '../useCases/get-lesson/get_lesson.dto';
import { GetProductModuleCase } from '../useCases/get-product-module/get_product_module.case';
import { GetProductModuleDTO } from '../useCases/get-product-module/get_product_module.dto';
import { GetProductModulesCase } from '../useCases/get-product-modules/get_product_modules.case';
import { GetProductModulesDTO } from '../useCases/get-product-modules/get_product_modules.dto';
import { GetProductCase } from '../useCases/get-product/get_product.case';
import { GetProductDTO } from '../useCases/get-product/get_product.dto';
import { RatingLessonCase } from '../useCases/rating-lesson/rating_lesson.case';
import { RatingLessonDTO } from '../useCases/rating-lesson/rating_lesson.dto';
import { SaveUserLessonProgressCase } from '../useCases/save-user-lesson-progress/save_user_lesson_progress.case';
import { SaveUserLessonProgressDTO } from '../useCases/save-user-lesson-progress/save_user_lesson_progress.dto';

@Injectable()
export class MembersService {
  constructor(
    private readonly getProductCase: GetProductCase,
    private readonly getProductModulesCase: GetProductModulesCase,
    private readonly getProductModuleCase: GetProductModuleCase,
    private readonly getLessonCase: GetLessonCase,
    private readonly ratingLessonCase: RatingLessonCase,
    private readonly saveUserLessonProgressCase: SaveUserLessonProgressCase,
  ) {}

  getProduct(data: GetProductDTO) {
    return this.getProductCase.execute(data);
  }

  getProductModules(data: GetProductModulesDTO) {
    return this.getProductModulesCase.execute(data);
  }

  getProductModule(data: GetProductModuleDTO) {
    return this.getProductModuleCase.execute(data);
  }

  getLesson(data: GetLessonDTO) {
    return this.getLessonCase.execute(data);
  }

  ratingLesson(data: RatingLessonDTO) {
    return this.ratingLessonCase.execute(data);
  }

  saveUserLessonProgress(data: SaveUserLessonProgressDTO) {
    return this.saveUserLessonProgressCase.execute(data);
  }
}
