import { UserSessions } from '@/infra/database/entities';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { UserSession } from '../models/user_sessions.model';

export abstract class UserSessionsRepository {
  abstract create(user: UserSession): Promise<UserSessions>;
  abstract update(user: UserSession): Promise<void>;
  abstract findByUserId(user_id: string): Promise<UserSessions[]>;
  abstract findById(id: string): Promise<UserSessions>;

  abstract find(data: FindManyOptions<UserSessions>): Promise<UserSessions[]>;
  abstract findBy(options: FindOneOptions<UserSessions>): Promise<UserSessions>;

  abstract deleteById(id: string): Promise<void>;
  abstract deleteAllByUserId(
    user_id: string,
    criteria?: FindOptionsWhere<UserSessions>,
  ): Promise<void>;
}
