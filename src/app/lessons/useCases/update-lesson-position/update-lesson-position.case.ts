import { ClientException } from '@/infra/exception/client.exception';
import { ProductLesson } from '@/domain/models/product_lesson.model';
import { ProductsLessonsRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';
import { UpdateLessonPositionDTO } from './update-lesson-position.dto';

@Injectable()
export class UpdateLessonPositionCase {
  constructor(
    private readonly productsLessonsRepository: ProductsLessonsRepository,
  ) {}

  async execute({
    lesson_id,
    owner_id,
    position,
  }: UpdateLessonPositionDTO): Promise<void> {
    const lesson = await this.productsLessonsRepository.findBy({
      where: {
        id: lesson_id,
        product: {
          owner_id: owner_id,
        },
      },
      select: ['id', 'position', 'module_id', 'product_id'],
    });

    if (!lesson) throw new ClientException('Aula não encontrada');

    const lessons = await this.productsLessonsRepository.findAll({
      where: {
        module_id: lesson.module_id,
        product_id: lesson.product_id,
      },
      order: {
        position: 'ASC',
      },
      select: ['id', 'position'],
    });

    const lessonSchema = new ProductLesson(lesson);

    lessonSchema.position = position;

    await this.productsLessonsRepository.update(lessonSchema);

    const lessonsToUpdate = lessons.filter(
      (lesson) => lesson.position >= position && lesson.id !== lesson_id,
    );

    await Promise.all(
      lessonsToUpdate.map(async (lesson) => {
        const lessonSchema = new ProductLesson(lesson);

        lessonSchema.position = lesson.position + 1;

        return await this.productsLessonsRepository.update(lessonSchema);
      }),
    );
  }
}
