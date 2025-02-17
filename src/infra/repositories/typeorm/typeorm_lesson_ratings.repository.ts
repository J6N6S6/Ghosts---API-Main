import { LessonRating } from '@/domain/models/lesson_rating.model';
import { LessonRatingsRepository } from '@/domain/repositories';
import { LessonRatings } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormLessonRatingsRepository implements LessonRatingsRepository {
  constructor(
    @InjectRepository(LessonRatings)
    private readonly lessonRatingsRepository: Repository<LessonRatings>,
  ) {}

  findById(id: string): Promise<LessonRatings> {
    return this.lessonRatingsRepository.findOne({ where: { id } });
  }

  findBy(options: FindOneOptions<LessonRatings>): Promise<LessonRatings> {
    return this.lessonRatingsRepository.findOne(options);
  }

  find(options: FindManyOptions<LessonRatings>): Promise<LessonRatings[]> {
    return this.lessonRatingsRepository.find(options);
  }

  create(data: LessonRating): Promise<LessonRatings> {
    return this.lessonRatingsRepository.save(data.allProps);
  }

  async update(data: LessonRating): Promise<void> {
    await this.lessonRatingsRepository.update(data.id, data.allProps);
  }

  async delete(data: LessonRating): Promise<void> {
    await this.lessonRatingsRepository.delete(data.id);
  }

  query() {
    return this.lessonRatingsRepository.createQueryBuilder('lr');
  }
}
