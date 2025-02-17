import { Transaction } from '@/domain/models/transaction.model';
import { Transactions } from '@/infra/database/entities/transactions.entity';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  SelectQueryBuilder,
} from 'typeorm';

export abstract class TransactionsRepository {
  abstract create(data: Transaction): Promise<Transactions>;
  abstract update(data: Transaction): Promise<void>;
  abstract findBy(
    where?: FindOptionsWhere<Transactions>,
  ): Promise<Transactions>;
  abstract findById(id: string): Promise<Transactions>;
  abstract find(options?: FindOneOptions<Transactions>): Promise<Transactions>;
  abstract findAll(
    options?: FindManyOptions<Transactions>,
  ): Promise<Transactions[]>;
  abstract count(options?: FindManyOptions<Transactions>): Promise<number>;
  abstract query(sql: string, data?: any): Promise<Transactions[]>;
  abstract queryBuilder(): SelectQueryBuilder<Transactions>;
  abstract getTotalTransactionAmount(
    where?: FindOptionsWhere<Transactions>,
  ): Promise<number>;
}
