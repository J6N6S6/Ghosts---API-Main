import { UsersActivity } from '@/infra/database/entities';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { UserActivity } from '../models/user_activity.model';

export abstract class UserActivityRepository {
  abstract create(user: UserActivity): Promise<UsersActivity>;

  abstract find(data: FindManyOptions<UsersActivity>): Promise<UsersActivity[]>;
  abstract findBy(
    options: FindOneOptions<UsersActivity>,
  ): Promise<UsersActivity>;
}
