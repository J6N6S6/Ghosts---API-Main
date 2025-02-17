import { LessonRatings } from '@/infra/database/entities/lesson_ratings.entity';
import { FindManyOptions, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { LessonRating } from '../models/lesson_rating.model';

export abstract class LessonRatingsRepository {
  abstract findById(id: string): Promise<LessonRatings>;
  abstract findBy(
    options: FindOneOptions<LessonRatings>,
  ): Promise<LessonRatings>;
  abstract find(
    options: FindManyOptions<LessonRatings>,
  ): Promise<LessonRatings[]>;
  abstract create(data: LessonRating): Promise<LessonRatings>;
  abstract update(data: LessonRating): Promise<void>;
  abstract delete(data: LessonRating): Promise<void>;
  abstract query(): SelectQueryBuilder<LessonRatings>;
}
