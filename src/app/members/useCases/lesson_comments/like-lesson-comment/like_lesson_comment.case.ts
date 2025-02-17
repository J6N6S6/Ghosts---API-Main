import { LessonComment } from '@/domain/models/lesson_comment.model';
import { LessonCommentLike } from '@/domain/models/lesson_comment_like.model';
import {
  LessonCommentsLikesRepository,
  LessonCommentsRepository,
  ProductsLessonsRepository,
  PurchasesRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { likeLessonCommentDto } from './like_lesson_comment.dto';

@Injectable()
export class LikeLessonCommentCase {
  constructor(
    private readonly lessonCommentsRepository: LessonCommentsRepository,
    private readonly lessonCommentsLikeRepository: LessonCommentsLikesRepository,
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
  ) {}

  async execute({
    user_id,
    lesson_id,
    comment_id,
    like,
  }: likeLessonCommentDto): Promise<any> {
    const lesson = await this.productsLessonsRepository.findById(lesson_id);

    if (!lesson) throw new ClientException('Aula não encontrada');

    const purchase = await this.purchasesRepository.findByUserIdAndProductId(
      user_id,
      lesson.product_id,
    );

    if (!purchase) throw new ClientException('Você não comprou este produto');

    const comment = await this.lessonCommentsRepository.findById(comment_id);

    if (!comment) throw new ClientException('Comentário não encontrado');

    const lessonModel = new LessonComment(comment);

    const lessonCommentLike = await this.lessonCommentsLikeRepository.findOne({
      where: {
        user_id,
        comment_id,
      },
    });

    if (lessonCommentLike) {
      lessonModel[
        lessonCommentLike.like === 1 ? 'likes_count' : 'dislikes_count'
      ] -= 1;

      await this.lessonCommentsLikeRepository.deleteById({
        user_id,
        comment_id,
      });
    }

    if (like != null) {
      await this.lessonCommentsLikeRepository.create(
        new LessonCommentLike({
          user_id,
          comment_id,
          like: like ? 1 : 0,
        }),
      );

      lessonModel[like ? 'likes_count' : 'dislikes_count'] += 1;
    }

    await this.lessonCommentsRepository.update(lessonModel);
  }
}
