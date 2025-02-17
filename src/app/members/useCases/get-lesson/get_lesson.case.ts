import {
  LessonRatingsRepository,
  ProductsLessonsRepository,
  PurchasesRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { GetLessonDTO } from './get_lesson.dto';

@Injectable()
export class GetLessonCase {
  constructor(
    private readonly purchaseRepository: PurchasesRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
    private readonly lessonRatingsRepository: LessonRatingsRepository,
  ) {}

  async execute({ user_id, lesson_id }: GetLessonDTO) {
    const lesson = await this.productsLessonsRepository.findBy({
      where: {
        id: lesson_id,
        draft: false,
      },
      select: {
        id: true,
        title: true,
        description: true,
        position: true,
        video_url: true,
        availability: true,
        availability_date: true,
        availability_days: true,
        availability_type: true,
        thumbnail: true,
        duration: true,
        background: true,
        comments: true,
        draft: true,
        materials: true,
        product_id: true,
        product: {
          id: true,
          title: true,
          producer_name: true,
          support_email: true,
          support_phone: true,

          category: {
            id: true,
            title: true,
          },
        },
      },
      relations: ['product', 'product.category', 'materials'],
    });

    if (!lesson) throw new ClientException('Aula não encontrada.');

    const purchase = await this.purchaseRepository.findBy({
      where: {
        user_id,
        product_id: lesson.product_id,
      },
      select: ['id', 'watched_lessons', 'createdAt'],
    });

    if (!purchase)
      throw new ClientException('Você não tem acesso a esta aula.');

    if (lesson.draft) throw new ClientException('Aula não disponível.');
    if (lesson.availability === 'programmed') {
      if (lesson.availability_type === 'scheduled') {
        if (!lesson.availability_date || new Date() < lesson.availability_date)
          throw new ClientException('Aula não disponível.');
      } else if (lesson.availability_type === 'timer') {
        // availability_days = numero de dias apois a compra que a aula estará disponivel
        const purchaseDate = new Date(purchase.createdAt);
        const availabilityDate = new Date(
          purchaseDate.setDate(
            purchaseDate.getDate() + lesson.availability_days,
          ),
        );

        if (new Date() < availabilityDate)
          throw new ClientException('Aula não disponível.');
      }
    }

    const rating = await this.lessonRatingsRepository.findBy({
      where: {
        user_id,
        lesson_id,
      },
      select: ['id', 'rating'],
    });

    const watched = purchase.watched_lessons.find(
      (watchedLesson) => watchedLesson.lesson_id === lesson.id,
    );

    const lessonReturn = {
      ...lesson,
      watched: watched ? watched.lesson_completed : false,
      draft: undefined,
      user_rating: rating ? rating.rating : 0,
    };

    return lessonReturn;
  }
}
