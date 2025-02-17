import { User } from '@/domain/models/users.model';
import { Users } from '@/infra/database/entities/users.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class UsersRepository {
  abstract create(user: User): Promise<Users>;
  abstract update(user: User): Promise<void>;

  abstract findAll(options: FindManyOptions<Users>): Promise<Users[]>;
  abstract findById(id: string): Promise<Users>;
  abstract findByAuthId(auth_id: string): Promise<Users>;
  abstract findByEmail(email: string): Promise<Users>;

  abstract findByEmailOrIdentity(
    email: string,
    identity: string,
  ): Promise<Users>;
  abstract findByHashLink(hash_link: string): Promise<Users>;
  abstract findAllByInvitedBy(invited_by: string): Promise<
    {
      id?: string;
      name?: string;
      email?: string;
      createdAt?: Date;
    }[]
  >;
  abstract findAllByIndicatedBy(
    indicated_by: string,
    page?: number,
    limit?: number,
  ): Promise<{
    data: Users[];
    count: number;
  }>;

  abstract find(data: FindManyOptions<Users>): Promise<Users[]>;
  abstract findBy(options: FindOneOptions<Users>): Promise<Users>;
  abstract count(data: FindManyOptions<Users>): Promise<number>;

  abstract deleteByEmail(email: string): Promise<void>;

  // Novo método para buscar e contar usuários simultaneamente
  abstract findAndCount(
    options: FindManyOptions<Users>,
  ): Promise<[Users[], number]>;
}
