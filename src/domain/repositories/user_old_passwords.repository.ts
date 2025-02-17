import { UserOldPasswords } from '@/infra/database/entities';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { UserOldPassword } from '../models/user_old_password.model';

export abstract class UserOldPasswordsRepository {
  abstract create(user: UserOldPassword): Promise<UserOldPasswords>;
  abstract update(user: UserOldPassword): Promise<void>;
  abstract findByUserId(user_id: string): Promise<UserOldPasswords[]>;
  abstract delete(where: FindOptionsWhere<UserOldPasswords>): Promise<void>;

  abstract find(
    data: FindManyOptions<UserOldPasswords>,
  ): Promise<UserOldPasswords[]>;
  abstract findBy(
    options: FindOneOptions<UserOldPasswords>,
  ): Promise<UserOldPasswords>;
}
