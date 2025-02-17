import { UserActivity } from '@/domain/models/user_activity.model';
import { UserActivityRepository } from '@/domain/repositories';
import { UsersActivity } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormUserActivityRepository implements UserActivityRepository {
  constructor(
    @InjectRepository(UsersActivity)
    private readonly usersActivityRepository: Repository<UsersActivity>,
  ) {}

  create(user: UserActivity): Promise<UsersActivity> {
    return this.usersActivityRepository.save({
      id: user.id,
      ...user.allProps,
    });
  }

  find(data: FindManyOptions<UsersActivity>): Promise<UsersActivity[]> {
    return this.usersActivityRepository.find(data);
  }

  findBy(data: FindOneOptions<UsersActivity>): Promise<UsersActivity> {
    return this.usersActivityRepository.findOne(data);
  }
}
