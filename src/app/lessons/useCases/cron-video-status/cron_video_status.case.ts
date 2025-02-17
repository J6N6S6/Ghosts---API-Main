import { ProductLesson } from '@/domain/models/product_lesson.model';
import { ProductsLessonsRepository } from '@/domain/repositories';
import { VimeoService } from '@/infra/apps/vimeo/services/vimeo.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CronVideoStatusCase {
  constructor(
    private readonly productsLessonsRepository: ProductsLessonsRepository,
    private readonly vimeoService: VimeoService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute() {
    // 1. Buscar todas as aulas que estão com status 'processing'
    // 2. Para cada aula, verificar o status do vídeo no serviço de vídeo
    // 3. Caso aula esteja aprovada, buscar dados de duracao e thumbnail
    // 4. Atualizar o status da aula no banco de dados
    // 5. Notificar o dono da aula sobre a mudança de status

    const lessons = await this.productsLessonsRepository.findAll({
      where: {
        video_status: 'IN_PROGRESS',
        video_internal: true,
      },
      select: {
        id: true,
        title: true,
        video_url: true,
        product: {
          id: true,
          owner_id: true,
        },
      },
      relations: ['product'],
    });

    for (const lesson of lessons) {
      // 2. Para cada aula, verificar o status do vídeo no serviço de vídeo
      const { transcode } = (await this.vimeoService.getVideoUploadProgress(
        lesson.video_url,
      )) as {
        transcode: {
          status: string;
        };
      };

      if (!transcode) {
        continue;
      }

      // 3. Caso aula esteja aprovada, buscar dados de duracao e thumbnail
      if (transcode.status === 'complete') {
        const lessonModel = new ProductLesson(lesson);

        try {
          lessonModel.duration =
            (await this.vimeoService.getVideoDuration(lesson.video_url)) | 0;
        } catch (e) {}

        if (
          !lessonModel.thumbnail ||
          !lessonModel.thumbnail.includes('sunize')
        ) {
          try {
            lessonModel.thumbnail = await this.vimeoService.getThumbnail(
              lesson.video_url,
            );
          } catch (e) {}
        }
        lesson.video_status = 'SUCCESS';

        await this.productsLessonsRepository.update(lessonModel);

        // 5. Notificar o dono da aula sobre a mudança de status

        this.eventEmitter.emit('notification.send', {
          user_id: lesson.product.owner_id,
          body: `A aula **${lesson.title}** já está disponível para visualização`,
          icon: 'success',
        });
      }
    }
  }
}
