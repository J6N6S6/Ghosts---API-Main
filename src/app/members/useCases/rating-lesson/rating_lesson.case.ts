import { LessonRating } from '@/domain/models/lesson_rating.model';
import {
  LessonRatingsRepository,
  ProductsLessonsRepository,
  PurchasesRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { RatingLessonDTO } from './rating_lesson.dto';

@Injectable()
export class RatingLessonCase {
  constructor(
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
    private readonly lessonRatingsRepository: LessonRatingsRepository,
  ) {}

  async execute({
    lesson_id,
    rating,
    user_id,
  }: RatingLessonDTO): Promise<void> {
    const lesson = await this.productsLessonsRepository.findById(lesson_id);

    if (!lesson) throw new ClientException('Aula não encontrada');

    const purchase = await this.purchasesRepository.findBy({
      where: {
        user_id,
        product_id: lesson.product_id,
      },
      select: ['id'],
    });

    if (!purchase)
      throw new ClientException('você não tem acesso a este produto.');

    const existsRating = await this.lessonRatingsRepository.findBy({
      where: {
        user_id,
        lesson_id,
      },
    });

    const ratingLesson = new LessonRating(
      existsRating
        ? { ...existsRating, rating }
        : {
            user_id,
            lesson_id,
            rating,
            product_id: lesson.product_id,
            createdAt: new Date(),
          },
    );

    if (existsRating) {
      if (rating === 0 || rating === ratingLesson.rating) {
        await this.lessonRatingsRepository.delete(ratingLesson);
        return;
      }
      await this.lessonRatingsRepository.update(ratingLesson);
      return;
    }

    await this.lessonRatingsRepository.create(ratingLesson);
  }
}
