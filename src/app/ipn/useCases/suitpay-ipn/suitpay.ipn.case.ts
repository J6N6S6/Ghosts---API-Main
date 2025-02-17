import { PaymentService } from '@/app/gateways/services/payment.service';

import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { ClientException } from '@/infra/exception/client.exception';
import { ServerException } from '@/infra/exception/server.exception';
import { Injectable } from '@nestjs/common';
import { CreateTransactionIpnCase } from '../create-transaction-ipn/create_transaction_ipn.case';

@Injectable()
export class SuitpayIpnCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly paymentService: PaymentService,
    private readonly createTransactionIpnCase: CreateTransactionIpnCase,
  ) {}

  async execute({
    idTransaction,
    statusTransaction,
    typeTransaction,
  }: {
    idTransaction: string;
    statusTransaction: string;
    typeTransaction: string;
  }): Promise<any> {
    try {
      if (typeTransaction === 'PIX_CASHOUT') return;

      const transaction = await this.transactionsRepository.find({
        where: {
          external_id: String(idTransaction),
        },
        relations: ['seller', 'buyer', 'product'],
      });

      if (!transaction) {
        throw new ClientException("Transaction doesn't exists!");
      }

      const status = {
        PAID_OUT: 'APPROVED',
        CANCELED: 'CANCELLED',
        UNPAID: 'CANCELLED',
        CHARGEBACK: 'CHARGEBACK',
        WAITING_FOR_APPROVAL: 'WAITING_PAYMENT',
        PAYMENT_ACCEPT: 'APPROVED',
      }[statusTransaction];

      if (status === transaction.status) return;

      const transactionModel = new Transaction(transaction);

      return await this.createTransactionIpnCase.execute({
        payment_data: {
          status: status,
          status_detail: status,
          payment_id: idTransaction,
          external_reference: idTransaction,
          transaction_amount: transactionModel.transaction_amount,
          total_paid_amount:
            status === 'APPROVED' ? transactionModel.transaction_amount : 0,
          net_received_amount:
            status === 'APPROVED' ? transactionModel.transaction_amount : 0,
          date_approved:
            status === 'APPROVED' ? new Date().toLocaleDateString() : null,
        },
        transaction: transactionModel,
        status: status,
      });
    } catch (err) {
      throw new ServerException(err.message);
    }
  }
}
