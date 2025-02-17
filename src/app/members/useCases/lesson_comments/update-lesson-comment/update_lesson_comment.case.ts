import { LessonComment } from '@/domain/models/lesson_comment.model';
import {
  LessonCommentsRepository,
  ProductsLessonsRepository,
  PurchasesRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { UpdateLessonCommentDto } from './update_lesson_comment.dto';

@Injectable()
export class UpdateLessonCommentCase {
  constructor(
    private readonly lessonCommentsRepository: LessonCommentsRepository,
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
  ) {}

  async execute({
    content,
    user_id,
    lesson_id,
    comment_id,
  }: UpdateLessonCommentDto): Promise<any> {
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

    const comment = await this.lessonCommentsRepository.findById(comment_id);

    if (!comment) throw new ClientException('Comentário não encontrado');
    if (comment.user_id !== user_id)
      throw new ClientException('Você não pode editar este comentário');

    const lessonComment = new LessonComment({
      ...comment,
      content,
      updatedAt: new Date(),
    });

    await this.lessonCommentsRepository.update(lessonComment);
  }
}
