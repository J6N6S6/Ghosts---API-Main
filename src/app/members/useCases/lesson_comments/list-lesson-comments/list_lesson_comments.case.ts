import {
  LessonCommentsLikesRepository,
  LessonCommentsRepository,
  ProductsLessonsRepository,
  ProductsRepository,
  PurchasesRepository,
} from '@/domain/repositories';
import { LessonComments } from '@/infra/database/entities';
import { ClientException } from '@/infra/exception/client.exception';
import { Pagination } from '@/infra/utils/typeorm_pagination';
import { Injectable } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { ListLessonCommentsDto } from './list_lesson_comments.dto';

@Injectable()
export class ListLessonCommentsCase {
  constructor(
    private readonly lessonCommentsRepository: LessonCommentsRepository,
    private readonly lessonCommentsLikesRepository: LessonCommentsLikesRepository,
    private readonly purchasesRepository: PurchasesRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly productsLessonsRepository: ProductsLessonsRepository,
  ) {}

  async execute({
    page = 1,
    limit = 10,
    lesson_id,
    user_id,
    parent_id,
    filter = 'newest',
  }: ListLessonCommentsDto): Promise<any> {
    const lesson = await this.productsLessonsRepository.findById(lesson_id);

    if (!lesson) throw new ClientException('Aula não encontrada');

    const purchase = await this.purchasesRepository.findByUserIdAndProductId(
      user_id,
      lesson.product_id,
    );

    if (!purchase) throw new ClientException('Você não comprou este produto');

    const product = await this.productsRepository.findOne({
      where: {
        id: lesson.product_id,
      },
      select: {
        id: true,
        producer_name: true,
        owner: {
          id: true,
          photo: true,
        },
        coproducers: {
          user_id: true,
        },
      },
      relations: ['owner', 'coproducers'],
    });

    if (!product) throw new ClientException('Produto não encontrado');

    const supportUsers = [
      {
        id: product.owner.id,
        name: product.producer_name,
        photo: product.owner.photo,
        type: 'producer',
      },
    ] as {
      id: string;
      name?: string;
      photo?: string;
      type: string;
    }[];

    if (product.coproducers.length) {
      product.coproducers.forEach((coproducer) => {
        supportUsers.push({
          id: coproducer.user_id,
          type: 'coproducer',
        });
      });
    }

    const comments = await this.returnUserData(
      await this.lessonCommentsRepository.find({
        where: {
          lesson_id,
          parent_id: parent_id ?? IsNull(),
        },
        order: {
          createdAt:
            filter === 'newest'
              ? 'DESC'
              : filter === 'older'
              ? 'ASC'
              : undefined,
          likes_count: filter === 'most_liked' ? 'DESC' : undefined,
          dislikes_count: filter === 'most_liked' ? 'ASC' : undefined,
        },
        relations: ['user'],
        select: {
          user: {
            id: true,
            name: true,
            photo: true,
          },
        },
        ...Pagination(page, limit),
      }),
      supportUsers,
      user_id,
    );

    const commentsRemodeled = await Promise.all(
      comments.map(async (comment) => {
        const children = await this.lessonCommentsRepository.find({
          where: {
            parent_id: comment.id,
          },
          order: {
            createdAt:
              filter === 'newest'
                ? 'DESC'
                : filter === 'older'
                ? 'ASC'
                : undefined,
            likes_count: filter === 'most_liked' ? 'DESC' : undefined,
            dislikes_count: filter === 'most_liked' ? 'ASC' : undefined,
          },
          relations: ['user'],
          ...Pagination(page, limit),
        });

        const childrenRemodeled = await this.returnUserData(
          children,
          supportUsers,
          user_id,
        );

        return {
          ...comment,
          comments: childrenRemodeled,
        };
      }),
    );
    return commentsRemodeled;
  }

  async returnUserData(
    comments: LessonComments[],
    supportUsers: {
      id: string;
      name?: string;
      photo?: string;
      type: string;
    }[],
    user_id: string,
  ) {
    const returnComments = Promise.all(
      comments.map(async (comment) => {
        const userIsProducer = supportUsers.find(
          (supportUser) => supportUser.id === comment.user_id,
        );

        const userHasLiked = await this.lessonCommentsLikesRepository.findOne({
          where: {
            comment_id: comment.id,
            user_id: user_id,
          },
          select: {
            id: true,
            like: true,
          },
        });

        return {
          ...comment,
          user: {
            id: comment.user.id,
            type: userIsProducer ? userIsProducer.type : 'user',
            photo: userIsProducer?.photo ?? comment.user.photo,
            name: userIsProducer?.name ?? comment.user.name,
          },
          user_has_liked: userHasLiked ? userHasLiked.like : null,
        };
      }),
    );

    return returnComments;
  }
}
