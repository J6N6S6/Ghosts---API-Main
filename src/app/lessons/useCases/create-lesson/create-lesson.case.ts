import { ProductLesson } from '@/domain/models/product_lesson.model';
import { ProductMaterial } from '@/domain/models/product_material.model';
import {
  ProductsLessonsRepository,
  ProductsMaterialsRepository,
} from '@/domain/repositories';
import { ProductsRepository } from '@/domain/repositories/products.repository';
import { ProductsLessons } from '@/infra/database/entities';
import { ClientException } from '@/infra/exception/client.exception';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { calculateReadingTime } from '@/shared/utils/calculate_reading_time';
import { Injectable } from '@nestjs/common';
import { CreateLessonDTO } from './create_lesson.dto';

@Injectable()
export class CreateLessonCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
    private readonly productsMaterialsRepository: ProductsMaterialsRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute(data: CreateLessonDTO): Promise<ProductsLessons> {
    const product = await this.productsRepository.findById(data.product_id);

    if (!product) throw new ClientException('Produto não encontrado');
    if (product.owner_id !== data.owner_id)
      throw new ClientException(
        'Você não tem permissão para criar um módulo neste produto',
      );

    const lesson_position = await this.productsLessonsRepository.findBy({
      where: {
        product_id: data.product_id,
        module_id: data.module_id,
      },
      order: {
        position: 'DESC',
      },
      select: ['position'],
    });

    const lesson = new ProductLesson({
      ...data,
      position: lesson_position ? lesson_position.position + 1 : 1,
      materials: undefined,
      thumbnail: undefined,
      background: undefined,
      duration: calculateReadingTime(data.description),
    });

    if (data.thumbnail) {
      const thumbnail = await this.uploadService.uploadFile({
        buffer: data.thumbnail,
        location: ['products', data.product_id, 'lessons'],
      });
      lesson.thumbnail = thumbnail.url;
    }

    if (data.background) {
      const background = await this.uploadService.uploadFile({
        buffer: data.thumbnail,
        location: ['products', data.product_id, 'lessons'],
      });
      lesson.background = background.url;
    }

    const lessonCreated = await this.productsLessonsRepository.create(lesson);

    if (data.materials) {
      await Promise.all(
        data.materials.map(async (material) => {
          let material_content = material.content;

          if (material.type === 'file' && material.content instanceof Buffer) {
            const file = await this.uploadService.uploadFile({
              buffer: material.content,
              location: [
                'products',
                data.product_id,
                'lessons',
                lessonCreated.id,
              ],
              options: {
                ContentDisposition: `attachment; filename=${this.sanitizeFileName(
                  material?.file_details?.name,
                )}`,
              },
            });

            material_content = file.url;
          }

          const materialQ = new ProductMaterial({
            content: material_content as string,
            file_details: material.file_details ?? null,
            lesson_id: lessonCreated.id,
            product_id: data.product_id,
            title: material.title,
            type: material.type,
          });

          await this.productsMaterialsRepository.create(materialQ);
        }),
      );
    }

    return lessonCreated;
  }

  sanitizeFileName(fileName: string): string {
    // Substitui espaços por underscores
    let sanitized = fileName.replace(/\s+/g, '_');

    // Remove acentuações
    sanitized = sanitized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Remove caracteres não permitidos em nomes de arquivos
    sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '');

    return sanitized;
  }
}
