import { UserBankingSecureReserveModel } from '@/domain/models/user_secure_reserve.model';
import { UserSecureReserveTransactionsEntity } from './../../database/entities/user_secure_reserve_transactions.entity';

import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, MoreThan, Repository } from 'typeorm';

@Injectable()
export class TypeormUserSecureReserveRepository
  implements IEUserSecureReserveRepository
{
  constructor(
    @InjectRepository(UserSecureReserveTransactionsEntity)
    private readonly userSecureReserveRepository: Repository<UserSecureReserveTransactionsEntity>,
  ) {}

  create(
    data: UserBankingSecureReserveModel,
  ): Promise<UserSecureReserveTransactionsEntity> {
    return this.userSecureReserveRepository.save(data.allProps);
  }

  async update(data: UserBankingSecureReserveModel): Promise<void> {
    await this.userSecureReserveRepository.update(data.id, data.allProps);
  }

  findOne(
    options?: FindOneOptions<UserSecureReserveTransactionsEntity>,
  ): Promise<UserSecureReserveTransactionsEntity> {
    return this.userSecureReserveRepository.findOne(options);
  }

  findMany(
    options?: FindManyOptions<UserSecureReserveTransactionsEntity>,
  ): Promise<UserSecureReserveTransactionsEntity[]> {
    return this.userSecureReserveRepository.find({
      ...options,
      where: {
        ...options?.where,
        value: MoreThan(0), // <- adiciona filtro para excluir valores 0 ou negativos
      },
    });
  }

  findById(id: string): Promise<UserSecureReserveTransactionsEntity> {
    return this.userSecureReserveRepository.findOne({
      where: { id },
    });
  }

  findAllByUserId(
    user_id: string,
  ): Promise<UserSecureReserveTransactionsEntity[]> {
    return this.userSecureReserveRepository.find({
      where: { user_id },
    });
  }

  async getBalancesForAllUsers(): Promise<
    { user_id: string; balance: number }[]
  > {
    const query = await this.userSecureReserveRepository
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
    const query = await this.userSecureReserveRepository
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
  async getReservedAmountByUserId(user_id: string): Promise<number> {
    const last_transaction = await this.userSecureReserveRepository.findOne({
      where: { user_id },
      order: { created_at: 'DESC' },
    });

    return last_transaction?.total_amount_reserved || 0;
  }

  async getPendingBalanceByUserId(user_id: string): Promise<
    {
      liquidation_date: Date;
      value: number;
      transactions: number;
    }[]
  > {
    const results = await this.userSecureReserveRepository
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
