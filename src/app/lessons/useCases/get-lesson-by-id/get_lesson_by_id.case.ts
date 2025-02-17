import {
  ProductsLessonsRepository,
  ProductsMaterialsRepository,
  ProductsRepository,
} from '@/domain/repositories';
import { ProductsLessons } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { GetLessonByIdDTO } from './get_lesson_by_id.dto';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class GetLessonByIdCase {
  constructor(
    private readonly productsLessonsRepository: ProductsLessonsRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly productsMaterialsRepository: ProductsMaterialsRepository,
  ) {}

  async execute({
    owner_id,
    lesson_id,
    product_id,
  }: GetLessonByIdDTO): Promise<ProductsLessons | any> {
    const product = await this.productsRepository.findOne({
      where: [
        {
          id: product_id,
          owner_id,
        },
        {
          id: product_id,
          coproducers: {
            user_id: owner_id,
          },
        },
      ],
    });

    if (!product) throw new ClientException('Produto não encontrado');

    const lesson = await this.productsLessonsRepository.findBy({
      where: {
        id: lesson_id,
        product_id,
      },
      select: {
        materials: true,
      },
      relations: ['materials'],
    });

    // const materials = this.productsMaterialsRepository.findBy({
    //   where: {
    //     lesson_id: lesson_id,
    //   },
    // });

    if (!lesson) throw new ClientException('Aula não encontrada');

    return lesson;
  }
}
