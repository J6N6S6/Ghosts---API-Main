import { Purchase } from '@/domain/models/purchases.model';
import { Purchases } from '@/infra/database/entities/purchases.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class PurchasesRepository {
  abstract create(data: Purchase): Promise<void>;
  abstract update(data: Purchase): Promise<void>;
  abstract findById(id: string): Promise<Purchases>;
  abstract findBy(options?: FindOneOptions<Purchases>): Promise<Purchases>;
  abstract findByUserIdAndProductId(
    user_id: string,
    product_id: string,
  ): Promise<Purchases>;
  abstract findAllByUserId(user_id: string): Promise<Purchases[]>;
  abstract findAllByTransactionId(transaction_id: string): Promise<Purchases[]>;
  abstract find(options?: FindManyOptions<Purchases>): Promise<Purchases[]>;
  abstract delete(id: string): Promise<void>;
  abstract count(options?: FindManyOptions<Purchases>): Promise<number>;
}
