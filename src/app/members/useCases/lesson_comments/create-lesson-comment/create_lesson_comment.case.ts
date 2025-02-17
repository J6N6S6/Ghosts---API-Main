import { LessonComment } from '@/domain/models/lesson_comment.model';
import {
  LessonCommentsRepository,
  ProductsLessonsRepository,
  PurchasesRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { CreateLessonCommentDto } from './create_lesson_comment.dto';

@Injectable()
export class CreateLessonCommentCase {
  constructor(
    private readonly lessonCommentsRepository: LessonCommentsRepository,
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
  ) {}

  async execute({
    content,
    lesson_id,
    user_id,
    parent_id,
  }: CreateLessonCommentDto): Promise<any> {
    const lesson = await this.productsLessonsRepository.findById(lesson_id);

    if (!lesson) throw new ClientException('Aula não encontrada');

    const purchase = await this.purchasesRepository.findByUserIdAndProductId(
      user_id,
      lesson.product_id,
    );

    if (!purchase) throw new ClientException('Você não comprou este produto');
    if (purchase.blocked_comments)
      throw new ClientException(
        'Você foi bloqueado de comentar, se precisar de ajuda, entre em contato com o suporte!',
      );

    if (parent_id) {
      const parentComment = await this.lessonCommentsRepository.findById(
        parent_id,
      );
      if (!parentComment)
        throw new ClientException('Você não pode responder este comentário');
      // caso o comentario mae ja tiver um comentario mae, nao pode ser respondido
      if (parentComment.parent_id)
        throw new ClientException('Comentário não pode ser respondido');
    }

    const comment = new LessonComment({
      content,
      lesson_id,
      user_id,
      parent_id,
      createdAt: new Date(),
    });

    await this.lessonCommentsRepository.create(comment);
  }
}
