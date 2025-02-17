import { UserBankingAccount } from '@/domain/models/user_banking_account.model';
import { UserBankingAccounts } from '@/infra/database/entities/user_banking_accounts.entity';
import { FindOneOptions } from 'typeorm';

export abstract class UserBankingAccountsRepository {
  abstract create(data: UserBankingAccount): Promise<UserBankingAccounts>;
  abstract update(data: UserBankingAccount): Promise<void>;
  abstract findBy(
    where?: FindOneOptions<UserBankingAccounts>,
  ): Promise<UserBankingAccounts>;
  abstract findById(id: string): Promise<UserBankingAccounts>;
  abstract findByUserId(user_id: string): Promise<UserBankingAccounts[]>;
  abstract findByAccountId(account_id: string): Promise<UserBankingAccounts>;
  abstract findAll(): Promise<UserBankingAccounts[]>;
  abstract deleteById(id: string): Promise<void>;
}
