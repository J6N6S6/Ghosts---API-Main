import { UserBankingTransaction } from '@/domain/models/user_banking_transaction.model';
import { UserBankingTransactions } from '@/infra/database/entities/user_banking_transactions.entity';
import { FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class UserBankingTransactionsRepository {
  abstract create(
    data: UserBankingTransaction,
  ): Promise<UserBankingTransactions>;
  abstract update(data: UserBankingTransaction): Promise<void>;
  abstract findOne(
    options?: FindOneOptions<UserBankingTransactions>,
  ): Promise<UserBankingTransactions>;
  abstract findMany(
    options?: FindManyOptions<UserBankingTransactions>,
  ): Promise<UserBankingTransactions[]>;
  abstract findById(id: string): Promise<UserBankingTransactions>;
  abstract findAllByUserId(user_id: string): Promise<UserBankingTransactions[]>;
  abstract getBalanceByUserId(user_id: string): Promise<number>;
  abstract getBalancesForAllUsers(): Promise<
    { user_id: string; balance: number }[]
  >;
  abstract getBalancesForUsersId(
    users_id: string[],
  ): Promise<{ user_id: string; balance: number }[]>;

  abstract getPendingBalanceByUserId(user_id: string): Promise<
    {
      liquidation_date: Date;
      value: number;
      transactions: number;
    }[]
  >;
}
