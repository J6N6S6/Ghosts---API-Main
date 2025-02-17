import { LessonCommentLike } from '@/domain/models/lesson_comment_like.model';
import { LessonCommentsLikesRepository } from '@/domain/repositories';
import { LessonCommentsLikes } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormLessonCommentsLikesRepository
  implements LessonCommentsLikesRepository
{
  constructor(
    @InjectRepository(LessonCommentsLikes)
    private readonly lessonCommentsLikesRepository: Repository<LessonCommentsLikes>,
  ) {}

  async create(data: LessonCommentLike): Promise<void> {
    await this.lessonCommentsLikesRepository.save(data.allProps);
  }

  findOne(
    options: FindOneOptions<LessonCommentsLikes>,
  ): Promise<LessonCommentsLikes> {
    return this.lessonCommentsLikesRepository.findOne(options);
  }

  find(
    options: FindManyOptions<LessonCommentsLikes>,
  ): Promise<LessonCommentsLikes[]> {
    return this.lessonCommentsLikesRepository.find(options);
  }

  async deleteById({
    comment_id,
    user_id,
  }: {
    comment_id: string;
    user_id: string;
  }): Promise<void> {
    await this.lessonCommentsLikesRepository.delete({ comment_id, user_id });
  }

  countLikesByCommentId(
    comment_id: string,
  ): Promise<{ liked: number; unliked: number }> {
    return this.lessonCommentsLikesRepository
      .createQueryBuilder('lesson_comments_likes')
      .select('SUM(CASE WHEN like = 1 THEN 1 ELSE 0 END)', 'liked')
      .addSelect('SUM(CASE WHEN like = 0 THEN 1 ELSE 0 END)', 'unliked')
      .where('comment_id = :comment_id', { comment_id })
      .getRawOne();
  }
}
