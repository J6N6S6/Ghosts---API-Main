import { Purchase } from '@/domain/models/purchases.model';
import { PurchasesRepository } from '@/domain/repositories/purchases.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { SaveUserLessonProgressDTO } from './save_user_lesson_progress.dto';
import { ProductsLessonsRepository } from '@/domain/repositories';

@Injectable()
export class SaveUserLessonProgressCase {
  constructor(
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
  ) {}

  async execute({
    lesson_completed,
    lesson_id,
    lesson_timestamp,
    user_id,
  }: SaveUserLessonProgressDTO) {
    const lesson = await this.productsLessonsRepository.findById(lesson_id);

    if (!lesson) {
      throw new ClientException('Aula não encontrada');
    }

    const purchase = await this.purchasesRepository.findByUserIdAndProductId(
      user_id,
      lesson.product_id,
    );

    if (!purchase) {
      throw new ClientException('Você não comprou este produto');
    }

    const purchaseModel = new Purchase(purchase);

    const watched_lessons = purchase.watched_lessons;

    const watchedLesson = watched_lessons.findIndex(
      (lesson) => lesson.lesson_id === lesson_id,
    );

    if (watchedLesson !== -1) {
      watched_lessons.splice(watchedLesson, 1);
    }

    watched_lessons.push({
      lesson_id,
      lesson_completed,
      lesson_timestamp,
    });

    purchaseModel.watched_lessons = watched_lessons;

    await this.purchasesRepository.update(purchaseModel);
  }
}
