import {
  ProductsModulesRepository,
  PurchasesRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { GetProductModulesDTO } from './get_product_modules.dto';
import { ProductModules } from '../../types/product_modules.type';

@Injectable()
export class GetProductModulesCase {
  constructor(
    private readonly purchaseRepository: PurchasesRepository,
    private readonly productsModulesRepository: ProductsModulesRepository,
  ) {}

  async execute({
    user_id,
    product_id,
    lessons = false,
  }: GetProductModulesDTO): Promise<ProductModules[]> {
    const purchase = await this.purchaseRepository.findBy({
      where: [
        { user_id, product_id },
        {
          user_id,
          product: {
            short_id: product_id,
          },
        },
      ],
      select: ['id', 'product_id', 'watched_lessons'],
    });

    if (!purchase)
      throw new ClientException('Você não tem acesso a este produto.');

    const productModules = await this.productsModulesRepository.findAll({
      where: {
        product_id: purchase.product_id,
        lessons: {
          draft: false,
        },
      },
      order: {
        position: 'ASC',
        lessons: {
          position: 'ASC',
        },
      },
      select: {
        id: true,
        title: true,
        position: true,
        image: true,
        show_title: true,
        lessons: {
          id: true,
          title: true,
          description: true,
          position: true,
          availability: true,
          availability_date: true,
          availability_days: true,
          availability_type: true,
          thumbnail: true,
          duration: true,
        },
      },
      relations: ['lessons'],
    });

    const modules: ProductModules[] = [];

    for (const productModule of productModules) {
      let moduleDuration = 0;
      let lessonsModuleFinished = 0;
      const productLessons = [];

      for (const productLesson of productModule.lessons) {
        moduleDuration += productLesson.duration;
        const watched = purchase.watched_lessons.find(
          (watchedLesson) => watchedLesson.lesson_id === productLesson.id,
        );

        if (watched && watched.lesson_completed) {
          lessonsModuleFinished += 1;
        }

        if (lessons) {
          productLessons.push({
            id: productLesson.id,
            title: productLesson.title,
            description: productLesson.description,
            position: productLesson.position,
            availability: productLesson.availability,
            availability_date: productLesson.availability_date,
            availability_days: productLesson.availability_days,
            availability_type: productLesson.availability_type,
            thumbnail: productLesson.thumbnail,
            duration: productLesson.duration,
            watched: watched ? watched.lesson_completed : false,
            watched_at: watched ? watched.lesson_timestamp : 0,
          });
        }
      }

      const moduleProgress =
        productModule.lessons.length > 0
          ? (lessonsModuleFinished / productModule.lessons.length) * 100
          : 0;

      modules.push({
        id: productModule.id,
        title: productModule.title,
        position: productModule.position,
        image: productModule.image,
        show_title: productModule.show_title,
        duration: moduleDuration,
        progress: parseFloat(moduleProgress.toFixed(2)),
        lessons: lessons ? productLessons : undefined,
      });
    }

    return modules;
  }
}
