import { UserBankingAccount } from '@/domain/models/user_banking_account.model';
import { UserBankingAccountsRepository } from '@/domain/repositories/user_banking_accounts.repository';
import { UserBankingAccounts } from '@/infra/database/entities/user_banking_accounts.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class TypeormUserBankingAccountsRepository
  implements UserBankingAccountsRepository
{
  constructor(
    @InjectRepository(UserBankingAccounts)
    private readonly userBankingAccountsRepository: Repository<UserBankingAccounts>,
  ) {}

  create(data: UserBankingAccount): Promise<UserBankingAccounts> {
    return this.userBankingAccountsRepository.save(data.allProps);
  }

  async update(data: UserBankingAccount): Promise<void> {
    await this.userBankingAccountsRepository.update(
      {
        id: data.id,
      },
      data.allProps,
    );
  }

  findBy(
    where?: FindOneOptions<UserBankingAccounts>,
  ): Promise<UserBankingAccounts> {
    return this.userBankingAccountsRepository.findOne(where);
  }

  findById(id: string): Promise<UserBankingAccounts> {
    return this.userBankingAccountsRepository.findOneBy({ id });
  }

  findByUserId(user_id: string): Promise<UserBankingAccounts[]> {
    return this.userBankingAccountsRepository.findBy({ user_id });
  }

  findByAccountId(account_id: string): Promise<UserBankingAccounts> {
    return this.userBankingAccountsRepository.findOneBy({ id: account_id });
  }

  findAll(): Promise<UserBankingAccounts[]> {
    return this.userBankingAccountsRepository.find();
  }

  async deleteById(id: string): Promise<void> {
    await this.userBankingAccountsRepository.delete({ id });
  }
}
