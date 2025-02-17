import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { ConfigService } from '@nestjs/config';

import { Injectable } from '@nestjs/common';

import { CreateTransactionIpnCase } from '../create-transaction-ipn/create_transaction_ipn.case';
import { FirebankingDTO } from './firebanking.ipn.dto';

@Injectable()
export class FirebankingIpnCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly createTransactionIpnCase: CreateTransactionIpnCase,
    private readonly configService: ConfigService,
  ) {}

  async execute(data: FirebankingDTO): Promise<void> {
    try {
      const transaction = await this.transactionsRepository.find({
        where: {
          // id: String(data.businessTransactionId),
          external_id: data.transactionId,
        },
        relations: ['seller', 'buyer', 'product'],
      });

      if (!transaction) {
        throw new ClientException("Transaction doesn't exists!", 404);
      }

      const transactionModel = new Transaction(transaction);

      const status = {
        WAITING_PAYMENT: 'PENDING',
        PAID: 'AUTHORIZED',
        REFUND: 'REFUNDED',
      };

      if (status[data.status] === transaction.status) {
        return;
      }

      const paymentData = {
        total_paid_amount: data.value,
        external_reference: data.transactionId,
        payment_id: data.businessTransactionId,
        status: status[data.status],
        status_detail: status[data.status],
        transaction_amount: data.value,
        date_approved: String(new Date()),
      };

      await this.createTransactionIpnCase.execute({
        payment_data: paymentData,
        transaction: transactionModel,
        status: status[data.status],
      });
    } catch (error) {
      throw new ServerException(error);

      // throw new ServerException(error.message, data);
    }
  }
}
