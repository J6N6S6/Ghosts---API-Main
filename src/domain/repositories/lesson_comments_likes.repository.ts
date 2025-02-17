import { LessonCommentsLikes } from '@/infra/database/entities';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { LessonCommentLike } from '../models/lesson_comment_like.model';

export abstract class LessonCommentsLikesRepository {
  abstract create(data: LessonCommentLike): Promise<void>;
  abstract findOne(
    where: FindOneOptions<LessonCommentsLikes>,
  ): Promise<LessonCommentsLikes>;
  abstract find(
    options: FindManyOptions<LessonCommentsLikes>,
  ): Promise<LessonCommentsLikes[]>;
  abstract deleteById(data: {
    comment_id: string;
    user_id: string;
  }): Promise<void>;
  abstract countLikesByCommentId(comment_id: string): Promise<{
    liked: number;
    unliked: number;
  }>;
}
