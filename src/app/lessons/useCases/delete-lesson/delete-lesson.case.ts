import {
  ProductsLessonsRepository,
  ProductsMaterialsRepository,
} from '@/domain/repositories';
import { VimeoService } from '@/infra/apps/vimeo/services/vimeo.service';
import { ClientException } from '@/infra/exception/client.exception';
import { FileUploadService } from '@/infra/services/uploadFiles.service';
import { Injectable } from '@nestjs/common';
import { DeleteLessonDTO } from './delete_lesson.dto';

@Injectable()
export class DeleteLessonCase {
  constructor(
    private readonly productsLessonsRepository: ProductsLessonsRepository,
    private readonly productsMaterialsRepository: ProductsMaterialsRepository,
    private readonly uploadService: FileUploadService,
    private readonly vimeoService: VimeoService,
  ) {}

  async execute(data: DeleteLessonDTO): Promise<void> {
    const lesson = await this.productsLessonsRepository.findBy({
      where: {
        id: data.lesson_id,
        product: {
          owner_id: data.owner_id,
        },
      },
    });

    if (!lesson) throw new ClientException('Aula não encontrada');

    if (lesson.thumbnail) {
      await this.uploadService.deleteFile(lesson.thumbnail);
    }

    const materials = await this.productsMaterialsRepository.findAll({
      where: {
        lesson_id: data.lesson_id,
      },
    });

    if (materials.length > 0) {
      await Promise.all(
        materials.map(async (material) => {
          if (material.type === 'file') {
            await this.uploadService.deleteFile(material.content);
            await this.productsMaterialsRepository.delete(material.id);
          }
        }),
      );
    }

    if (lesson.video_url && lesson.video_internal) {
      try {
        await this.vimeoService.deleteVideo(lesson.video_url);
      } catch (e) {}
    }

    await this.productsLessonsRepository.delete(data.lesson_id);
  }
}
