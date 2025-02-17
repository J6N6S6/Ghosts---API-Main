import { FindManyOptions, FindOneOptions } from 'typeorm';
import { UserBankingSecureReserveModel } from '../models/user_secure_reserve.model';
import { UserSecureReserveTransactionsEntity } from '@/infra/database/entities';

export abstract class IEUserSecureReserveRepository {
  abstract create(
    data: UserBankingSecureReserveModel,
  ): Promise<UserSecureReserveTransactionsEntity>;
  abstract update(data: UserBankingSecureReserveModel): Promise<void>;
  abstract findOne(
    options?: FindOneOptions<UserSecureReserveTransactionsEntity>,
  ): Promise<UserSecureReserveTransactionsEntity>;
  abstract findMany(
    options?: FindManyOptions<UserSecureReserveTransactionsEntity>,
  ): Promise<UserSecureReserveTransactionsEntity[]>;
  abstract findById(id: string): Promise<UserSecureReserveTransactionsEntity>;
  abstract findAllByUserId(
    user_id: string,
  ): Promise<UserSecureReserveTransactionsEntity[]>;
  abstract getReservedAmountByUserId(user_id: string): Promise<number>;
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
