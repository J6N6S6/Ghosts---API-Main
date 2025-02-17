import { UserOldPassword } from '@/domain/models/user_old_password.model';
import { UserOldPasswordsRepository } from '@/domain/repositories';
import { UserOldPasswords } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class TypeormUserOldPasswordsRepository
  implements UserOldPasswordsRepository
{
  constructor(
    @InjectRepository(UserOldPasswords)
    private readonly usersOldPasswordsRepository: Repository<UserOldPasswords>,
  ) {}

  create(user: UserOldPassword): Promise<UserOldPasswords> {
    return this.usersOldPasswordsRepository.save({
      id: user.id,
      ...user.allProps,
    });
  }

  async update(user: UserOldPassword): Promise<void> {
    await this.usersOldPasswordsRepository.update(
      { id: user.id },
      user.allProps,
    );
  }

  findByUserId(user_id: string): Promise<UserOldPasswords[]> {
    return this.usersOldPasswordsRepository.findBy({ user_id });
  }

  find(data: FindManyOptions<UserOldPasswords>): Promise<UserOldPasswords[]> {
    return this.usersOldPasswordsRepository.find(data);
  }

  findBy(data: FindOneOptions<UserOldPasswords>): Promise<UserOldPasswords> {
    return this.usersOldPasswordsRepository.findOne(data);
  }

  async delete(where: FindOptionsWhere<UserOldPasswords>): Promise<void> {
    await this.usersOldPasswordsRepository.delete(where);
  }
}
