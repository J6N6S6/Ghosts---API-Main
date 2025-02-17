import {
  LessonCommentsRepository,
  ProductsLessonsRepository,
  ProductsRepository,
  PurchasesRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { DeleteLessonCommentDto } from './delete_lesson_comment.dto';

@Injectable()
export class DeleteLessonCommentCase {
  constructor(
    private readonly lessonCommentsRepository: LessonCommentsRepository,
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
  ) {}

  async execute({
    user_id,
    lesson_id,
    comment_id,
  }: DeleteLessonCommentDto): Promise<any> {
    let userIsProducer = false;

    const lesson = await this.productsLessonsRepository.findById(lesson_id);

    if (!lesson) throw new ClientException('Aula não encontrada');

    const purchase = await this.purchasesRepository.findByUserIdAndProductId(
      user_id,
      lesson.product_id,
    );

    if (!purchase) {
      const product = await this.productsRepository.findOne({
        where: [
          {
            id: lesson.product_id,
            owner_id: user_id,
          },
          {
            id: lesson.product_id,
            coproducers: {
              user_id,
            },
          },
        ],
        relations: ['coproducers'],
      });

      if (!product) throw new ClientException('Você não comprou este produto');
      userIsProducer = true;
    }

    if (purchase.blocked_comments)
      throw new ClientException(
        'Você foi bloqueado de comentar, se precisar de ajuda, entre em contato com o suporte!',
      );

    const comment = await this.lessonCommentsRepository.findById(comment_id);

    if (!comment) throw new ClientException('Comentário não encontrado');
    if (!userIsProducer && comment.user_id !== user_id)
      throw new ClientException('Você não pode excluir este comentário');

    await this.lessonCommentsRepository.deleteById(comment_id);
  }
}
