import {
  ProductsLessonsRepository,
  PurchasesRepository,
} from '@/domain/repositories';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { Pagination } from '@/infra/utils/typeorm_pagination';
import { Injectable } from '@nestjs/common';
import { ListProductStudentsDTO } from './list_product_students.dto';
import { ILike } from 'typeorm';

@Injectable()
export class ListProductStudentsCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
  ) {}

  async execute({
    product_id,
    user_id,
    search,
    page = 1,
    limit = 10,
  }: ListProductStudentsDTO) {
    const product = await this.productsRepository.findOne({
      where: [
        {
          id: product_id,
          owner_id: user_id,
        },
        {
          id: product_id,
          coproducers: { user_id },
        },
      ],
    });

    if (!product) throw new ClientException('Produto não encontrado');

    const lessons = await this.productsLessonsRepository.findAll({
      where: {
        product_id,
        draft: false,
      },
      select: ['id'],
    });

    const students = await this.purchasesRepository.find({
      where: search
        ? {
            product_id,
            user: [
              {
                name: ILike(`%${search}%`),
              },
              {
                email: ILike(`%${search}%`),
              },
              {
                phone: ILike(`%${search}%`),
              },
            ],
          }
        : {
            product_id,
          },
      relations: ['user'],
      select: {
        id: true,
        user: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
        blocked_comments: true,
        watched_lessons: true,
      },
      ...Pagination(page, limit),
    });

    const totalStudents = await this.purchasesRepository.count({
      where: {
        product_id,
      },
    });

    const studentsFormatted = students.map((student) => {
      const lessonsWatched = lessons.filter((lesson) => {
        return student.watched_lessons.some((watchedLesson) => {
          return (
            watchedLesson.lesson_id === lesson.id &&
            watchedLesson.lesson_completed
          );
        });
      }).length;
      const progress = ((lessonsWatched / lessons.length) * 100).toFixed(2);

      return {
        id: student.id,
        user: {
          id: student.user.id,
          name: student.user.name,
          email: student.user.email,
          phone: student.user.phone,
        },
        progress: Number(progress),
        blocked_comments: student.blocked_comments,
      };
    });

    return {
      students: studentsFormatted,
      total_items: totalStudents,
      total_pages: Math.ceil(totalStudents / limit),
      current_page: page,
    };
  }
}
