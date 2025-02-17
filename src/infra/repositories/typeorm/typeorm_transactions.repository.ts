import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { Transactions } from '@/infra/database/entities/transactions.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export class TypeormTransactionsRepository implements TransactionsRepository {
  constructor(
    @InjectRepository(Transactions)
    private readonly transactionsRepository: Repository<Transactions>,
  ) {}

  create(data: Transaction): Promise<Transactions> {
    return this.transactionsRepository.save(data.allProps);
  }

  async update(data: Transaction): Promise<void> {
    await this.transactionsRepository.update({ id: data.id }, data.allProps);

    return;
  }

  findBy(where?: FindOptionsWhere<Transactions>): Promise<Transactions> {
    return this.transactionsRepository.findOneBy(where);
  }

  findById(id: string): Promise<Transactions> {
    return this.transactionsRepository.findOneBy({ id });
  }

  findAll(options?: FindManyOptions<Transactions>): Promise<Transactions[]> {
    return this.transactionsRepository.find(options);
  }

  find(options?: FindOneOptions<Transactions>): Promise<Transactions> {
    return this.transactionsRepository.findOne(options);
  }

  count(options?: FindManyOptions<Transactions>): Promise<number> {
    return this.transactionsRepository.count(options);
  }

  query(sql: string, data: any): Promise<Transactions[]> {
    return this.transactionsRepository.query(sql, data);
  }

  queryBuilder(): SelectQueryBuilder<Transactions> {
    return this.transactionsRepository.createQueryBuilder('t');
  }

  async getTotalTransactionAmount(whereConditions: any): Promise<number> {
    const result = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.transaction_amount)', 'total')
      .where(whereConditions)
      .getRawOne();

    return result?.total || 0;
  }
}
