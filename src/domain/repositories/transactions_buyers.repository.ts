import { TransactionBuyer } from '@/domain/models/transaction_buyer.model';
import { TransactionsBuyers } from '@/infra/database/entities/transactions_buyers.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class TransactionsBuyersRepository {
  abstract create(data: TransactionBuyer): Promise<TransactionsBuyers>;
  abstract update(data: TransactionBuyer): Promise<void>;
  abstract findById(id: string): Promise<TransactionsBuyers>;
  abstract findByVisitorId(visitor_id: string): Promise<TransactionsBuyers>;
  abstract findBy(
    where?: FindOneOptions<TransactionsBuyers>,
  ): Promise<TransactionsBuyers>;
  abstract findAll(
    options?: FindManyOptions<TransactionsBuyers>,
  ): Promise<TransactionsBuyers[]>;
}
