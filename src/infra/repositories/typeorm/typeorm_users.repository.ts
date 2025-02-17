import { User } from '@/domain/models/users.model';
import { UsersRepository } from '@/domain/repositories/users.repository';
import { Users } from '@/infra/database/entities/users.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  create(user: User): Promise<Users> {
    return this.usersRepository.save({
      id: user.id,
      ...user.allProps,
      preferences: {},
    });
  }

  async update(user: User): Promise<void> {
    await this.usersRepository.update({ id: user.id }, user.allProps);
  }

  findAll(options: FindManyOptions<Users>): Promise<Users[]> {
    return this.usersRepository.find(options);
  }

  findById(id: string): Promise<Users> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOneBy({ email });
  }

  findByAuthId(auth_id: string): Promise<Users> {
    return this.usersRepository
      .createQueryBuilder('users')
      .where(':auth_id = ANY(users.auth_providers)', { auth_id })
      .getOne();
  }

  findByEmailOrIdentity(email: string, identity: string): Promise<Users> {
    return this.usersRepository.findOne({
      where: [
        { email },
        {
          cpf: identity,
        },
        {
          cnpj: identity,
        },
        {
          rg: identity,
        },
      ],
    });
  }

  findByHashLink(hash_link: string): Promise<Users> {
    return this.usersRepository.findOneBy({ hash_link });
  }

  findAllByInvitedBy(indicated_by: string): Promise<
    {
      id?: string;
      name?: string;
      email?: string;
      createdAt?: Date;
    }[]
  > {
    return this.usersRepository.find({
      where: { indicated_by },
      select: ['id', 'name', 'email', 'createdAt'],
    });
  }

  async findAllByIndicatedBy(
    indicated_by: string,
    page?: number,
    limit?: number,
  ): Promise<{
    data: Users[];
    count: number;
  }> {
    const users = await Promise.all([
      this.usersRepository.find({
        where: { indicated_by },
        skip: page ? (page - 1) * limit : 0,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      this.usersRepository.count({ where: { indicated_by } }),
    ]);

    return {
      data: users[0],
      count: users[1],
    };
  }

  find(data: FindManyOptions<Users>): Promise<Users[]> {
    return this.usersRepository.find(data);
  }

  findBy(data: FindOneOptions<Users>): Promise<Users> {
    return this.usersRepository.findOne(data);
  }

  count(data: FindManyOptions<Users>): Promise<number> {
    return this.usersRepository.count(data);
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.usersRepository.delete({ email, email_validated: false });
  }

  // Novo método para buscar e contar usuários simultaneamente
  findAndCount(options: FindManyOptions<Users>): Promise<[Users[], number]> {
    return this.usersRepository.findAndCount(options);
  }
}
