import { UserSession } from '@/domain/models/user_sessions.model';
import { UserSessionsRepository } from '@/domain/repositories';
import { UserSessions } from '@/infra/database/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class TypeormUserSessionsRepository implements UserSessionsRepository {
  constructor(
    @InjectRepository(UserSessions)
    private readonly usersSessionsRepository: Repository<UserSessions>,
  ) {}

  create(user: UserSession): Promise<UserSessions> {
    return this.usersSessionsRepository.save({
      id: user.id,
      ...user.allProps,
    });
  }

  async update(user: UserSession): Promise<void> {
    await this.usersSessionsRepository.update({ id: user.id }, user.allProps);
  }

  findById(id: string): Promise<UserSessions> {
    return this.usersSessionsRepository.findOneBy({ id });
  }

  findByUserId(user_id: string): Promise<UserSessions[]> {
    return this.usersSessionsRepository.findBy({ user_id });
  }

  find(data: FindManyOptions<UserSessions>): Promise<UserSessions[]> {
    return this.usersSessionsRepository.find(data);
  }

  findBy(data: FindOneOptions<UserSessions>): Promise<UserSessions> {
    return this.usersSessionsRepository.findOne(data);
  }

  async deleteById(id: string): Promise<void> {
    await this.usersSessionsRepository.delete({ id });
  }

  async deleteAllByUserId(
    user_id: string,
    criteria?: FindOptionsWhere<UserSessions>,
  ): Promise<void> {
    await this.usersSessionsRepository.delete({
      ...criteria,
      user_id,
    });
  }
}
