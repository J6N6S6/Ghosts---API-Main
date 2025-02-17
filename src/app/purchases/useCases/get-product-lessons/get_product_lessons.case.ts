import { ProductsModulesRepository } from '@/domain/repositories';
import { PurchasesRepository } from '@/domain/repositories/purchases.repository';
import { Injectable } from '@nestjs/common';
import { GetProductLessonsDTO } from './get_product_lessons.dto';

import * as datefns from 'date-fns';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class GetProductLessonsCase {
  constructor(
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsModulesRepository: ProductsModulesRepository,
  ) {}

  async execute({ product_id, user_id }: GetProductLessonsDTO): Promise<any> {
    const purchase = await this.purchasesRepository.findByUserIdAndProductId(
      user_id,
      product_id,
    );

    if (!purchase) {
      throw new ClientException(
        'Este usuário não possui acesso a este produto',
      );
    }

    const modules = await this.productsModulesRepository.findAll({
      where: {
        product_id,
      },
      relations: ['lessons', 'lessons.materials'],
      order: {
        position: 'ASC',
        lessons: {
          position: 'ASC',
        },
      },
    });

    const modulesWithLessons = modules.map((m) => {
      return {
        ...m,
        lessons: m.lessons.map((l) => {
          const hasAvailability =
            l.availability === 'immediate' ||
            (l.availability === 'programmed' &&
              ((l.availability_type === 'scheduled' &&
                datefns.isAfter(purchase.createdAt, l.availability_date)) ||
                (l.availability_type === 'timer' &&
                  datefns.isAfter(
                    purchase.createdAt,
                    datefns.addDays(new Date(), l.availability_days),
                  ))));

          const availabilityDate = hasAvailability
            ? null
            : l.availability_type === 'scheduled'
            ? l.availability_date
            : datefns.addDays(new Date(), l.availability_days);

          const watched = purchase.watched_lessons.find(
            (i) => i.lesson_id === l.id,
          );

          return {
            id: l.id,
            title: l.title,
            description: l.description,
            comments: l.comments,
            module_id: l.module_id,
            position: l.position,
            background: l.background,
            thumbnail: l.thumbnail,
            availability: hasAvailability,
            availability_date: availabilityDate,

            materials: hasAvailability ? l.materials : [],
            video_url: hasAvailability ? l.video_url : null,

            watched: watched?.lesson_completed || false,
            watched_time: watched?.lesson_timestamp || null,
          };
        }),
      };
    });

    return modulesWithLessons;
  }
}
