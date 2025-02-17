import { ProductsLessonsRepository } from '@/domain/repositories';
import { VimeoService } from '@/infra/apps/vimeo/services/vimeo.service';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { GetVideoUploadProgressDTO } from './get_video_upload_progress.dto';
import { ProductLesson } from '@/domain/models/product_lesson.model';

@Injectable()
export class GetVideoUploadProgressCase {
  constructor(
    private readonly productsLessonsRepository: ProductsLessonsRepository,
    private readonly vimeoService: VimeoService,
  ) {}

  async execute({ product_id, lesson_id, user_id }: GetVideoUploadProgressDTO) {
    const lesson = await this.productsLessonsRepository.findBy({
      where: {
        id: lesson_id,
        product: {
          id: product_id,
          owner_id: user_id,
        },
      },
    });

    if (!lesson) throw new ClientException('Aula não encontrada');

    // 'PENDING', 'IN_PROGRESS', 'SUCCESS', 'FAILED'
    if (lesson.video_url && lesson.video_internal) {
      const { transcode } = (await this.vimeoService.getVideoUploadProgress(
        lesson.video_url,
      )) as {
        transcode: {
          status: string;
        };
      };

      if (!transcode) {
        return {
          status: 'ERROR',
        };
      }

      if (transcode.status === 'complete') {
        const lessonModel = new ProductLesson(lesson);

        lessonModel.duration =
          (await this.vimeoService.getVideoDuration(lesson.video_url)) | 0;

        await this.productsLessonsRepository.update(lessonModel);
      }

      return {
        status: transcode.status === 'complete' ? 'SUCCESS' : 'IN_PROGRESS',
      };
    }

    return {
      status: 'SUCCESS',
    };
  }
}
