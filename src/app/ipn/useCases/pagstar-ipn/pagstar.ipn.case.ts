import { PaymentService } from '@/app/gateways/services/payment.service';
import { GatewayProvider } from '@/app/gateways/types/gateway_provider';
import { Transaction } from '@/domain/models/transaction.model';
import { TransactionsRepository } from '@/domain/repositories/transactions.repository';
import { Injectable } from '@nestjs/common';
import { CreateTransactionIpnCase } from '../create-transaction-ipn/create_transaction_ipn.case';
import { ServerException } from '@/infra/exception/server.exception';
import { ClientException } from '@/infra/exception/client.exception';

@Injectable()
export class PagstarIpnCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly paymentService: PaymentService,
    private readonly createTransactionIpnCase: CreateTransactionIpnCase,
  ) {}

  async execute(data: {
    external_reference: string;
    transaction_id: string;
  }): Promise<any> {
    try {
      const { external_reference } = data;

      const transaction = await this.transactionsRepository.find({
        where: {
          external_id: String(external_reference),
        },
        relations: ['seller', 'buyer', 'product'],
      });

      if (!transaction) {
        throw new ClientException("Transaction doesn't exists!");
      }

      const payment_data = await this.paymentService.getTransactionStatus(
        String(external_reference),
        GatewayProvider.PAGSTAR,
      );

      if (!payment_data) {
        throw new ClientException("Transaction doesn't exists!");
      }

      if (payment_data.status === transaction.status) return;

      const transactionModel = new Transaction(transaction);

      return await this.createTransactionIpnCase.execute({
        payment_data,
        transaction: transactionModel,
        status: payment_data.status,
      });
    } catch (err) {
      throw new ServerException(err.message, data);
    }
  }
}
