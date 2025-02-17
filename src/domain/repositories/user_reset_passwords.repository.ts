import { UserResetPasswords } from '@/infra/database/entities';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { UserResetPassword } from '../models/user_reset_password.model';

export abstract class UserResetPasswordsRepository {
  abstract create(user: UserResetPassword): Promise<UserResetPasswords>;
  abstract update(user: UserResetPassword): Promise<void>;
  abstract findByUserId(user_id: string): Promise<UserResetPasswords[]>;
  abstract findById(id: string): Promise<UserResetPasswords>;

  abstract find(
    data: FindManyOptions<UserResetPasswords>,
  ): Promise<UserResetPasswords[]>;
  abstract findBy(
    options: FindOneOptions<UserResetPasswords>,
  ): Promise<UserResetPasswords>;
}
