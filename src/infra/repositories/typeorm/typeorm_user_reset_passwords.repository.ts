import { UserResetPassword } from '@/domain/models/user_reset_password.model';
import { UserResetPasswordsRepository } from '@/domain/repositories';
import { UserResetPasswords } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormUserResetPasswordsRepository
  implements UserResetPasswordsRepository
{
  constructor(
    @InjectRepository(UserResetPasswords)
    private readonly usersResetPasswordsRepository: Repository<UserResetPasswords>,
  ) {}

  create(user: UserResetPassword): Promise<UserResetPasswords> {
    return this.usersResetPasswordsRepository.save({
      id: user.id,
      ...user.allProps,
    });
  }

  async update(user: UserResetPassword): Promise<void> {
    await this.usersResetPasswordsRepository.update(
      { id: user.id },
      user.allProps,
    );
  }

  findById(id: string): Promise<UserResetPasswords> {
    return this.usersResetPasswordsRepository.findOneBy({ id });
  }

  findByUserId(user_id: string): Promise<UserResetPasswords[]> {
    return this.usersResetPasswordsRepository.findBy({ user_id });
  }

  find(
    data: FindManyOptions<UserResetPasswords>,
  ): Promise<UserResetPasswords[]> {
    return this.usersResetPasswordsRepository.find(data);
  }

  findBy(
    data: FindOneOptions<UserResetPasswords>,
  ): Promise<UserResetPasswords> {
    return this.usersResetPasswordsRepository.findOne(data);
  }
}
