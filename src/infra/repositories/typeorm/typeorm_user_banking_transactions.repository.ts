import { UserBankingTransaction } from '@/domain/models/user_banking_transaction.model';
import { UserBankingTransactionsRepository } from '@/domain/repositories/user_banking_transactions.repository';
import { UserBankingTransactions } from '@/infra/database/entities/user_banking_transactions.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, MoreThan, Repository } from 'typeorm';

@Injectable()
export class TypeormUserBankingTransactionsRepository
  implements UserBankingTransactionsRepository
{
  constructor(
    @InjectRepository(UserBankingTransactions)
    private readonly userBankingTransactionsRepository: Repository<UserBankingTransactions>,
  ) {}

  create(data: UserBankingTransaction): Promise<UserBankingTransactions> {
    return this.userBankingTransactionsRepository.save(data.allProps);
  }

  async update(data: UserBankingTransaction): Promise<void> {
    await this.userBankingTransactionsRepository.update(data.id, data.allProps);
  }

  findOne(
    options?: FindOneOptions<UserBankingTransactions>,
  ): Promise<UserBankingTransactions> {
    return this.userBankingTransactionsRepository.findOne(options);
  }

  findMany(
    options?: FindManyOptions<UserBankingTransactions>,
  ): Promise<UserBankingTransactions[]> {
    return this.userBankingTransactionsRepository.find(options);
  }

  findById(id: string): Promise<UserBankingTransactions> {
    return this.userBankingTransactionsRepository.findOne({
      where: { id },
    });
  }

  findAllByUserId(user_id: string): Promise<UserBankingTransactions[]> {
    return this.userBankingTransactionsRepository.find({
      where: { user_id },
    });
  }

  async getBalanceByUserId(user_id: string): Promise<number> {
    const last_transaction =
      await this.userBankingTransactionsRepository.findOne({
        where: { user_id },
        order: { created_at: 'DESC' },
      });

    return last_transaction?.balance || 0;
  }

  async getBalancesForAllUsers(): Promise<
    { user_id: string; balance: number }[]
  > {
    const query = await this.userBankingTransactionsRepository
      .query(`SELECT user_id, balance
    FROM user_banking_transactions ubt
    WHERE (created_at, user_id) IN (
      SELECT MAX(created_at) as max_created_at, user_id
      FROM user_banking_transactions
      GROUP BY user_id
    );`);

    return query as { user_id: string; balance: number }[];
  }

  async getBalancesForUsersId(
    users_id: string[],
  ): Promise<{ user_id: string; balance: number }[]> {
    const query = await this.userBankingTransactionsRepository
      .query(`SELECT user_id, balance
    FROM user_banking_transactions ubt
    WHERE (created_at, user_id) IN (
      SELECT MAX(created_at) as max_created_at, user_id
      FROM user_banking_transactions
      WHERE user_id IN (${users_id.map((id) => `'${id}'`).join(',')})
      GROUP BY user_id
    );`);

    return query as { user_id: string; balance: number }[];
  }

  async getPendingBalanceByUserId(user_id: string): Promise<
    {
      liquidation_date: Date;
      value: number;
      transactions: number;
    }[]
  > {
    const results = await this.userBankingTransactionsRepository
      .createQueryBuilder('transaction')
      .select('DATE(transaction.liquidation_date) AS liquidation_date')
      .addSelect('SUM(transaction.value) AS value')
      .addSelect('COUNT(*) AS transactions')
      .where({
        liquidation_date: MoreThan(new Date()),
        user_id,
      })
      .groupBy('DATE(transaction.liquidation_date)')
      .getRawMany();

    // Mapear os resultados para o formato desejado
    const formattedResults = results.map((result) => ({
      liquidation_date: result.liquidation_date,
      value: parseFloat(result.value),
      transactions: parseInt(result.transactions),
    }));

    return formattedResults;
  }
}
