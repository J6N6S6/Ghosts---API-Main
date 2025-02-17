import { Purchase } from '@/domain/models/purchases.model';
import {
  ProductsLessonsRepository,
  ProductsRepository,
  PurchasesRepository,
} from '@/domain/repositories';
import { ClientException } from '@/infra/exception/client.exception';
import { Injectable } from '@nestjs/common';
import { BlockUserCommentDto } from './block_user_comment.dto';

@Injectable()
export class BlockUserCommentCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
  ) {}

  async execute({
    user_id,
    block_user_id,
    lesson_id,
    action,
  }: BlockUserCommentDto): Promise<any> {
    const lesson = await this.productsLessonsRepository.findById(lesson_id);

    if (!lesson) throw new ClientException('Aula não encontrada');

    const product = await this.productsRepository.findOne({
      where: [
        { id: lesson.product_id, owner_id: user_id },
        {
          id: lesson.product_id,
          coproducers: {
            user_id,
          },
        },
      ],
      relations: ['coproducers'],
    });

    if (!product)
      throw new ClientException(
        'Você não tem permissão para bloquear um usuário deste produto',
      );

    const blocked_user =
      await this.purchasesRepository.findByUserIdAndProductId(
        block_user_id,
        lesson.product_id,
      );

    if (!blocked_user)
      throw new ClientException('Usuário não comprou este produto');

    const blockedUserModel = new Purchase({
      ...blocked_user,
      blocked_comments: action,
    });

    await this.purchasesRepository.update(blockedUserModel);
  }
}
