import { ProductLesson } from '@/domain/models/product_lesson.model';
import { ProductsLessonsRepository } from '@/domain/repositories';
import { VimeoService } from '@/infra/apps/vimeo/services/vimeo.service';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { VideoService } from '../../services/video.service';
import { UpdateLessonVideoDTO } from './update_lesson_video.dto';

@Injectable()
export class UpdateLessonVideoCase {
  constructor(
    private readonly productsLessonsRepository: ProductsLessonsRepository,
    private readonly vimeoService: VimeoService,
    private readonly videoService: VideoService,
  ) {}

  async execute({
    product_id,
    lesson_id,
    user_id,
    video,
    video_type,
  }: UpdateLessonVideoDTO) {
    const lesson = await this.productsLessonsRepository.findBy({
      where: {
        id: lesson_id,
        product: {
          id: product_id,
          owner_id: user_id,
        },
      },
      relations: ['product'],
    });

    if (!lesson) throw new ClientException('Aula não encontrada');

    const lessonModel = new ProductLesson(lesson);

    if (lessonModel.video_url && lessonModel.video_internal) {
      try {
        await this.vimeoService.deleteVideo(lessonModel.video_url);
        lessonModel.video_url = null;
      } catch (e) {}
    }

    if (video_type === 'URL' && (typeof video === 'string' || video === null)) {
      lessonModel.video_url = video as string;
      lessonModel.video_internal = false;
      lessonModel.video_status = 'SUCCESS';

      try {
        lessonModel.duration = await this.videoService.getVideoDuration(
          video as string,
        );

        if (
          !lessonModel.thumbnail ||
          !lessonModel.thumbnail.includes('sunize')
        ) {
          const thumbnail = await this.videoService.getThumbnail(
            video as string,
          );
          lessonModel.thumbnail = thumbnail;
        }
      } catch (e) {}

      await this.productsLessonsRepository.update(lessonModel);
      return;
    }

    if (video_type === 'FILE' && video instanceof Object) {
      const upload = await this.vimeoService.createVideo({
        filename: lesson.title,
        video: {
          name: lesson.title,
          description: lesson.description,
        },
        filepath: video.path,
        lesson_id,
        product_id,
        user_id,
      });

      lessonModel.video_url = upload;
      lessonModel.video_internal = true;
      lessonModel.video_status = 'IN_PROGRESS';

      await this.productsLessonsRepository.update(lessonModel);
      return;
    }

    throw new ClientException('Tipo de vídeo inválido');
  }
}
