import { LessonComment } from '@/domain/models/lesson_comment.model';
import { LessonCommentsRepository } from '@/domain/repositories';
import { LessonComments } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormLessonCommentsRepository
  implements LessonCommentsRepository
{
  constructor(
    @InjectRepository(LessonComments)
    private readonly lessonCommentsRepository: Repository<LessonComments>,
  ) {}

  create(data: LessonComment): Promise<LessonComments> {
    return this.lessonCommentsRepository.save(data.allProps);
  }

  async update(data: LessonComment): Promise<void> {
    await this.lessonCommentsRepository.update(data.id, data.allProps);
  }

  findById(comment_id: string): Promise<LessonComments> {
    return this.lessonCommentsRepository.findOne({
      where: { id: comment_id },
    });
  }

  findOne(options: FindOneOptions<LessonComments>): Promise<LessonComments> {
    return this.lessonCommentsRepository.findOne(options);
  }

  find(options: FindManyOptions<LessonComments>): Promise<LessonComments[]> {
    return this.lessonCommentsRepository.find(options);
  }

  async deleteById(comment_id: string): Promise<void> {
    await this.lessonCommentsRepository.delete(comment_id);
  }
}
