import { ProductLesson } from '@/domain/models/product_lesson.model';
import { ProductMaterial } from '@/domain/models/product_material.model';
import {
  ProductsLessonsRepository,
  ProductsMaterialsRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { EditLessonDTO } from './edit_lesson.dto';

@Injectable()
export class EditLessonCase {
  constructor(
    private readonly productsMaterialsRepository: ProductsMaterialsRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
    private readonly uploadService: FileUploadService,
  ) {}

  async execute(data: EditLessonDTO): Promise<void> {
    const lesson = await this.productsLessonsRepository.findBy({
      where: {
        id: data.lesson_id,
        product: {
          id: data.product_id,
          owner_id: data.owner_id,
        },
      },
      relations: ['materials'],
    });

    if (!lesson) throw new ClientException('Aula não encontrada');

    const lessonUpdate = new ProductLesson({
      ...lesson,
      ...{
        ...data,
        owner_id: undefined,
        lesson_id: undefined,
        product_id: undefined,
        materials: undefined,
        thumbnail: undefined,
        background: undefined,
        delete_materials: undefined,
      },
    });

    if (data.thumbnail) {
      if (lessonUpdate.thumbnail) {
        await this.uploadService.deleteFile(lessonUpdate.thumbnail);
      }

      const thumbnail = await this.uploadService.uploadFile({
        buffer: data.thumbnail,
        location: ['products', data.product_id, 'lessons'],
      });
      lessonUpdate.thumbnail = thumbnail.url;
    }

    if (data.background) {
      if (lessonUpdate.background) {
        await this.uploadService.deleteFile(lessonUpdate.background);
      }

      const background = await this.uploadService.uploadFile({
        buffer: data.thumbnail,
        location: ['products', data.product_id, 'lessons'],
      });
      lessonUpdate.background = background.url;
    }

    if (data.materials) {
      // if (lesson.materials.length > 0) {
      //   await Promise.all(
      //     lesson.materials.map(async (material) => {
      //       if (material.type === 'file') {
      //         await this.uploadService.deleteFile(material.content);
      //         await this.productsMaterialsRepository.delete(material.id);
      //       }
      //     }),
      //   );
      // }

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
                data.lesson_id,
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
            file_details: material.file_details,
            lesson_id: data.lesson_id,
            product_id: data.product_id,
            title: material.title,
            type: material.type,
          });

          await this.productsMaterialsRepository.create(materialQ);
        }),
      );
    }

    if (data.delete_materials) {
      await Promise.all(
        data.delete_materials.map(async (material_id) => {
          const material = await this.productsMaterialsRepository.findById(
            material_id,
          );

          if (material.type === 'file') {
            await this.uploadService.deleteFile(material.content);
          }

          await this.productsMaterialsRepository.delete(material_id);
        }),
      );
    }

    return await this.productsLessonsRepository.update(lessonUpdate);
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
