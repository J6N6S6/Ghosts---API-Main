// settle-user-reserved-balance.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IEUserSecureReserveRepository } from '@/domain/repositories/user_secure_reserve.repository';
import { UserBankingTransactionsRepository } from '@/domain/repositories';
import { GetUserTaxesCase } from '../get-user-taxes/get-user-taxes.case';
import { LessThan } from 'typeorm';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class SettleUserReservedBalance {
  constructor(
    private readonly userSecureReserveRepository: IEUserSecureReserveRepository,
    private readonly userBankingTransactionsRepository: UserBankingTransactionsRepository,
    private readonly getUserTaxesCase: GetUserTaxesCase,
    @InjectQueue('process_secure_reserve_transaction')
    private readonly processSecureReserveTransactionQueue: Queue,
  ) {}

  async execute(user_id: string): Promise<any> {
    try {
      const taxes = await this.getUserTaxesCase.execute(user_id);
      if (!taxes) return new ClientException('User taxes not found');
      const secureReserveTimeDays = Number(
        taxes?.secure_reserve_config?.reserve_time?.replace('d', ''),
      );

      const offsetDays = secureReserveTimeDays;
      // const offsetDays = 0;

      const currentTime = new Date();
      const localToUtcOffset = currentTime.getTimezoneOffset();
      const utcTime = new Date(
        currentTime.getTime() + localToUtcOffset * 60000,
      );
      const time = new Date(
        utcTime.getTime() - offsetDays * 24 * 60 * 60 * 1000,
      );

      const transactions = await this.userSecureReserveRepository.findMany({
        where: {
          user_id,
          created_at: LessThan(time),
          status: 'in_reserve',
        },
      });

      console.log('TRANSACTIONS: ', transactions.length);
      if (transactions.length === 0) return;

      // Adicionar todas as transações à fila
      const jobs = transactions.map((transaction) =>
        this.processSecureReserveTransactionQueue.add(transaction, {
          jobId: transaction.id,
        }),
      );
      await Promise.all(jobs);
    } catch (error) {
      console.error(error);
    }
  }
}
