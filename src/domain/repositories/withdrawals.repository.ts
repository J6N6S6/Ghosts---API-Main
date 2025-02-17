import { Withdraw } from '@/domain/models/withdraw.model';
import { Withdrawals } from '@/infra/database/entities/withdrawals.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class WithdrawalsRepository {
  abstract create(data: Withdraw): Promise<void>;
  abstract update(data: Withdraw): Promise<void>;
  abstract findById(id: string): Promise<Withdrawals>;
  abstract findAllByUserId(user_id: string): Promise<Withdrawals[]>;
  abstract find(query: FindManyOptions<Withdrawals>): Promise<Withdrawals[]>;
  abstract count(query: FindManyOptions<Withdrawals>): Promise<number>;
  abstract findOne(query: FindOneOptions<Withdrawals>): Promise<Withdrawals>;
}
