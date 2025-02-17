import { ProductLesson } from '@/domain/models/product_lesson.model';
import { ProductsLessonsRepository } from '@/domain/repositories';
import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { UpdateAllLessonsPositionDTO } from './update-all-lessons-position.dto';

@Injectable()
export class UpdateAllLessonsPositionCase {
  constructor(
    private readonly productsLessonsRepository: ProductsLessonsRepository,
  ) {}

  async execute({
    owner_id,
    lessons,
  }: UpdateAllLessonsPositionDTO): Promise<void> {
    const lessonsToUpdate = await this.productsLessonsRepository.findAll({
      where: {
        id: In(lessons.map((lesson) => lesson.lesson_id)),
        product: {
          owner_id,
        },
      },
      order: {
        position: 'ASC',
      },
      select: ['id', 'position'],
    });

    await Promise.all(
      lessonsToUpdate.map(async (lesson) => {
        const lessonSchema = new ProductLesson(lesson);

        lessonSchema.position = lessons.find(
          (lessonToUpdate) => lessonToUpdate.lesson_id === lesson.id,
        ).position;

        return await this.productsLessonsRepository.update(lessonSchema);
      }),
    );
  }
}
