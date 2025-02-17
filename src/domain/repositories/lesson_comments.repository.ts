import { LessonComments } from '@/infra/database/entities';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { LessonComment } from '../models/lesson_comment.model';

export abstract class LessonCommentsRepository {
  abstract create(data: LessonComment): Promise<LessonComments>;
  abstract update(data: LessonComment): Promise<void>;
  abstract findById(comment_id: string): Promise<LessonComments>;
  abstract findOne(
    where: FindOneOptions<LessonComments>,
  ): Promise<LessonComments>;
  abstract find(
    options: FindManyOptions<LessonComments>,
  ): Promise<LessonComments[]>;
  abstract deleteById(comment_id: string): Promise<void>;
}
